import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-10 border-b border-slate-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-tight text-black transition-opacity hover:opacity-60"
          >
            GoPublic
          </Link>
          <div className="flex gap-1">
            <Link
              href="/dashboard/visits"
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-black"
            >
              Sessions
            </Link>
            <Link
              href="/dashboard/billing"
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-black"
            >
              Billing
            </Link>
            <Link
              href="/dashboard/social"
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors duration-150 hover:bg-slate-100"
            >
              Social
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
