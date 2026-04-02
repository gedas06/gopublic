"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AddClientModal, type ClientRecord } from "@/components/add-client-modal";
import { LogSessionModal, type VisitRecord } from "@/components/log-session-modal";

type Client = ClientRecord;
type Visit = VisitRecord;
type Invoice = { month: string; amount: number; status: string };

function greeting(firstName?: string): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return firstName ? `Good ${time}, ${firstName}` : `Good ${time}`;
}

export default function DashboardPage() {
  const [firstName, setFirstName] = useState<string | undefined>();
  const [clients, setClients] = useState<Client[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showLogSession, setShowLogSession] = useState(false);

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
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthVisits = visits.filter((v) => v.date.startsWith(thisMonth));
  const revenueThisMonth = invoices
    .filter((i) => i.month === thisMonth && (i.status === "sent" || i.status === "paid"))
    .reduce((sum, i) => sum + i.amount, 0);
  const totalRevenue = invoices
    .filter((i) => i.status === "sent" || i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">

      {/* Greeting */}
      <h1 className="mb-6 text-2xl font-light tracking-tight text-slate-900">
        {greeting(firstName)}
      </h1>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Clients", value: String(clients.length) },
          { label: "Sessions this month", value: String(monthVisits.length) },
          { label: "Revenue this month", value: `€${revenueThisMonth.toFixed(2)}` },
          { label: "Total revenue", value: `€${totalRevenue.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5"
          >
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {clients.length === 0 && (
        <div className="mb-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="mb-4 text-sm text-slate-600">
            Add your first client to get started
          </p>
          <Link
            href="/dashboard/visits"
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            + Add client
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setShowAddClient(true)}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-black hover:text-black focus:outline-none transition-colors"
        >
          + Add Client
        </button>
        <button
          onClick={() => setShowLogSession(true)}
          disabled={clients.length === 0}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
        >
          + Log Session
        </button>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/visits"
          className="rounded-xl border border-gray-200 p-4 hover:border-black transition-colors"
        >
          <p className="text-sm font-medium text-gray-900">Visits</p>
          <p className="mt-1 text-xs text-gray-400">Log and review sessions</p>
        </Link>
        <Link
          href="/dashboard/billing"
          className="rounded-xl border border-gray-200 p-4 hover:border-black transition-colors"
        >
          <p className="text-sm font-medium text-gray-900">Billing</p>
          <p className="mt-1 text-xs text-gray-400">Generate and send invoices</p>
        </Link>
        <div className="rounded-xl border border-gray-100 p-4 opacity-50 cursor-default">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-500">Social</p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
              Coming soon
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Content scheduling</p>
        </div>
        <div className="rounded-xl border border-gray-100 p-4 opacity-50 cursor-default">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-500">Website</p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
              Coming soon
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Your public page</p>
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
