"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "linkedin" | "facebook" | "instagram" | "x";

type SocialAccount = {
  id: string;
  platform: Platform;
  platform_username: string;
  platform_page_name?: string;
  connected_at: string;
};

type SocialPost = {
  id: string;
  topic: string;
  platforms: Platform[];
  status: "draft" | "posting" | "posted" | "partial" | "failed";
  post_results: Record<string, { success: boolean; postId?: string; error?: string }>;
  posted_at: string;
  created_at: string;
};

type Step = "compose" | "preview" | "result";

// ─── Platform metadata ────────────────────────────────────────────────────────

const PLATFORMS: { id: Platform; label: string; color: string; abbr: string }[] = [
  { id: "linkedin",  label: "LinkedIn",  color: "bg-blue-600",  abbr: "in" },
  { id: "facebook",  label: "Facebook",  color: "bg-blue-500",  abbr: "f"  },
  { id: "instagram", label: "Instagram", color: "bg-pink-500",  abbr: "ig" },
  { id: "x",         label: "X",         color: "bg-slate-900", abbr: "𝕏"  },
];

const META = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, { label: p.label, color: p.color, abbr: p.abbr }])
) as Record<Platform, { label: string; color: string; abbr: string }>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("default", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(s: string) {
  if (s === "posted")  return "text-emerald-600 bg-emerald-50";
  if (s === "partial") return "text-amber-600 bg-amber-50";
  if (s === "failed")  return "text-red-600 bg-red-50";
  return "text-slate-500 bg-slate-100";
}

function statusLabel(s: string) {
  if (s === "posted")  return "Posted";
  if (s === "partial") return "Partial";
  if (s === "failed")  return "Failed";
  return "Posting…";
}

// ─── PlatformBadge ────────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: Platform }) {
  const m = META[platform];
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold text-white ${m.color}`}
    >
      {m.abbr}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SocialPage() {
  const supabase = createClient();

  const [userId, setUserId]       = useState<string | null>(null);
  const [accounts, setAccounts]   = useState<SocialAccount[]>([]);
  const [posts, setPosts]         = useState<SocialPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Compose step
  const [topic, setTopic]                     = useState("");
  const [selected, setSelected]               = useState<Platform[]>([]);

  // Step tracking
  const [step, setStep]                       = useState<Step>("compose");

  // Preview step
  const [generated, setGenerated]             = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating]       = useState(false);
  const [generateError, setGenerateError]     = useState("");

  // Result step
  const [publishResult, setPublishResult]     = useState<{
    status: string;
    results: Record<string, { success: boolean; postId?: string; error?: string }>;
  } | null>(null);
  const [isPublishing, setIsPublishing]       = useState(false);

  // Account actions
  const [disconnecting, setDisconnecting]     = useState<Platform | null>(null);

  // ── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Strip OAuth callback params from URL
      if (window.location.search) {
        window.history.replaceState({}, "", "/dashboard/social");
      }

      await Promise.all([fetchAccounts(user.id), fetchPosts(user.id)]);
      setLoadingData(false);
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAccounts(uid: string) {
    const res  = await fetch(`/api/social/accounts?user_id=${uid}`);
    const data = await res.json();
    const list: SocialAccount[] = data.accounts || [];
    setAccounts(list);
    // Auto-select all connected platforms
    setSelected(list.map((a) => a.platform));
  }

  async function fetchPosts(uid: string) {
    const res  = await fetch(`/api/social/posts?user_id=${uid}`);
    const data = await res.json();
    setPosts(data.posts || []);
  }

  // ── Connect / disconnect ──────────────────────────────────────────────────

  function handleConnect(platform: Platform) {
    if (!userId) return;
    const route =
      platform === "facebook" || platform === "instagram"
        ? `/api/social/auth/meta?user_id=${userId}`
        : `/api/social/auth/${platform}?user_id=${userId}`;
    window.location.href = route;
  }

  async function handleDisconnect(platform: Platform) {
    if (!userId) return;
    setDisconnecting(platform);
    await fetch(`/api/social/accounts?user_id=${userId}&platform=${platform}`, {
      method: "DELETE",
    });
    setDisconnecting(null);
    fetchAccounts(userId);
  }

  // ── Platform toggle ───────────────────────────────────────────────────────

  function togglePlatform(platform: Platform) {
    setSelected((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }

  // ── Step 1 → Step 2: Generate content ────────────────────────────────────

  async function handleGenerate() {
    if (!topic.trim() || selected.length === 0) return;
    setIsGenerating(true);
    setGenerateError("");

    try {
      const res = await fetch("/api/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), platforms: selected }),
      });

      if (!res.ok) {
        const err = await res.json();
        setGenerateError(err.error || "Failed to generate content.");
        return;
      }

      const data = await res.json();
      setGenerated(data.content);
      setStep("preview");
    } catch {
      setGenerateError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Step 2 → Step 3: Publish ──────────────────────────────────────────────

  async function handlePublish() {
    setIsPublishing(true);

    try {
      const res = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platforms: selected,
          content: generated,
        }),
      });

      const data = await res.json();
      setPublishResult({ status: data.status, results: data.results });
      setStep("result");

      // Refresh post history
      if (userId) fetchPosts(userId);
    } catch {
      setPublishResult({ status: "failed", results: {} });
      setStep("result");
    } finally {
      setIsPublishing(false);
    }
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  function reset() {
    setStep("compose");
    setTopic("");
    setGenerated({});
    setPublishResult(null);
    setGenerateError("");
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Social Media
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Connect your accounts. Tell us the topic. We write and post for you.
        </p>
      </div>

      {/* ── Connected accounts ── */}
      <section>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">
          Connected accounts
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PLATFORMS.map(({ id, label, color, abbr }) => {
            const account     = accounts.find((a) => a.platform === id);
            const isConnected = !!account;

            return (
              <div
                key={id}
                className={`rounded-2xl border bg-white p-4 flex flex-col gap-3 ${
                  isConnected ? "border-slate-200" : "border-dashed border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${color}`}
                  >
                    {abbr}
                  </span>
                  <span className="text-sm font-medium text-slate-800">{label}</span>
                </div>

                {isConnected ? (
                  <>
                    <p className="text-xs text-slate-500 truncate">
                      {account.platform_page_name || account.platform_username || "Connected"}
                    </p>
                    <button
                      onClick={() => handleDisconnect(id)}
                      disabled={disconnecting === id}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors text-left"
                    >
                      {disconnecting === id ? "Disconnecting…" : "Disconnect"}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-400">Not connected</p>
                    <button
                      onClick={() => handleConnect(id)}
                      className="text-xs font-medium text-slate-900 hover:underline text-left"
                    >
                      Connect →
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          ⚠️ X (Twitter) requires a paid API plan ($100/mo). All other platforms are free.
        </p>
      </section>

      {/* ── Post composer / preview / result ── */}
      {accounts.length > 0 && (
        <section>

          {/* ── Step 1: Compose ── */}
          {step === "compose" && (
            <>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">
                Create a post
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-5">

                {/* Topic input */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    What do you want to post about?
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Tips for parents of children with speech delays"
                    rows={3}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 resize-none"
                  />
                </div>

                {/* Platform selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Post to
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {accounts.map((account) => {
                      const m        = META[account.platform];
                      const isActive = selected.includes(account.platform);
                      return (
                        <button
                          key={account.platform}
                          onClick={() => togglePlatform(account.platform)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            isActive
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <span className="text-[10px] font-bold">{m.abbr}</span>
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {generateError && (
                  <p className="text-xs text-red-500">{generateError}</p>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim() || selected.length === 0}
                  className="self-start flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-700 disabled:opacity-50 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Writing your posts…
                    </>
                  ) : (
                    "Generate posts →"
                  )}
                </button>
              </div>
            </>
          )}

          {/* ── Step 2: Preview & confirm ── */}
          {step === "preview" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  Review before posting
                </p>
                <button
                  onClick={reset}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ← Back
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {selected.map((platform) => {
                  const m = META[platform];
                  return (
                    <div
                      key={platform}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      {/* Platform header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold ${m.color}`}
                        >
                          {m.abbr}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {m.label}
                        </span>
                        {platform === "instagram" && (
                          <span className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full ml-auto">
                            Requires image — will skip
                          </span>
                        )}
                      </div>

                      {/* Editable content */}
                      <textarea
                        value={generated[platform] || ""}
                        onChange={(e) =>
                          setGenerated((prev) => ({ ...prev, [platform]: e.target.value }))
                        }
                        rows={platform === "x" ? 3 : 5}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-700 border border-slate-100 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none leading-relaxed"
                      />

                      {platform === "x" && (
                        <p className={`mt-1 text-xs text-right ${(generated[platform] || "").length > 260 ? "text-amber-500" : "text-slate-400"}`}>
                          {(generated[platform] || "").length} / 280
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Confirm button */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-700 disabled:opacity-50 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isPublishing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Posting…
                    </>
                  ) : (
                    `Post to ${selected.length} platform${selected.length > 1 ? "s" : ""} →`
                  )}
                </button>
                <p className="text-xs text-slate-400">
                  You can edit the text above before posting.
                </p>
              </div>
            </>
          )}

          {/* ── Step 3: Result ── */}
          {step === "result" && publishResult && (
            <>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">
                Result
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900 mb-4">
                  {publishResult.status === "posted"  && "✅ All posts published"}
                  {publishResult.status === "partial" && "⚠️ Published to some platforms"}
                  {publishResult.status === "failed"  && "❌ Publishing failed"}
                </p>

                <div className="flex flex-col gap-3 mb-5">
                  {Object.entries(publishResult.results).map(([platform, result]) => {
                    const m = META[platform as Platform];
                    return (
                      <div key={platform} className="flex items-start gap-2">
                        <PlatformBadge platform={platform as Platform} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-700">{m.label}</span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                result.success
                                  ? "text-emerald-600 bg-emerald-50"
                                  : "text-red-600 bg-red-50"
                              }`}
                            >
                              {result.success ? "Posted" : "Failed"}
                            </span>
                          </div>
                          {result.error && (
                            <p className="text-xs text-red-400 mt-0.5">{result.error}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={reset}
                  className="text-sm font-medium text-slate-900 hover:underline"
                >
                  Create another post →
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* Empty state — no accounts connected */}
      {!loadingData && accounts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-400">
            Connect at least one account above to start posting.
          </p>
        </div>
      )}

      {/* ── Post history ── */}
      {posts.length > 0 && (
        <section>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">
            Post history
          </p>
          <div className="rounded-2xl border border-slate-100 bg-white divide-y divide-slate-50">
            {posts.map((post) => (
              <div
                key={post.id}
                className="px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {post.topic}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.platforms.map((p) => {
                      const result = post.post_results?.[p];
                      return (
                        <span
                          key={p}
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                            result?.success
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-red-600 bg-red-50"
                          }`}
                        >
                          {META[p]?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle(post.status)}`}
                  >
                    {statusLabel(post.status)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(post.posted_at || post.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
