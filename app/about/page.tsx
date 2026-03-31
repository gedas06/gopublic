"use client";

import Link from "next/link";
import { useState } from "react";

function PageMock() {
  return (
    <div className="border-2 border-gray-200 rounded-3xl overflow-hidden shadow-2xl max-w-xs w-full bg-white">
      {/* Header */}
      <div className="bg-gray-950 px-6 pt-10 pb-8">
        <div className="h-14 w-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-light">
          J
        </div>
        <p className="text-2xl font-light text-white mt-4">Jane van der Berg</p>
        <p className="text-sm text-white/50 mt-1">Speech Therapist · Amsterdam</p>
        <p className="text-sm text-white/80 mt-3 font-light leading-relaxed">
          Helping adults find their voice again.
        </p>
      </div>

      {/* Services */}
      <div className="px-6 py-6">
        <p className="text-xs tracking-widest text-gray-400 mb-4">WHAT I OFFER</p>
        <div className="divide-y divide-gray-50">
          {[
            { name: "Individual Sessions", sub: "1-on-1 therapy, tailored to you" },
            { name: "Communication Coaching", sub: "For professionals & executives" },
            { name: "Child Development", sub: "Ages 2–12, play-based approach" },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
              <span className="text-gray-300 text-sm">→</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-5 border-t border-gray-100">
        <button className="w-full rounded-xl bg-gray-950 py-3.5 text-sm font-medium text-white">
          Book a free call →
        </button>
        <p className="text-xs text-gray-300 mt-3 text-center">gopublic.io/jane</p>
      </div>
    </div>
  );
}

function SocialMock() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* LinkedIn */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 w-full">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 bg-gray-900 rounded-full text-white text-sm flex items-center justify-center font-medium shrink-0">
            J
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Jane van der Berg</p>
            <p className="text-xs text-gray-400">Speech Therapist at Private Practice</p>
          </div>
          <span className="ml-auto shrink-0 text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
            2nd
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          Most people assume speech therapy is for children with lisps. Here&apos;s what I
          actually spend 80% of my week on — and why it&apos;s changing lives you&apos;d never
          expect. 🧵
        </p>
        <p className="mt-1 text-xs text-blue-600">...see more</p>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>👍 47 reactions</span>
          <span>12 comments · 5 reposts</span>
        </div>
        <span className="mt-2 inline-block bg-gray-50 text-gray-400 text-xs rounded-full px-2 py-0.5">
          Posted by GoPublic
        </span>
      </div>

      {/* Instagram */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full">
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-900 rounded-full text-white text-xs flex items-center justify-center font-medium shrink-0">
            J
          </div>
          <span className="text-sm font-medium text-gray-900">janevdberg_speechtherapy</span>
          <span className="ml-auto text-xs text-blue-500 font-medium">Follow</span>
        </div>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-40 w-full flex items-center justify-center">
          <span className="text-sm text-gray-400 italic">Your next post, generated.</span>
        </div>
        <div className="px-4 py-3">
          <div className="flex gap-3 text-base text-gray-700">
            <span>♡</span>
            <span>💬</span>
            <span>↗</span>
          </div>
          <p className="text-xs font-semibold text-gray-900 mt-1">142 likes</p>
          <p className="text-xs text-gray-600 mt-1 truncate">
            <span className="font-medium">janevdberg_speechtherapy</span> The one question I ask every new client...{" "}
            <span className="text-gray-400">more</span>
          </p>
          <span className="mt-2 inline-block bg-gray-50 text-gray-400 text-xs rounded-full px-2 py-0.5">
            Posted by GoPublic
          </span>
        </div>
      </div>
    </div>
  );
}

function PipelineMock() {
  const rows = [
    {
      initial: "M",
      avatarClass: "bg-purple-100 text-purple-700",
      name: "Maria S.",
      sub: "Reached out via your page · Today",
      pillLabel: "New",
      pillClass: "bg-purple-50 text-purple-700",
    },
    {
      initial: "T",
      avatarClass: "bg-amber-100 text-amber-700",
      name: "Tom B.",
      sub: "Free consult booked · 2 days ago",
      pillLabel: "Follow up",
      pillClass: "bg-amber-50 text-amber-700",
    },
    {
      initial: "A",
      avatarClass: "bg-emerald-100 text-emerald-700",
      name: "Anna K.",
      sub: "Active client · Since January",
      pillLabel: "Active",
      pillClass: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Client Pipeline</p>
        <span className="text-xs text-green-600 bg-green-50 rounded-full px-2 py-0.5 font-medium">
          3 new this week
        </span>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.name}
          className={`px-5 py-4 flex items-center gap-3 ${i < rows.length - 1 ? "border-b border-gray-50" : ""}`}
        >
          <div
            className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${row.avatarClass}`}
          >
            {row.initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-400 truncate">{row.sub}</p>
          </div>
          <span className={`shrink-0 text-xs rounded-full px-2.5 py-1 font-medium ${row.pillClass}`}>
            {row.pillLabel}
          </span>
        </div>
      ))}

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-400">GoPublic followed up with Maria automatically</p>
        <span className="text-xs text-gray-500 font-medium shrink-0 ml-3">View all →</span>
      </div>
    </div>
  );
}

const SECTIONS = [
  {
    title: "Your professional page",
    summary: "A page that looks handcrafted. Built in minutes.",
    hook: "One link that does the work of a full website.",
    mock: <PageMock />,
  },
  {
    title: "Content, on autopilot",
    summary: "Your knowledge becomes content. Automatically.",
    hook: "GoPublic writes it, schedules it, and posts it. Your name stays visible. You stay focused on clients.",
    mock: <SocialMock />,
  },
  {
    title: "Your client pipeline",
    summary: "Every lead followed up. Nothing falls through.",
    hook: "Every enquiry tracked, every follow-up sent. Your agent works while you\u2019re in session.",
    mock: <PipelineMock />,
  },
];

export default function About() {
  const [open, setOpen] = useState<number | null>(null);

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
  }

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
          Your practice runs. You do the work you love.
        </h1>

        <p className="mt-6 text-base text-gray-600 leading-relaxed">
          GoPublic is an AI agent for solo specialists. You tell it about your
          practice once — it handles your online presence, content, and client
          pipeline from there. No managing tools. No writing captions. No
          chasing leads.
        </p>

        <ol className="mt-10 space-y-1">
          {SECTIONS.map((section, i) => (
            <li key={i} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left focus:outline-none group"
              >
                <div>
                  <p className="text-base font-medium text-black group-hover:text-gray-600 transition-colors">
                    {section.title}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-400">{section.summary}</p>
                </div>
                <span
                  className="shrink-0 text-xl leading-none text-gray-400 transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: open === i ? "900px" : "0px",
                  opacity: open === i ? 1 : 0,
                }}
              >
                <div className="pb-6 space-y-4">
                  {section.mock}
                  <p className="text-sm text-gray-400">{section.hook}</p>
                </div>
              </div>
            </li>
          ))}
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
