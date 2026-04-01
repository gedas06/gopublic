"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CtaButton() {
  const router = useRouter();

  async function handleClick() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    router.push(session ? "/dashboard" : "/signup");
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
    >
      Log your first client →
    </button>
  );
}
