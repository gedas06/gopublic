import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          ← GoPublic
        </Link>

        <h1 className="mt-12 text-4xl font-light tracking-tight text-black">
          Your practice, online in minutes.
        </h1>

        <p className="mt-6 text-base text-gray-600 leading-relaxed">
          GoPublic helps solo specialists — therapists, coaches, consultants —
          get a clean professional page online without needing a designer,
          developer, or hours of their time. You answer a few simple questions.
          We build the page.
        </p>

        <ol className="mt-10 space-y-6">
          <li>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              1
            </span>
            <p className="mt-1 text-base font-medium text-black">Sign up</p>
            <p className="text-sm text-gray-500">Takes less than a minute.</p>
          </li>
          <li>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              2
            </span>
            <p className="mt-1 text-base font-medium text-black">
              Answer a few questions
            </p>
            <p className="text-sm text-gray-500">
              We ask about your work, your clients, and what makes you
              different.
            </p>
          </li>
          <li>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              3
            </span>
            <p className="mt-1 text-base font-medium text-black">
              Your page goes live
            </p>
            <p className="text-sm text-gray-500">
              A clean, professional page you can share with anyone.
            </p>
          </li>
        </ol>

        <p className="mt-10 text-sm text-gray-400">
          Free to start. No tech skills needed.
        </p>

        <Link
          href="/signup"
          className="mt-8 inline-block text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          Get started →
        </Link>
      </div>
    </main>
  );
}
