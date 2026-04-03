import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const userId = url.searchParams.get("state");

  if (!code || !userId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=linkedin_failed`);
  }

  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/linkedin`,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=linkedin_token`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  const expiresIn = tokenData.expires_in;

  const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let platformUserId = "";
  let platformUsername = "";

  if (profileRes.ok) {
    const profile = await profileRes.json();
    platformUserId = profile.sub || "";
    platformUsername = profile.name || profile.email || "";
  }

  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  await supabase.from("social_accounts").upsert({
    user_id: userId,
    platform: "linkedin",
    platform_user_id: platformUserId,
    platform_username: platformUsername,
    access_token: accessToken,
    token_expires_at: expiresAt,
  }, { onConflict: "user_id,platform" });

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?connected=linkedin`);
}
