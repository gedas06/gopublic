import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/linkedin`,
    scope: "openid profile email w_member_social",
    state: userId,
  });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  return NextResponse.redirect(authUrl);
}
