"use client";

import { useState } from "react";

export interface ClientRecord {
  id: string;
  name: string;
  email?: string;
  rate_type: string;
  rate_amount: number;
}

interface Props {
  onClose: () => void;
  onCreated: (client: ClientRecord) => void;
}

export function AddClientModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rate_type: "per_session",
    rate_amount: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        rate_amount: parseFloat(form.rate_amount) || 0,
      }),
    });
    if (res.ok) {
      const client = await res.json();
      onCreated(client);
      onClose();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to create client");
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
          Add client
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            autoFocus
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <select
            value={form.rate_type}
            onChange={(e) =>
              setForm((f) => ({ ...f, rate_type: e.target.value }))
            }
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="per_session">Per session</option>
            <option value="monthly">Monthly flat rate</option>
          </select>
          <input
            type="number"
            placeholder="Rate (€)"
            value={form.rate_amount}
            onChange={(e) =>
              setForm((f) => ({ ...f, rate_amount: e.target.value }))
            }
            required
            min="0"
            step="0.01"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
            >
              {saving ? "Saving…" : "Add client"}
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
