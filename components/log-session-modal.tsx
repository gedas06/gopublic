"use client";

import { useState } from "react";

export interface VisitRecord {
  id: string;
  client_id: string;
  date: string;
  notes?: string;
}

interface Client {
  id: string;
  name: string;
}

interface Props {
  clients: Client[];
  defaultClientId?: string;
  onClose: () => void;
  onCreated: (visit: VisitRecord) => void;
}

export function LogSessionModal({
  clients,
  defaultClientId,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState({
    client_id: defaultClientId ?? "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const visit = await res.json();
      onCreated(visit);
      onClose();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to log session");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-base font-medium text-gray-900">
          Log session
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
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving || !form.client_id}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
            >
              {saving ? "Saving…" : "Log session"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-black focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
