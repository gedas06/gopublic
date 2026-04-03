import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-sm font-medium text-black">GoPublic</span>
          <div className="flex gap-6">
            <Link
              href="/dashboard/visits"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Visits
            </Link>
            <Link
              href="/dashboard/billing"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Billing
            </Link>
            <Link
              href="/dashboard/social"
              className="text-sm text-gray-500 hover:text-black transition-colors"
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
