"use client";

import { useEffect, useState } from "react";
import { AddClientModal, type ClientRecord } from "@/components/add-client-modal";
import { LogSessionModal, type VisitRecord } from "@/components/log-session-modal";

type Client = ClientRecord;

type Visit = VisitRecord;

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
  const [clients, setClients] = useState<Client[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickLogging, setQuickLogging] = useState<string | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showLogSession, setShowLogSession] = useState(false);

  useEffect(() => {
    async function load() {
      const [cr, vr] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/visits"),
      ]);

      const clientsData = cr.ok ? await cr.json() : [];
      const visitsData = vr.ok ? await vr.json() : [];

      setClients(Array.isArray(clientsData) ? clientsData : []);
      setVisits(Array.isArray(visitsData) ? visitsData : []);
      setLoading(false);
    }
    load();
  }, []);

  async function quickLog(clientId: string) {
    setQuickLogging(clientId);
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, date: today }),
    });
    if (res.ok) {
      const visit = await res.json();
      setVisits((prev) => [visit, ...prev]);
    }
    setQuickLogging(null);
  }

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
        <h1 className="text-2xl font-light tracking-tight text-black">
          Visits
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddClient(true)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-black hover:text-black focus:outline-none transition-colors"
          >
            + Add Client
          </button>
          <button
            onClick={() => setShowLogSession(true)}
            disabled={clients.length === 0}
            className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
          >
            + Log Session
          </button>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 px-6 py-16 text-center">
          <p className="mb-1 text-sm font-medium text-gray-700">
            No clients yet
          </p>
          <p className="mb-6 text-sm text-gray-400">
            Add your first client to start logging sessions
          </p>
          <button
            onClick={() => setShowAddClient(true)}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
          >
            + Add Client
          </button>
        </div>
      ) : (
        <>
          {/* Quick-log panel — one button per client, logs today instantly */}
          <div className="mb-8 rounded-xl bg-gray-50 p-4">
            <p className="mb-3 text-xs font-medium text-gray-500">
              Quick-log today
            </p>
            <div className="flex flex-wrap gap-2">
              {clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => quickLog(c.id)}
                  disabled={quickLogging !== null}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 hover:border-black hover:text-black disabled:opacity-40 focus:outline-none transition-colors"
                >
                  {quickLogging === c.id ? "Logging…" : c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Visit history grouped by month */}
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
                    {grouped[month].map((v) => {
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
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onCreated={(client) => setClients((prev) => [client, ...prev])}
        />
      )}
      {showLogSession && (
        <LogSessionModal
          clients={clients}
          onClose={() => setShowLogSession(false)}
          onCreated={(visit) => setVisits((prev) => [visit, ...prev])}
        />
      )}
    </div>
  );
}
