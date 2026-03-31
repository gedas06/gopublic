"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PageTemplate, { type PageData } from "@/components/page-template";

function Spinner() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
        <p className="text-sm text-gray-400">Loading your page…</p>
      </div>
    </main>
  );
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [page, setPage] = useState<PageData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) {
      setStatus("error");
      return;
    }

    async function fetchPage() {
      const supabase = createClient();
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!data) {
        setStatus("error");
        return;
      }

      setPage(data as PageData);
      setStatus("ready");
    }

    fetchPage();
  }, [slug]);

  async function copyLink() {
    await navigator.clipboard.writeText(`gopublic.io/p/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === "loading") return <Spinner />;

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="mb-2 text-base text-black">Page not found.</p>
          <p className="text-sm text-gray-500">
            Please try the onboarding again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-1 text-2xl font-light tracking-tight text-black">
          Your page is ready!
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          Here&apos;s how your page looks to visitors.
        </p>

        <div className="mb-10 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={copyLink}
            className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {copied ? "Copied!" : "Copy your link"}
          </button>
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:border-black hover:text-black focus:outline-none"
          >
            Open page →
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100">
          {page && <PageTemplate page={page} />}
        </div>
      </div>
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <PreviewContent />
    </Suspense>
  );
}
