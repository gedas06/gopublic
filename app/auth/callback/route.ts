// To enable Google login:
// 1. Go to supabase.com → your project → Authentication → Providers → Google → enable it
// 2. Create OAuth credentials at console.cloud.google.com → APIs & Services → Credentials
// 3. Add authorised redirect URI: https://[your-supabase-ref].supabase.co/auth/v1/callback
// 4. Paste Client ID and Client Secret into Supabase Google provider settings

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/signup?error=auth_failed`);
}
