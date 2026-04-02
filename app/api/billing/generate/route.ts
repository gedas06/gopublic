import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { month } = (await request.json()) as { month: string };
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: "Invalid month format. Use YYYY-MM" },
      { status: 400 }
    );
  }

  const [year, m] = month.split("-").map(Number);
  const startDate = `${month}-01`;
  // Last day of the month
  const endDate = new Date(year, m, 0).toISOString().split("T")[0];

  // Fetch visits and clients in parallel
  const [{ data: visits, error: visitsError }, { data: clients, error: clientsError }] =
    await Promise.all([
      supabase
        .from("visits")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate),
      supabase.from("clients").select("*").eq("user_id", userId),
    ]);

  if (visitsError) {
    return NextResponse.json({ error: visitsError.message }, { status: 500 });
  }
  if (clientsError) {
    return NextResponse.json({ error: clientsError.message }, { status: 500 });
  }

  // Count visits per client
  const visitsByClient: Record<string, number> = {};
  for (const v of visits ?? []) {
    visitsByClient[v.client_id] = (visitsByClient[v.client_id] ?? 0) + 1;
  }

  // Build invoice rows — skip clients with no visits that month
  const rows = (clients ?? [])
    .filter((c) => (visitsByClient[c.id] ?? 0) > 0)
    .map((c) => {
      const count = visitsByClient[c.id];
      const amount =
        c.rate_type === "monthly" ? c.rate_amount : count * c.rate_amount;
      return {
        user_id: userId,
        client_id: c.id,
        month,
        visit_count: count,
        amount,
        status: "draft",
      };
    });

  if (rows.length === 0) {
    return NextResponse.json({
      message: "No visits found for this month",
      invoices: [],
    });
  }

  // Upsert — unique constraint on (client_id, month) updates existing drafts
  const { data: invoices, error: upsertError } = await supabase
    .from("invoices")
    .upsert(rows, { onConflict: "client_id,month" })
    .select();

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ invoices });
}
