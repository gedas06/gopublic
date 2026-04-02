"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  name: string;
  email?: string;
  rate_amount: number;
  rate_type: string;
}

interface Invoice {
  id: string;
  client_id: string;
  month: string;
  visit_count: number;
  amount: number;
  status: "draft" | "sent" | "paid";
  client_name?: string;
  client_email?: string;
}

function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function groupByMonth(invoices: Invoice[]): Record<string, Invoice[]> {
  const groups: Record<string, Invoice[]> = {};
  for (const inv of invoices) {
    if (!groups[inv.month]) groups[inv.month] = [];
    groups[inv.month].push(inv);
  }
  return groups;
}

export default function BillingPage() {
  const supabase = createClient();
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [generating, setGenerating] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    const { data } = await supabase.from("clients").select("*");
    setClients(data ?? []);
  }, []);

  const fetchInvoices = useCallback(async () => {
    const { data } = await supabase
      .from("invoices")
      .select("*, clients(name, email)")
      .order("created_at", { ascending: false });
    setInvoices(
      (data ?? []).map((inv: { id: string; client_id: string; month: string; visit_count: number; amount: number; status: "draft" | "sent" | "paid"; created_at: string; clients?: { name: string; email: string } }) => ({
        ...inv,
        client_name: inv.clients?.name ?? "",
        client_email: inv.clients?.email ?? "",
      }))
    );
  }, []);

  useEffect(() => {
    Promise.all([fetchClients(), fetchInvoices()]).then(() => setLoading(false));
  }, [fetchClients, fetchInvoices]);

  const handleGenerate = async () => {
    setGenerating(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.user.id;

    for (const client of clients) {
      const { count } = await supabase
        .from("visits")
        .select("*", { count: "exact", head: true })
        .eq("client_id", client.id)
        .gte("date", selectedMonth + "-01")
        .lte("date", selectedMonth + "-31");

      const visitCount = count ?? 0;
      if (visitCount === 0 && client.rate_type === "per_session") continue;

      const amount =
        client.rate_type === "per_session"
          ? visitCount * client.rate_amount
          : client.rate_amount;

      await supabase.from("invoices").upsert(
        {
          client_id: client.id,
          user_id: userId,
          month: selectedMonth,
          visit_count: visitCount,
          amount,
          status: "draft",
        },
        { onConflict: "client_id,month" }
      );
    }

    fetchInvoices();
    setGenerating(false);
  };

  const handleSend = async (invoiceId: string) => {
    setSendingId(invoiceId);
    await supabase
      .from("invoices")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", invoiceId);
    fetchInvoices();
    setSendingId(null);
  };

  const handleMarkPaid = async (invoiceId: string) => {
    await supabase
      .from("invoices")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", invoiceId);
    fetchInvoices();
  };

  async function handleDownloadPdf(invoice: Invoice) {
    const client = clients.find((c) => c.id === invoice.client_id);
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const col2 = 100;
    let y = 30;

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", margin, y);
    y += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`Period: ${invoice.month}`, margin, y);
    doc.setTextColor(0);
    y += 8;

    doc.setDrawColor(220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    const addRow = (label: string, value: string) => {
      doc.setFontSize(11);
      doc.setTextColor(130);
      doc.text(label, margin, y);
      doc.setTextColor(0);
      doc.text(value, col2, y);
      y += 10;
    };

    const rate =
      client?.rate_amount ??
      (invoice.visit_count > 0 ? invoice.amount / invoice.visit_count : 0);

    addRow("Client", client?.name ?? "—");
    addRow("Period", invoice.month);
    addRow("Sessions", String(invoice.visit_count));
    addRow("Rate per session", `\u20ac${rate.toFixed(2)}`);

    y += 2;
    doc.setDrawColor(220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Total due", margin, y);
    doc.text(`\u20ac${invoice.amount.toFixed(2)}`, col2, y);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160);
    doc.text("Generated by GoPublic", margin, 280);

    doc.save(
      `invoice-${invoice.month}-${client?.name ?? invoice.id}.pdf`
        .replace(/\s+/g, "-")
        .toLowerCase()
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      </div>
    );
  }

  const grouped = groupByMonth(invoices);
  const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-light tracking-tight text-black">Billing</h1>

      {/* Month selector + generate */}
      <div className="mb-8 flex items-center gap-3">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
        >
          {generating ? "Generating…" : "Generate Invoices"}
        </button>
      </div>

      {invoices.length === 0 ? (
        <p className="text-sm text-gray-400">
          No invoices yet. Select a month and click Generate Invoices.
        </p>
      ) : (
        <div className="space-y-8">
          {months.map((month) => (
            <div key={month}>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                {formatMonth(month)}
              </p>
              <div className="space-y-2">
                {grouped[month].map((inv) => {
                  const client = clients.find((c) => c.id === inv.client_id);
                  return (
                    <div key={inv.id} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {inv.client_name || client?.name || "Unknown client"}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {inv.visit_count}{" "}
                            {inv.visit_count === 1 ? "session" : "sessions"} ·
                            €{inv.amount.toFixed(2)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            inv.status === "paid"
                              ? "bg-green-50 text-green-700"
                              : inv.status === "sent"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSend(inv.id)}
                          disabled={sendingId === inv.id || inv.status === "paid"}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-black hover:text-black disabled:opacity-40 focus:outline-none"
                        >
                          {sendingId === inv.id ? "Sending…" : "Send email"}
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(inv)}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-black hover:text-black focus:outline-none"
                        >
                          Download PDF
                        </button>
                        {inv.status !== "paid" && (
                          <button
                            onClick={() => handleMarkPaid(inv.id)}
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-black hover:text-black focus:outline-none"
                          >
                            Mark paid
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
