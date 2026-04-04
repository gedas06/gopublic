"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AddClientModal, type ClientRecord } from "@/components/add-client-modal";
import { LogSessionModal, type VisitRecord } from "@/components/log-session-modal";

type Client = ClientRecord;
type Visit = VisitRecord;
type Invoice = { id: string; client_id: string; month: string; amount: number; status: string };
type FeedFilter = "all" | "sessions" | "invoices" | "clients";

function greeting(firstName?: string): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return firstName ? `Good ${time}, ${firstName}` : `Good ${time}`;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split("T")[0];
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 0) return diffHours <= 1 ? "just now" : `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("default", { month: "long", year: "numeric" });
}

export default function DashboardPage() {
  const [firstName, setFirstName] = useState<string | undefined>();
  const [clients, setClients] = useState<Client[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showLogSession, setShowLogSession] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const [cr, vr, ir] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/visits"),
        fetch("/api/billing"),
      ]);

      const clientsData = cr.ok ? await cr.json() : {};
      const visitsData = vr.ok ? await vr.json() : {};
      const invoicesData = ir.ok ? await ir.json() : {};

      setClients(Array.isArray(clientsData.clients) ? clientsData.clients : []);
      setVisits(Array.isArray(visitsData) ? visitsData : []);
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);

      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("user_id", userId)
          .single();
        setFirstName(profile?.first_name ?? undefined);
      }

      setLoading(false);
    }
    load();
  }, []);

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const weekStart = getWeekStart();

  const monthVisits = visits.filter((v) => v.date.startsWith(thisMonth));
  const weekVisits = visits.filter((v) => v.date >= weekStart);
  const revenueThisMonth = invoices
    .filter((i) => i.month === thisMonth && (i.status === "sent" || i.status === "paid"))
    .reduce((sum, i) => sum + i.amount, 0);
  const timeSavedMinutes = monthVisits.length * 10;
  const pendingInvoices = invoices.filter((i) => i.status === "draft");
  const todaySessions = visits.filter((v) => v.date === today);

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c]));

  // Feed items
  const sortedVisits = [...visits].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const sortedInvoices = [...invoices].sort((a, b) => b.month.localeCompare(a.month)).slice(0, 8);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {greeting(firstName)}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening today</p>
      </div>

      {/* Smart Actions */}
      {(clients.length > 0 || pendingInvoices.length > 0) && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Smart Actions</p>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm divide-y divide-slate-50">
            {todaySessions.length === 0 && clients.length > 0 && (
              <button
                onClick={() => setShowLogSession(true)}
                className="flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-slate-50 active:bg-slate-100"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <svg className="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">No sessions logged today</p>
                  <p className="text-xs text-slate-400">Tap to log a session now</p>
                </div>
                <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            {pendingInvoices.length > 0 && (
              <Link
                href="/dashboard/billing"
                className="flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-slate-50 active:bg-slate-100"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {pendingInvoices.length} invoice{pendingInvoices.length > 1 ? "s" : ""} ready to send
                  </p>
                  <p className="text-xs text-slate-400">Tap to review and send</p>
                </div>
                <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
            {todaySessions.length > 0 && pendingInvoices.length === 0 && (
              <div className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700">All caught up — great work today.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Today's focus */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Today&apos;s focus</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => setShowLogSession(true)}
            disabled={clients.length === 0}
            className="flex-1 cursor-pointer rounded-2xl bg-black px-5 py-4 text-left transition-all duration-150 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <p className="text-sm font-semibold text-white">Log today&apos;s session</p>
            <p className="mt-0.5 text-xs text-slate-400">Quick-add a visit for a client</p>
          </button>
          <button
            onClick={() => setShowAddClient(true)}
            className="flex-1 cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition-all duration-150 hover:border-slate-400 hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]"
          >
            <p className="text-sm font-semibold text-slate-900">Add new client</p>
            <p className="mt-0.5 text-xs text-slate-500">Name, rate, and billing type</p>
          </button>
          <Link
            href="/dashboard/billing"
            className="flex-1 cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition-all duration-150 hover:border-slate-400 hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]"
          >
            <p className="text-sm font-semibold text-slate-900">Create invoice</p>
            <p className="mt-0.5 text-xs text-slate-500">Generate and send to clients</p>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Overview</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Active clients", value: String(clients.length), icon: "👤" },
            { label: "Sessions this week", value: String(weekVisits.length), icon: "📋" },
            { label: "Revenue this month", value: `€${revenueThisMonth.toFixed(0)}`, icon: "💶" },
            { label: "Time saved", value: `${timeSavedMinutes}m`, icon: "⏱" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-lg">{icon}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Automation */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Automation</p>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            {[
              { label: "Invoices auto-generated", detail: `${invoices.length} total` },
              { label: "Sessions tracked automatically", detail: `${visits.length} logged` },
              { label: "Time saved this week", detail: `~${weekVisits.length * 10} minutes` },
            ].map(({ label, detail }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700">{label}</p>
                </div>
                <p className="text-xs text-slate-400">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {visits.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Recent activity</p>

          {/* Filter tabs */}
          <div className="mb-3 flex gap-1">
            {(["all", "sessions", "invoices", "clients"] as FeedFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFeedFilter(f)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-150 ${
                  feedFilter === f
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Session items */}
          {(feedFilter === "all" || feedFilter === "sessions") && sortedVisits.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              {sortedVisits.slice(0, feedFilter === "sessions" ? 8 : 5).map((visit, i) => {
                const client = clientMap[visit.client_id];
                const isExpanded = expandedId === visit.id;
                const isLast = i === (feedFilter === "sessions" ? Math.min(sortedVisits.length, 8) : Math.min(sortedVisits.length, 5)) - 1;
                return (
                  <div key={visit.id} className={!isLast ? "border-b border-slate-50" : ""}>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : visit.id)}
                      className="flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-slate-50 active:bg-slate-100"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          Session{client ? ` with ${client.name}` : ""}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {client?.rate_type === "per_session" ? `€${client.rate_amount}` : "Monthly rate"}
                          {visit.notes ? ` · ${visit.notes}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <p className="text-xs text-slate-400">{relativeTime(visit.date)}</p>
                        <svg
                          className={`h-4 w-4 text-slate-300 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded view */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                        <div className="mb-3 space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Client</span>
                            <span className="font-medium text-slate-800">{client?.name ?? "—"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Date</span>
                            <span className="font-medium text-slate-800">{visit.date}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Rate</span>
                            <span className="font-medium text-slate-800">
                              {client ? (client.rate_type === "per_session" ? `€${client.rate_amount} / session` : `€${client.rate_amount} / month`) : "—"}
                            </span>
                          </div>
                          {visit.notes && (
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Notes</span>
                              <span className="font-medium text-slate-800 text-right max-w-[60%]">{visit.notes}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowLogSession(true)}
                            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all duration-150 hover:border-slate-400 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this session?")) {
                                setVisits((prev) => prev.filter((v) => v.id !== visit.id));
                                setExpandedId(null);
                                fetch(`/api/visits/${visit.id}`, { method: "DELETE" }).catch(() => {});
                              }
                            }}
                            className="cursor-pointer rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition-all duration-150 hover:border-red-300 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Invoice items */}
          {(feedFilter === "all" || feedFilter === "invoices") && sortedInvoices.length > 0 && (
            <div className={`rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden ${feedFilter === "all" && sortedVisits.length > 0 ? "mt-3" : ""}`}>
              {sortedInvoices.slice(0, feedFilter === "invoices" ? 8 : 3).map((inv, i) => {
                const client = clientMap[inv.client_id];
                const isLast = i === (feedFilter === "invoices" ? Math.min(sortedInvoices.length, 8) : Math.min(sortedInvoices.length, 3)) - 1;
                const statusColor = inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : inv.status === "sent" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600";
                return (
                  <div key={inv.id ?? `${inv.client_id}-${inv.month}`} className={!isLast ? "border-b border-slate-50" : ""}>
                    <div className="flex items-center gap-3 px-5 py-3.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          Invoice{client ? ` — ${client.name}` : ""}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">{monthLabel(inv.month)} · €{inv.amount.toFixed(2)}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clients tab */}
          {feedFilter === "clients" && clients.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              {clients.map((client, i) => (
                <div key={client.id} className={i < clients.length - 1 ? "border-b border-slate-50" : ""}>
                  <div className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800">{client.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {client.email ?? "No email"} · {client.rate_type === "per_session" ? `€${client.rate_amount}/session` : `€${client.rate_amount}/month`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {feedFilter === "clients" && clients.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
              <p className="text-sm text-slate-400">No clients yet</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {clients.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <p className="mb-4 text-sm text-slate-600">Add your first client to get started</p>
          <button
            onClick={() => setShowAddClient(true)}
            className="cursor-pointer rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
          >
            + Add client
          </button>
        </div>
      )}

      {/* Modules */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">Modules</p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/visits"
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-150 hover:border-slate-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 transition-colors duration-150 group-hover:bg-slate-900">
              <svg className="h-4 w-4 text-slate-600 transition-colors duration-150 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">Sessions</p>
            <p className="mt-0.5 text-xs text-slate-500">Log and review visits</p>
          </Link>
          <Link
            href="/dashboard/billing"
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-150 hover:border-slate-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 transition-colors duration-150 group-hover:bg-slate-900">
              <svg className="h-4 w-4 text-slate-600 transition-colors duration-150 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">Billing</p>
            <p className="mt-0.5 text-xs text-slate-500">Generate and send invoices</p>
          </Link>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-400">Social</p>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-400">Soon</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">Content scheduling</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-400">Website</p>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-400">Soon</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">Your public page</p>
          </div>
        </div>
      </div>

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
