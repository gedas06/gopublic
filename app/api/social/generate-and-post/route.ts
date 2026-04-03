import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

async function postToLinkedIn(token: string, content: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!profileRes.ok) return { success: false, error: "Could not fetch LinkedIn profile" };
  const profile = await profileRes.json();
  const authorUrn = `urn:li:person:${profile.sub}`;

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }
  const data = await res.json();
  return { success: true, postId: data.id };
}

async function postToFacebook(token: string, pageId: string, content: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: content, access_token: token }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }
  const data = await res.json();
  return { success: true, postId: data.id };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function postToInstagram(_token: string, _igAccountId: string, _content: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  return { success: false, error: "Instagram posting requires an image. Image posting coming soon." };
}

async function postToX(token: string, content: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const tweetText = content.length > 280 ? content.slice(0, 277) + "..." : content;

  const res = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: tweetText }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }
  const data = await res.json();
  return { success: true, postId: data.data?.id };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, topic, platforms, profession, name } = body;

  if (!user_id || !topic || !platforms || platforms.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", user_id)
    .in("platform", platforms);

  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ error: "No connected accounts found for selected platforms" }, { status: 400 });
  }

  const platformList = platforms.join(", ");
  const userContext = [
    name ? `The user's name is ${name}.` : "",
    profession ? `They are a ${profession}.` : "",
  ].filter(Boolean).join(" ");

  const prompt = `You are a social media content writer for specialists like therapists, coaches, and physios.

${userContext}

Generate social media posts about this topic: "${topic}"

Write separate versions for each platform. Format your response as JSON exactly like this:
{
  "linkedin": "post text here (professional tone, 1-3 paragraphs, no hashtags in first line, 3-5 relevant hashtags at end)",
  "facebook": "post text here (warm conversational tone, shorter, 2-3 relevant hashtags at end)",
  "instagram": "post text here (engaging, uses emojis naturally, 5-8 hashtags at end)",
  "x": "post text here (concise, punchy, max 250 characters so we have room, 1-2 hashtags max)"
}

Only include keys for these platforms: ${platformList}
Write in first person as if the specialist is speaking.
Do not include any explanation — only valid JSON.`;

  let generatedContent: Record<string, string> = {};
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      generatedContent = JSON.parse(jsonMatch[0]);
    }
  } catch {
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }

  const { data: postRecord, error: insertError } = await supabase
    .from("social_posts")
    .insert({
      user_id,
      topic,
      generated_content: generatedContent,
      platforms,
      status: "posting",
    })
    .select()
    .single();

  if (insertError || !postRecord) {
    return NextResponse.json({ error: "Failed to create post record" }, { status: 500 });
  }

  const postResults: Record<string, { success: boolean; postId?: string; error?: string }> = {};
  const accountMap = Object.fromEntries(accounts.map((a) => [a.platform, a]));

  await Promise.all(
    platforms.map(async (platform: string) => {
      const account = accountMap[platform];
      const content = generatedContent[platform];

      if (!account || !content) {
        postResults[platform] = { success: false, error: "Account not connected or content missing" };
        return;
      }

      try {
        if (platform === "linkedin") {
          postResults[platform] = await postToLinkedIn(account.access_token, content);
        } else if (platform === "facebook") {
          postResults[platform] = await postToFacebook(account.access_token, account.platform_page_id, content);
        } else if (platform === "instagram") {
          postResults[platform] = await postToInstagram(account.access_token, account.platform_user_id, content);
        } else if (platform === "x") {
          postResults[platform] = await postToX(account.access_token, content);
        }
      } catch (err) {
        postResults[platform] = { success: false, error: String(err) };
      }
    })
  );

  const results = Object.values(postResults);
  const allSuccess = results.every((r) => r.success);
  const allFailed = results.every((r) => !r.success);
  const status = allSuccess ? "posted" : allFailed ? "failed" : "partial";

  await supabase
    .from("social_posts")
    .update({
      status,
      post_results: postResults,
      posted_at: new Date().toISOString(),
    })
    .eq("id", postRecord.id);

  return NextResponse.json({
    postId: postRecord.id,
    status,
    generatedContent,
    results: postResults,
  });
}
