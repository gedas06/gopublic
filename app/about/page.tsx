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
          Your practice, online and growing.
        </h1>

        <p className="mt-6 text-base text-gray-600 leading-relaxed">
          GoPublic helps solo specialists — therapists, coaches, consultants —
          build their presence and manage their practice without needing a
          designer, developer, or extra staff. Everything in one place, built
          for people who work alone.
        </p>

        <ol className="mt-10 space-y-6">
          <li>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              1
            </span>
            <p className="mt-1 text-base font-medium text-black">Your professional page</p>
            <p className="text-sm text-gray-500">
              A clean, shareable landing page that introduces you, your
              services, and how to get in touch. Live in minutes.
            </p>
          </li>
          <li>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              2
            </span>
            <p className="mt-1 text-base font-medium text-black">
              Social media, handled
            </p>
            <p className="text-sm text-gray-500">
              We turn your expertise into posts, stories, and content you can
              share — without spending hours writing captions or figuring out
              what to say.
            </p>
          </li>
          <li>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              3
            </span>
            <p className="mt-1 text-base font-medium text-black">
              Your clients, organised
            </p>
            <p className="text-sm text-gray-500">
              Keep track of who you&apos;re working with, follow up at the right
              time, and never lose a lead again.
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
