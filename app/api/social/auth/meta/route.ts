import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/meta`,
    scope: "pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish,pages_show_list",
    state: userId,
    response_type: "code",
  });

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
  return NextResponse.redirect(authUrl);
}
