import CtaButton from "./components/CtaButton";

const STEPS = [
  {
    step: "01",
    title: "Add your clients",
    desc: "Enter each client's name, session rate, and billing type. Takes seconds.",
  },
  {
    step: "02",
    title: "Log every session",
    desc: "One tap to record today's visit. Add notes if you need to.",
  },
  {
    step: "03",
    title: "Send invoices automatically",
    desc: "At the end of the month, generate and email invoices to every client in one click.",
  },
];

const STATS = [
  {
    label: "Sessions this month",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Revenue this month",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 7.629A3 3 0 009.17 10.5H7.5m0 0H6m1.5 0v1.5m0-1.5A3 3 0 0112 6a3 3 0 012.121.879M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9a9 9 0 110-18 9 9 0 010 18z" />
      </svg>
    ),
  },
  {
    label: "Invoices sent",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-6 py-24 text-center">

      {/* Hero */}
      <section className="mb-24 flex flex-col items-center gap-6 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          GoPublic
        </p>
        <h1 className="text-5xl font-light tracking-tight text-slate-900">
          Run your practice.
          <br />
          Not your admin.
        </h1>
        <p className="text-base text-slate-500">
          Log sessions, track clients, and send invoices — all in one place.
        </p>
        <CtaButton />
      </section>

      {/* How it works */}
      <section className="mb-24 w-full max-w-2xl">
        <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-slate-400">
          How it works
        </p>
        <div className="flex flex-col gap-8 text-left">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                {step}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats preview */}
      <section className="mb-24 w-full max-w-2xl">
        <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
          What you&apos;ll always know
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map(({ label, icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 bg-white p-6 text-left"
            >
              <div className="mb-4">{icon}</div>
              <p className="text-3xl font-semibold text-slate-900">—</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-xs text-slate-400">
        GoPublic · Built for specialists
      </footer>
    </main>
  );
}
