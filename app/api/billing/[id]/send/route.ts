import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(
  _request: Request,
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

  const resend = new Resend(process.env.RESEND_API_KEY);
  const invoiceId = params.id;

  // Fetch the invoice (scoped to this user)
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .eq("user_id", userId)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // Fetch the client
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", invoice.client_id)
    .eq("user_id", userId)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (!client.email) {
    return NextResponse.json(
      { error: "Client has no email address" },
      { status: 422 }
    );
  }

  const sessionRate =
    invoice.visit_count > 0
      ? (invoice.amount / invoice.visit_count).toFixed(2)
      : "0.00";

  const { error: emailError } = await resend.emails.send({
    from: "GoPublic Billing <noreply@gopublic.app>",
    to: client.email,
    subject: `Invoice for ${invoice.month} — ${client.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="margin-bottom: 4px;">Invoice</h2>
        <p style="color: #555; margin-top: 0;">For services rendered in <strong>${invoice.month}</strong></p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #555;">Client</td>
            <td style="padding: 10px 0; text-align: right;">${client.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #555;">Period</td>
            <td style="padding: 10px 0; text-align: right;">${invoice.month}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #555;">Sessions</td>
            <td style="padding: 10px 0; text-align: right;">${invoice.visit_count}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #555;">Rate per session</td>
            <td style="padding: 10px 0; text-align: right;">€${sessionRate}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold;">Total due</td>
            <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px;">€${invoice.amount.toFixed(2)}</td>
          </tr>
        </table>

        <p style="color: #555; font-size: 14px;">Please arrange payment at your earliest convenience. Thank you for your trust.</p>
      </div>
    `,
  });

  if (emailError) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }

  // Mark invoice as sent
  const { error: updateError } = await supabase
    .from("invoices")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", invoiceId)
    .eq("user_id", userId);

  if (updateError) {
    return NextResponse.json(
      { error: "Email sent but failed to update invoice status" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
