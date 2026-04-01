import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { status: string };
  const updateData: Record<string, unknown> = { status: body.status };
  if (body.status === "paid") {
    updateData.paid_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updateData)
    .eq("id", params.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
