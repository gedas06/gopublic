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
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=meta_failed`);
  }

  const tokenRes = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
      new URLSearchParams({
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/callback/meta`,
        code,
      })
  );

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=meta_token`);
  }

  const shortLivedToken = (await tokenRes.json()).access_token;

  const longRes = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        fb_exchange_token: shortLivedToken,
      })
  );

  const longData = await longRes.json();
  const longToken = longData.access_token;

  const pagesRes = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${longToken}`
  );
  const pagesData = await pagesRes.json();
  const pages = pagesData.data || [];

  const meRes = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${longToken}&fields=id,name`);
  const meData = await meRes.json();
  const fbUserId = meData.id;
  const fbName = meData.name;

  await supabase.from("social_accounts").upsert({
    user_id: userId,
    platform: "facebook",
    platform_user_id: fbUserId,
    platform_username: fbName,
    platform_page_id: pages[0]?.id || null,
    platform_page_name: pages[0]?.name || null,
    access_token: pages[0]?.access_token || longToken,
    token_expires_at: null,
  }, { onConflict: "user_id,platform" });

  if (pages[0]?.id && pages[0]?.access_token) {
    const igRes = await fetch(
      `https://graph.facebook.com/v18.0/${pages[0].id}?fields=instagram_business_account&access_token=${pages[0].access_token}`
    );
    const igData = await igRes.json();
    const igAccountId = igData.instagram_business_account?.id;

    if (igAccountId) {
      const igUserRes = await fetch(
        `https://graph.facebook.com/v18.0/${igAccountId}?fields=id,username&access_token=${pages[0].access_token}`
      );
      const igUser = await igUserRes.json();

      await supabase.from("social_accounts").upsert({
        user_id: userId,
        platform: "instagram",
        platform_user_id: igAccountId,
        platform_username: igUser.username || "",
        platform_page_id: pages[0].id,
        access_token: pages[0].access_token,
        token_expires_at: null,
      }, { onConflict: "user_id,platform" });
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?connected=facebook`);
}
