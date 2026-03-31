import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface OnboardingAnswers {
  specialisation: string;
  ideal_client: string;
  outcome: string;
  differentiator: string;
  contact_preference: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    userId: string;
    answers?: OnboardingAnswers;
  };
  const { userId, answers } = body;

  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch user metadata via admin API
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.admin.getUserById(userId);

  if (userError || !user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const { first_name, profession, city } = user.user_metadata as {
    first_name: string;
    profession: string;
    city: string;
  };

  // Either use passed answers (and save them) or fetch from DB
  let onboarding: OnboardingAnswers;

  if (answers) {
    await supabase.from("onboarding_data").insert({
      user_id: userId,
      specialisation: answers.specialisation,
      ideal_client: answers.ideal_client,
      outcome: answers.outcome,
      differentiator: answers.differentiator,
      years_experience: "",
      origin_story: "",
      contact_preference: answers.contact_preference,
    });
    onboarding = answers;
  } else {
    const { data, error: onboardingError } = await supabase
      .from("onboarding_data")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (onboardingError || !data) {
      return Response.json(
        { error: "Onboarding data not found" },
        { status: 404 }
      );
    }
    onboarding = data as OnboardingAnswers;
  }

  // Generate page content with Claude
  const prompt = `You are generating professional landing page copy for a solo specialist. Return ONLY a valid JSON object — no explanation, no markdown.

Specialist details:
- Name: ${first_name}
- Profession: ${profession}
- City: ${city}
- Specialisation: ${onboarding.specialisation}
- Ideal client: ${onboarding.ideal_client}
- Client outcomes: ${onboarding.outcome}
- What makes them different: ${onboarding.differentiator}

Return exactly this JSON shape:
{
  "tagline": "one punchy sentence, max 12 words",
  "bio": "3-4 sentences, warm and professional, written in first person",
  "services": ["service description max 10 words", "service description max 10 words", "service description max 10 words"]
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return Response.json({ error: "Generation failed" }, { status: 500 });
  }

  let generated: { tagline: string; bio: string; services: string[] };
  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    generated = JSON.parse(jsonMatch[0]);
  } catch {
    return Response.json(
      { error: "Failed to parse generated content" },
      { status: 500 }
    );
  }

  // Derive contact type and value from onboarding answer
  const contactText = onboarding.contact_preference.toLowerCase();
  let contactPreference = "email";
  let contactValue = user.email ?? "";

  if (
    contactText.includes("book") ||
    contactText.includes("calendar") ||
    contactText.includes("calendly") ||
    contactText.includes("http")
  ) {
    contactPreference = "booking";
    const urlMatch = onboarding.contact_preference.match(/https?:\/\/\S+/);
    contactValue = urlMatch ? urlMatch[0] : "";
  } else if (
    contactText.includes("phone") ||
    contactText.includes("call") ||
    contactText.includes("whatsapp")
  ) {
    contactPreference = "phone";
    const phoneMatch = onboarding.contact_preference.match(
      /[\+\d][\d\s\-\(\)]{6,}/
    );
    contactValue = phoneMatch ? phoneMatch[0].trim() : "";
  }

  // Generate a unique slug
  const base = (first_name || "user").toLowerCase().replace(/[^a-z]/g, "");
  let slug = "";
  let taken = true;

  while (taken) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    slug = `${base}-${suffix}`;
    const { data } = await supabase
      .from("pages")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    taken = !!data;
  }

  // Persist page
  const { error: insertError } = await supabase.from("pages").insert({
    user_id: userId,
    slug,
    first_name: first_name ?? "",
    profession: profession ?? "",
    city: city ?? "",
    tagline: generated.tagline,
    bio: generated.bio,
    services: generated.services,
    contact_preference: contactPreference,
    contact_value: contactValue,
    accent_colour: "#000000",
  });

  if (insertError) {
    return Response.json({ error: "Failed to save page" }, { status: 500 });
  }

  return Response.json({ slug });
}
