import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ accounts: [] });

  const { data, error } = await supabase
    .from("social_accounts")
    .select("id, platform, platform_username, platform_page_name, connected_at")
    .eq("user_id", userId)
    .order("connected_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ accounts: data || [] });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  const platform = url.searchParams.get("platform");
  if (!userId || !platform) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const { error } = await supabase
    .from("social_accounts")
    .delete()
    .eq("user_id", userId)
    .eq("platform", platform);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
