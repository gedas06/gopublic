"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

type SocialAccount = {
  id: string;
  platform: "linkedin" | "facebook" | "instagram" | "x";
  platform_username: string;
  platform_page_name?: string;
  connected_at: string;
};

type SocialPost = {
  id: string;
  topic: string;
  platforms: string[];
  status: "posting" | "posted" | "partial" | "failed";
  post_results: Record<string, { success: boolean; postId?: string; error?: string }>;
  posted_at: string;
  created_at: string;
};

const PLATFORM_META: Record<string, { label: string; color: string; icon: string }> = {
  linkedin: { label: "LinkedIn", color: "bg-blue-600", icon: "in" },
  facebook: { label: "Facebook", color: "bg-blue-500", icon: "f" },
  instagram: { label: "Instagram", color: "bg-pink-500", icon: "ig" },
  x: { label: "X", color: "bg-slate-900", icon: "𝕏" },
};

export default function SocialPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name?: string; profession?: string } | null>(null);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [lastResult, setLastResult] = useState<null | {
    status: string;
    results: Record<string, { success: boolean; error?: string }>;
    generatedContent: Record<string, string>;
  }>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, profession")
        .eq("id", user.id)
        .single();
      if (profile) {
        setUserProfile({ name: profile.full_name, profession: profile.profession });
      }

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("connected")) {
        window.history.replaceState({}, "", "/dashboard/social");
      }

      fetchAccounts(user.id);
      fetchPosts(user.id);
    };
    init();
  }, []);

  const fetchAccounts = async (uid: string) => {
    const res = await fetch(`/api/social/accounts?user_id=${uid}`);
    const data = await res.json();
    setAccounts(data.accounts || []);
    setSelectedPlatforms((data.accounts || []).map((a: SocialAccount) => a.platform));
  };

  const fetchPosts = async (uid: string) => {
    const res = await fetch(`/api/social/posts?user_id=${uid}`);
    const data = await res.json();
    setPosts(data.posts || []);
  };

  const handleConnect = (platform: string) => {
    if (!userId) return;
    const authRoute = platform === "facebook" || platform === "instagram"
      ? `/api/social/auth/meta?user_id=${userId}`
      : `/api/social/auth/${platform}?user_id=${userId}`;
    window.location.href = authRoute;
  };

  const handleDisconnect = async (platform: string) => {
    if (!userId) return;
    setDisconnecting(platform);
    await fetch(`/api/social/accounts?user_id=${userId}&platform=${platform}`, { method: "DELETE" });
    setDisconnecting(null);
    fetchAccounts(userId);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handlePost = async () => {
    if (!userId || !topic.trim() || selectedPlatforms.length === 0) return;
    setIsPosting(true);
    setLastResult(null);

    try {
      const res = await fetch("/api/social/generate-and-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          topic: topic.trim(),
          platforms: selectedPlatforms,
          name: userProfile?.name,
          profession: userProfile?.profession,
        }),
      });

      const data = await res.json();
      setLastResult(data);
      setShowPreview(true);
      setTopic("");
      fetchPosts(userId);
    } finally {
      setIsPosting(false);
    }
  };

  const ALL_PLATFORMS = ["linkedin", "facebook", "instagram", "x"] as const;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("default", { day: "numeric", month: "short", year: "numeric" });

  const statusLabel = (s: string) => {
    if (s === "posted") return { label: "Posted", color: "text-emerald-600 bg-emerald-50" };
    if (s === "partial") return { label: "Partial", color: "text-amber-600 bg-amber-50" };
    if (s === "failed") return { label: "Failed", color: "text-red-600 bg-red-50" };
    return { label: "Posting…", color: "text-slate-500 bg-slate-100" };
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Social Media</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect your accounts. Type a topic. GoPublic writes and posts for you.
          </p>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Connected accounts
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ALL_PLATFORMS.map((platform) => {
            const meta = PLATFORM_META[platform];
            const account = accounts.find((a) => a.platform === platform);
            const isConnected = !!account;

            return (
              <div
                key={platform}
                className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 transition-all ${
                  isConnected ? "border-slate-200" : "border-dashed border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${meta.color}`}
                  >
                    {meta.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-800">{meta.label}</span>
                </div>

                {isConnected ? (
                  <>
                    <p className="text-xs text-slate-500 truncate">
                      {account.platform_page_name || account.platform_username || "Connected"}
                    </p>
                    <button
                      onClick={() => handleDisconnect(platform)}
                      disabled={disconnecting === platform}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors text-left"
                    >
                      {disconnecting === platform ? "Disconnecting…" : "Disconnect"}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-400">Not connected</p>
                    <button
                      onClick={() => handleConnect(platform)}
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

        <p className="text-xs text-slate-400 mt-3">
          ⚠️ X (Twitter) posting requires a paid API plan ($100/mo). All other platforms are free.
        </p>
      </div>

      {/* Create Post */}
      {accounts.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Create a post
          </p>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">
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

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">
                Post to
              </label>
              <div className="flex flex-wrap gap-2">
                {accounts.map((account) => {
                  const meta = PLATFORM_META[account.platform];
                  const selected = selectedPlatforms.includes(account.platform);
                  return (
                    <button
                      key={account.platform}
                      onClick={() => togglePlatform(account.platform)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        selected
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${selected ? "text-white" : "text-slate-500"}`}>
                        {meta.icon}
                      </span>
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePost}
              disabled={isPosting || !topic.trim() || selectedPlatforms.length === 0}
              className="self-start px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isPosting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating &amp; posting…
                </>
              ) : (
                "Generate &amp; Post →"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Empty state — no accounts */}
      {accounts.length === 0 && (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center mb-8">
          <p className="text-sm text-slate-400">Connect at least one account to start posting.</p>
        </div>
      )}

      {/* Last result preview */}
      {showPreview && lastResult && (
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-900">
              {lastResult.status === "posted" && "✅ Posted successfully"}
              {lastResult.status === "partial" && "⚠️ Posted to some platforms"}
              {lastResult.status === "failed" && "❌ Posting failed"}
            </p>
            <button onClick={() => setShowPreview(false)} className="text-xs text-slate-400 hover:text-slate-600">
              Dismiss
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {Object.entries(lastResult.results).map(([platform, result]) => {
              const meta = PLATFORM_META[platform];
              return (
                <div key={platform} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold ${meta.color}`}>
                      {meta.icon}
                    </span>
                    <span className="text-xs font-medium text-slate-700">{meta.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${result.success ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                      {result.success ? "Posted" : "Failed"}
                    </span>
                  </div>
                  {result.error && (
                    <p className="text-xs text-red-400 ml-7">{result.error}</p>
                  )}
                  {result.success && lastResult.generatedContent[platform] && (
                    <p className="text-xs text-slate-500 ml-7 line-clamp-2">
                      {lastResult.generatedContent[platform]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Post history */}
      {posts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Post history
          </p>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
            {posts.map((post) => {
              const s = statusLabel(post.status);
              return (
                <div key={post.id} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <p className="text-sm text-slate-800 font-medium truncate">{post.topic}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.platforms.map((p) => {
                        const meta = PLATFORM_META[p];
                        const result = post.post_results?.[p];
                        return (
                          <span
                            key={p}
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                              result?.success
                                ? "text-emerald-700 bg-emerald-50"
                                : "text-red-600 bg-red-50"
                            }`}
                          >
                            {meta?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.color}`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {post.posted_at ? formatDate(post.posted_at) : formatDate(post.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
