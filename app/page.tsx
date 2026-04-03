import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans antialiased">

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-base font-bold tracking-tight text-slate-900">GoPublic</span>
          <div className="flex items-center gap-6">
            <a href="#how" className="hidden text-sm text-slate-500 hover:text-slate-900 transition-colors sm:block">How it works</a>
            <a href="#builders" className="hidden text-sm text-slate-500 hover:text-slate-900 transition-colors sm:block">Examples</a>
            <Link
              href="/signup"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-white px-6 pt-24 pb-20 text-center md:pt-36 md:pb-28">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
          }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-100 opacity-40 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            2,400+ builders sharing their journey
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
            Show your journey.
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Attract clients, jobs,
            </span>
            <br />
            and followers.
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-500 md:text-xl">
            GoPublic gives you a page that shows what you&apos;re building and proves you&apos;re the real thing — so opportunities come to you.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="group rounded-full bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl transition hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start building in public →
            </Link>
            <a
              href="#preview"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900 underline-offset-4 hover:underline"
            >
              See examples
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-400">Free to start · No credit card needed</p>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section id="preview" className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Your public page
          </p>
          <h2 className="mb-14 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            One link that does the selling for you
          </h2>

          {/* Mockup */}
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200">
            {/* Browser bar */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-red-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-green-300" />
              <div className="ml-3 flex flex-1 items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5">
                <span className="text-[10px] text-slate-400">🔒</span>
                <span className="text-xs text-slate-400">gopublic.io/p/alex-chen</span>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start gap-5 mb-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-black text-white shadow-lg">
                  AC
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">Alex Chen</h3>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                      Open to work
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Full-stack developer · Building in public since Jan 2024</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs font-semibold text-slate-900">4.2k <span className="font-normal text-slate-400">followers</span></span>
                    <span className="text-xs font-semibold text-slate-900">38 <span className="font-normal text-slate-400">wins</span></span>
                    <span className="text-xs font-semibold text-slate-900">12 <span className="font-normal text-slate-400">projects</span></span>
                  </div>
                </div>
              </div>

              {/* Current project */}
              <div className="mb-6 rounded-2xl border border-violet-100 bg-violet-50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">Current project</p>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <p className="font-bold text-slate-900 mb-1">SaaS analytics dashboard</p>
                <p className="text-sm text-slate-500 mb-3">Real-time metrics for indie hackers. Currently in beta with 120 users.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-violet-200">
                    <div className="h-full w-[65%] rounded-full bg-violet-500" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">65% complete</span>
                </div>
              </div>

              {/* Recent updates */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Recent updates</p>
                <div className="flex flex-col gap-3">
                  {[
                    { emoji: "🚀", text: "Shipped v0.4 — added CSV export and custom dashboards", time: "2d ago" },
                    { emoji: "🎯", text: "Crossed 100 beta users. Retention is at 68% week-over-week", time: "5d ago" },
                    { emoji: "💬", text: "First paying customer converted from free tier", time: "1w ago" },
                  ].map(({ emoji, text, time }) => (
                    <div key={time} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                      <span className="text-base mt-0.5">{emoji}</span>
                      <p className="flex-1 text-sm text-slate-700">{text}</p>
                      <span className="shrink-0 text-[10px] text-slate-400">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            How it works
          </p>
          <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Three steps to building in public
          </h2>

          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Connector line */}
            <div className="absolute top-6 left-0 right-0 hidden h-px bg-gradient-to-r from-violet-200 via-indigo-200 to-violet-200 md:block" style={{ marginLeft: "calc(16.67% + 24px)", marginRight: "calc(16.67% + 24px)" }} />

            {[
              {
                step: "01",
                title: "Create your page",
                desc: "Tell GoPublic what you're building. Takes 2 minutes to go live.",
                color: "from-violet-500 to-indigo-500",
              },
              {
                step: "02",
                title: "Share your progress",
                desc: "Log wins, milestones, and updates. Your page stays fresh automatically.",
                color: "from-indigo-500 to-blue-500",
              },
              {
                step: "03",
                title: "Attract opportunities",
                desc: "Clients, employers, and followers find you through your proof of work.",
                color: "from-blue-500 to-violet-500",
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="relative flex flex-col items-center text-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-sm font-black text-white shadow-md`}>
                  {step}
                </div>
                <p className="text-base font-bold text-slate-900">{title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOMENTUM — Activity feed */}
      <section className="bg-slate-950 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Live momentum</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Recent updates from builders
              </h2>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[10px] font-semibold text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { name: "Sarah M.", avatar: "SM", action: "shipped", item: "v1.0 of her newsletter platform", time: "just now", color: "from-pink-500 to-rose-500" },
              { name: "James T.", avatar: "JT", action: "crossed", item: "$1,000 MRR on his SaaS", time: "4m ago", color: "from-emerald-500 to-teal-500" },
              { name: "Priya K.", avatar: "PK", action: "landed", item: "first enterprise client", time: "12m ago", color: "from-amber-500 to-orange-500" },
              { name: "Tom W.", avatar: "TW", action: "published", item: "week 8 progress update", time: "28m ago", color: "from-violet-500 to-indigo-500" },
              { name: "Lena V.", avatar: "LV", action: "reached", item: "500 followers on her builder page", time: "1h ago", color: "from-blue-500 to-indigo-500" },
            ].map(({ name, avatar, action, item, time, color }) => (
              <div key={name} className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-xs font-black text-white`}>
                  {avatar}
                </div>
                <p className="flex-1 text-sm text-slate-300">
                  <span className="font-semibold text-white">{name}</span> {action} <span className="text-slate-200">{item}</span>
                </p>
                <span className="shrink-0 text-[11px] text-slate-600">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BUILDERS */}
      <section id="builders" className="bg-white px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Featured builders
          </p>
          <h2 className="mb-14 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Real people. Real progress.
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                name: "Marco R.",
                avatar: "MR",
                what: "Building an AI writing assistant for non-native speakers",
                metrics: { followers: "1.8k", wins: 24, weeks: 14 },
                color: "from-violet-500 to-indigo-600",
                tag: "Indie hacker",
              },
              {
                name: "Yuki N.",
                avatar: "YN",
                what: "Documenting her journey from designer to SaaS founder",
                metrics: { followers: "3.1k", wins: 41, weeks: 22 },
                color: "from-pink-500 to-rose-600",
                tag: "Designer → founder",
              },
              {
                name: "David O.",
                avatar: "DO",
                what: "Open-source developer building dev tools in public",
                metrics: { followers: "5.4k", wins: 18, weeks: 31 },
                color: "from-emerald-500 to-teal-600",
                tag: "Open source",
              },
            ].map(({ name, avatar, what, metrics, color, tag }) => (
              <div key={name} className="group rounded-2xl border border-slate-100 bg-white p-6 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-sm font-black text-white shadow-md`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{name}</p>
                    <span className="text-[10px] font-medium text-slate-400">{tag}</span>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-relaxed text-slate-500">{what}</p>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{metrics.followers}</p>
                    <p className="text-[10px] text-slate-400">followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{metrics.wins}</p>
                    <p className="text-[10px] text-slate-400">wins logged</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{metrics.weeks}w</p>
                    <p className="text-[10px] text-slate-400">building</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Why it works
          </p>
          <h2 className="mb-14 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Building in public compounds
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-6 w-6 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                title: "Get discovered",
                desc: "Your proof of work surfaces when people search for what you build. No algorithm games needed.",
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Build credibility",
                desc: "A page that updates regularly signals commitment. Trust is built in public, not in DMs.",
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: "Stay consistent",
                desc: "When people are watching, you ship. Accountability is the most underrated growth lever.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white border border-slate-100 p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                  {icon}
                </div>
                <p className="mb-2 text-base font-bold text-slate-900">{title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-32 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[700px] rounded-full bg-violet-600 opacity-20 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Join 2,400+ builders
          </p>
          <h2 className="mb-5 text-4xl font-extrabold tracking-tight text-white md:text-5xl leading-tight">
            Your journey is your
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              best asset.
            </span>
          </h2>
          <p className="mb-10 text-lg text-slate-400">
            Start sharing it. Opportunities follow proof of work.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-full bg-white px-10 py-4 text-base font-bold text-slate-900 shadow-xl transition hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start building in public →
          </Link>
          <p className="mt-5 text-xs text-slate-600">Free to start · Live in 2 minutes</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-bold text-slate-900">GoPublic</span>
          <p className="text-xs text-slate-400">© 2026 GoPublic · Show your journey.</p>
        </div>
      </footer>

    </main>
  );
}
