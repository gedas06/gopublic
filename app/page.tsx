import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-sm md:px-12">
        <span className="text-lg font-bold tracking-tight text-slate-900">GoPublic</span>
        <Link
          href="/signup"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Get started free
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center overflow-hidden bg-white px-6 py-28 text-center md:py-40">
        {/* Soft background accent */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-amber-50 opacity-60 blur-3xl" />
        </div>

        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700">
            Practice management for solo specialists
          </span>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-7xl">
            Run your practice.
            <br />
            <span className="text-amber-500">Get found online.</span>
          </h1>

          <p className="max-w-xl text-lg text-slate-500 md:text-xl">
            GoPublic handles your visits, billing, and public profile — so you spend more time with clients, less time on admin.
          </p>

          <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-105 hover:bg-slate-700 active:scale-100"
            >
              Get started free
            </Link>
            <a
              href="#product"
              className="text-sm font-medium text-slate-500 underline-offset-4 transition hover:text-slate-900 hover:underline"
            >
              See how it works ↓
            </a>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Used by speech therapists, physios, and coaches — no credit card needed
          </p>
        </div>
      </section>

      {/* PRODUCT VISUAL */}
      <section id="product" className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Two tools. One place.
          </p>
          <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Everything your practice needs
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* Dashboard mockup */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-slate-500">Manage your practice</p>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="ml-3 flex-1 rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-400">app.gopublic.io/dashboard</span>
                </div>
                {/* App layout */}
                <div className="flex min-h-[320px]">
                  {/* Sidebar */}
                  <div className="flex w-14 flex-col items-center gap-5 border-r border-slate-100 bg-slate-900 py-5 md:w-44 md:items-start md:px-4">
                    <span className="hidden text-xs font-bold text-white md:block">GoPublic</span>
                    {[
                      { label: "Home", active: false },
                      { label: "Visits", active: true },
                      { label: "Billing", active: false },
                      { label: "Social", soon: true },
                      { label: "Website", soon: true },
                    ].map(({ label, active, soon }) => (
                      <div
                        key={label}
                        className={`hidden w-full rounded-lg px-3 py-2 text-xs font-medium md:flex md:items-center md:gap-2 ${
                          active
                            ? "bg-white text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {label}
                        {soon && (
                          <span className="ml-auto rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400">
                            Soon
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Main */}
                  <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">March 2025</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <p className="text-xs text-slate-400">Sessions</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">12</p>
                      </div>
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <p className="text-xs text-slate-400">Revenue</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">€480</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-3 shadow-sm">
                      <p className="mb-2 text-xs font-semibold text-slate-400">Recent visits</p>
                      {[
                        { initials: "LV", name: "Lena V.", date: "Mar 28" },
                        { initials: "TK", name: "Tom K.", date: "Mar 26" },
                        { initials: "AM", name: "Anna M.", date: "Mar 25" },
                      ].map(({ initials, name, date }) => (
                        <div key={name} className="flex items-center gap-3 py-1.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                            {initials}
                          </span>
                          <span className="flex-1 text-xs text-slate-700">{name}</span>
                          <span className="text-[10px] text-slate-400">{date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Public profile mockup */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-slate-500">Your public profile — live in minutes</p>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                {/* Phone chrome */}
                <div className="flex items-center justify-center border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="rounded-full bg-slate-200 px-8 py-1 text-[10px] text-slate-400">gopublic.io/p/emma-s</span>
                </div>
                {/* Profile content */}
                <div className="flex flex-col items-center gap-4 px-6 py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
                    ES
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900">Emma S.</p>
                    <p className="text-sm text-slate-500">Speech Therapist · Amsterdam</p>
                  </div>
                  <p className="max-w-xs text-center text-sm text-slate-500">
                    Helping children and adults find their voice. 8+ years of experience in articulation and fluency.
                  </p>
                  <div className="flex w-full flex-col gap-2">
                    {["Articulation therapy", "Fluency coaching", "Voice training"].map((s) => (
                      <div key={s} className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        {s}
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-700">
                    Book a session
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            How it works
          </p>
          <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Up and running in minutes
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Sign up and add your clients",
                desc: "Enter each client's name, session rate, and billing type. Takes 2 minutes.",
              },
              {
                num: "02",
                title: "Log visits, generate invoices",
                desc: "One tap per session. At end of month, invoices are generated and sent automatically.",
              },
              {
                num: "03",
                title: "Your profile goes live",
                desc: "Clients find you, colleagues refer you — without you lifting a finger.",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-lg font-black text-amber-500">
                  {num}
                </span>
                <p className="text-base font-bold text-slate-900">{title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Why GoPublic
          </p>
          <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Built for the way you work
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: "🗓",
                title: "Stop losing track",
                desc: "Log every session in one tap. Always know who attended and what they owe.",
              },
              {
                icon: "💸",
                title: "Get paid faster",
                desc: "Generate and send professional invoices at end of month — in seconds, not hours.",
              },
              {
                icon: "🌐",
                title: "Get found online",
                desc: "A clean public page that shows your services and builds trust with new clients.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-100 bg-white p-7 transition hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="mb-4 block text-3xl">{icon}</span>
                <p className="mb-2 text-base font-bold text-slate-900">{title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-white px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-16 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Trusted by specialists
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                quote: "I used to track sessions in a notebook. Now I send invoices in 30 seconds.",
                name: "Laura D.",
                role: "Speech therapist, Rotterdam",
              },
              {
                quote: "My public page has brought in three new clients this month. I didn't have to do anything.",
                name: "Marta K.",
                role: "Physiotherapist, Vilnius",
              },
              {
                quote: "It's the first tool I've used that actually understands how a solo practice works.",
                name: "Tim V.",
                role: "Life coach, Utrecht",
              },
            ].map(({ quote, name, role }) => (
              <div key={name} className="rounded-2xl bg-slate-50 p-7">
                <p className="mb-6 text-sm leading-relaxed text-slate-700">&ldquo;{quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Profession scroll strip */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {[
              "Speech therapist",
              "Physiotherapist",
              "Life coach",
              "Occupational therapist",
              "Dietitian",
              "Psychologist",
              "Personal trainer",
              "Music therapist",
            ].map((p) => (
              <span
                key={p}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-slate-900 px-6 py-28 text-center md:px-12">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Your practice deserves better tools.
          </h2>
          <p className="mb-10 text-lg text-slate-400">
            Set up in under 5 minutes. No credit card needed.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-full bg-amber-400 px-10 py-4 text-base font-bold text-slate-900 shadow-lg transition hover:scale-105 hover:bg-amber-300 active:scale-100"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white px-6 py-8 text-center text-xs text-slate-400">
        © 2025 GoPublic · Built for specialists
      </footer>

    </main>
  );
}
