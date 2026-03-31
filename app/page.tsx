import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white">
      <h1 className="text-6xl font-light tracking-tight text-black">
        GoPublic
      </h1>
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/signup"
          className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          Get started →
        </Link>
        <Link
          href="/about"
          className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          What is GoPublic?
        </Link>
      </div>
    </main>
  );
}
