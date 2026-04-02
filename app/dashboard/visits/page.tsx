"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  name: string;
  email?: string;
  rate_type: string;
  rate_amount: number;
}

interface Visit {
  id: string;
  client_id: string;
  date: string;
  notes?: string;
  client_name?: string;
}

function groupByMonth(visits: Visit[]): Record<string, Visit[]> {
  const groups: Record<string, Visit[]> = {};
  for (const v of visits) {
    const month = v.date.slice(0, 7);
    if (!groups[month]) groups[month] = [];
    groups[month].push(v);
  }
  return groups;
}

function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function VisitsPage() {
  const supabase = createClient();

  const [clients, setClients] = useState<Client[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVisit, setLoadingVisit] = useState<string | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showLogVisit, setShowLogVisit] = useState(false);
  const [savingClient, setSavingClient] = useState(false);
  const [savingVisit, setSavingVisit] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", rate_type: "per_session", rate_amount: "" });
  const [visitForm, setVisitForm] = useState({ client_id: "", date: new Date().toISOString().split("T")[0], notes: "" });

  const fetchClients = useCallback(async () => {
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setClients(data ?? []);
  }, []);

  const fetchVisits = useCallback(async () => {
    const { data } = await supabase
      .from("visits")
      .select("*, clients(name)")
      .order("date", { ascending: false });
    setVisits(
      (data ?? []).map((v: { id: string; client_id: string; date: string; notes?: string; clients?: { name: string } }) => ({
        id: v.id,
        client_id: v.client_id,
        client_name: v.clients?.name ?? "",
        date: v.date,
        notes: v.notes,
      }))
    );
  }, []);

  useEffect(() => {
    Promise.all([fetchClients(), fetchVisits()]).then(() => setLoading(false));
  }, [fetchClients, fetchVisits]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingClient(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("CLIENT SIDE SESSION:", session)
      console.log("CLIENT SIDE USER:", session?.user?.id)
      if (!session) throw new Error("Not logged in");
      const userId = session.user.id;

      const { error } = await supabase.from("clients").insert({
        name: newClient.name,
        email: newClient.email || null,
        rate_type: newClient.rate_type,
        rate_amount: parseFloat(newClient.rate_amount),
        user_id: userId,
      });

      if (error) throw error;

      setNewClient({ name: "", email: "", rate_type: "per_session", rate_amount: "" });
      setShowAddClient(false);
      await fetchClients();
    } catch (err) {
      console.error("Failed to add client:", err);
      alert("Failed to add client. Please try again.");
    } finally {
      setSavingClient(false);
    }
  };

  const handleLogVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVisit(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");
      const userId = session.user.id;

      const { error } = await supabase.from("visits").insert({
        client_id: visitForm.client_id,
        date: visitForm.date,
        notes: visitForm.notes || null,
        user_id: userId,
      });

      if (error) throw error;
      setVisitForm({ client_id: "", date: new Date().toISOString().split("T")[0], notes: "" });
      setShowLogVisit(false);
      await fetchVisits();
    } catch (err) {
      console.error("Failed to log visit:", err);
      alert("Failed to log visit. Please try again.");
    } finally {
      setSavingVisit(false);
    }
  };

  const handleQuickLog = async (clientId: string) => {
    setLoadingVisit(clientId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");
      const userId = session.user.id;

      const { error } = await supabase.from("visits").insert({
        client_id: clientId,
        date: new Date().toISOString().split("T")[0],
        user_id: userId,
      });

      if (error) throw error;
      await fetchVisits();
    } catch (err) {
      console.error("Failed to log visit:", err);
    } finally {
      setLoadingVisit(null);
    }
  };

  const grouped = groupByMonth(visits);
  const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-tight text-black">Visits</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddClient(true)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-black hover:text-black focus:outline-none transition-colors"
          >
            + Add Client
          </button>
          <button
            onClick={() => setShowLogVisit(true)}
            disabled={clients.length === 0}
            className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
          >
            + Log Session
          </button>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 px-6 py-16 text-center">
          <p className="mb-1 text-sm font-medium text-gray-700">No clients yet</p>
          <p className="mb-6 text-sm text-gray-400">Add your first client to start logging sessions</p>
          <button
            onClick={() => setShowAddClient(true)}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
          >
            + Add Client
          </button>
        </div>
      ) : (
        <>
          {/* Quick-log panel */}
          <div className="mb-8 rounded-xl bg-gray-50 p-4">
            <p className="mb-3 text-xs font-medium text-gray-500">Quick-log today</p>
            <div className="flex flex-wrap gap-2">
              {clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleQuickLog(c.id)}
                  disabled={loadingVisit !== null}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 hover:border-black hover:text-black disabled:opacity-40 focus:outline-none transition-colors"
                >
                  {loadingVisit === c.id ? "Logging…" : c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Visit history */}
          {visits.length === 0 ? (
            <p className="text-sm text-gray-400">No sessions logged yet.</p>
          ) : (
            <div className="space-y-8">
              {months.map((month) => (
                <div key={month}>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                    {formatMonth(month)}
                  </p>
                  <div className="space-y-2">
                    {grouped[month].map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {v.client_name || clients.find((c) => c.id === v.client_id)?.name || "Unknown"}
                          </p>
                          {v.notes && <p className="text-xs text-gray-400">{v.notes}</p>}
                        </div>
                        <p className="text-sm text-gray-500">{v.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={(e) => e.target === e.currentTarget && setShowAddClient(false)}
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-base font-medium text-gray-900">Add client</h2>
            <form onSubmit={handleAddClient} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newClient.name}
                onChange={(e) => setNewClient((f) => ({ ...f, name: e.target.value }))}
                required
                autoFocus
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newClient.email}
                onChange={(e) => setNewClient((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <select
                value={newClient.rate_type}
                onChange={(e) => setNewClient((f) => ({ ...f, rate_type: e.target.value }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="per_session">Per session</option>
                <option value="monthly">Monthly flat rate</option>
              </select>
              <input
                type="number"
                placeholder="Rate (€)"
                value={newClient.rate_amount}
                onChange={(e) => setNewClient((f) => ({ ...f, rate_amount: e.target.value }))}
                required
                min="0"
                step="0.01"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={savingClient}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
                >
                  {savingClient ? "Saving…" : "Add client"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-black focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Visit Modal */}
      {showLogVisit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={(e) => e.target === e.currentTarget && setShowLogVisit(false)}
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-base font-medium text-gray-900">Log session</h2>
            <form onSubmit={handleLogVisit} className="space-y-3">
              <select
                value={visitForm.client_id}
                onChange={(e) => setVisitForm((f) => ({ ...f, client_id: e.target.value }))}
                required
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="" disabled>Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={visitForm.date}
                onChange={(e) => setVisitForm((f) => ({ ...f, date: e.target.value }))}
                required
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={visitForm.notes}
                onChange={(e) => setVisitForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={savingVisit}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
                >
                  {savingVisit ? "Saving…" : "Log session"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogVisit(false)}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-black focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
