"use client";

import { useEffect, useState } from "react";

interface Client {
  id: string;
  name: string;
  rate_amount: number;
}

interface Visit {
  id: string;
  client_id: string;
  date: string;
  notes?: string;
}

export default function VisitsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    client_id: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [cr, vr] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/visits"),
      ]);
      setClients((await cr.json()) ?? []);
      setVisits((await vr.json()) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  // This-month stats computed from the visits array — no extra API call
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthVisits = visits.filter((v) => v.date.startsWith(thisMonth));
  const perClient = clients
    .map((c) => ({
      name: c.name,
      count: monthVisits.filter((v) => v.client_id === c.id).length,
    }))
    .filter((c) => c.count > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_id) return;
    setSaving(true);
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setVisits((prev) => [created, ...prev]);
      setForm((f) => ({ ...f, notes: "" }));
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-light tracking-tight text-black">
        Visits
      </h1>

      {/* Stats summary */}
      <div className="mb-6 rounded-xl bg-gray-50 px-5 py-4">
        <div className="flex items-start gap-10">
          <div>
            <p className="text-xs text-gray-500">This month</p>
            <p className="mt-1 text-3xl font-light text-black">
              {monthVisits.length}
            </p>
            <p className="text-xs text-gray-400">sessions</p>
          </div>
          {perClient.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Per client</p>
              <div className="space-y-1.5">
                {perClient.map((c) => (
                  <div key={c.name} className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">{c.name}</span>
                    <span className="text-sm font-medium text-black">
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick-log panel */}
      <div className="mb-8 rounded-xl border border-gray-200 p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-700">
          Log a session
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            value={form.client_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, client_id: e.target.value }))
            }
            required
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            required
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Notes (optional)"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            disabled={saving || !form.client_id}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
          >
            {saving ? "Saving…" : "Log session"}
          </button>
        </form>
      </div>

      {/* Visits list */}
      <div className="space-y-2">
        {visits.length === 0 ? (
          <p className="text-sm text-gray-400">No sessions logged yet.</p>
        ) : (
          visits.map((v) => {
            const client = clients.find((c) => c.id === v.client_id);
            return (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {client?.name ?? "Unknown"}
                  </p>
                  {v.notes && (
                    <p className="text-xs text-gray-400">{v.notes}</p>
                  )}
                </div>
                <p className="text-sm text-gray-500">{v.date}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
