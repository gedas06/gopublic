import { createClient } from "@/lib/supabase/server";
import PageTemplate, { type PageData } from "@/components/page-template";

export default async function PublicPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="mb-2 text-2xl font-light tracking-tight text-black">
            Page not found
          </p>
          <p className="text-sm text-gray-500">
            This page doesn&apos;t exist or has been removed.
          </p>
        </div>
      </main>
    );
  }

  return <PageTemplate page={page as PageData} />;
}
