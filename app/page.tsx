import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-white px-6 text-center">
      <div className="space-y-3">
        <h1 className="text-5xl font-light tracking-tight text-black">
          Run your practice.
          <br />
          Not your admin.
        </h1>
        <p className="text-base text-gray-500">
          Log sessions, track clients, and send invoices — in seconds.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Log your first client →
        </Link>
        <Link
          href="/about"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          See how it works
        </Link>
      </div>

      <div className="flex flex-col gap-4 text-left w-full max-w-xs">
        {[
          { step: "1", title: "Add a client", desc: "Takes 10 seconds" },
          { step: "2", title: "Log a session", desc: "One tap, done" },
          {
            step: "3",
            title: "Generate an invoice",
            desc: "Ready in under a minute",
          },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex items-start gap-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
              {step}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
