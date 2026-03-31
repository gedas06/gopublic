"use client";

import Link from "next/link";
import { useState } from "react";

function PageMock() {
  return (
    <div className="rounded-2xl bg-white shadow-lg p-6 max-w-sm w-full">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium shrink-0">
          J
        </div>
        <div>
          <p className="text-base font-semibold text-black leading-tight">Jane van der Berg</p>
          <p className="text-xs text-gray-400">Speech Therapist · Amsterdam</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-gray-900">
        Helping adults find their voice again.
      </p>

      <hr className="my-4 border-gray-100" />

      <div className="divide-y divide-gray-100">
        {[
          "Individual therapy sessions",
          "Communication coaching for professionals",
          "Child speech & language development",
        ].map((s) => (
          <div key={s} className="flex items-center gap-2 py-2.5">
            <span className="text-gray-300 text-xs">●</span>
            <span className="text-sm text-gray-700">{s}</span>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white">
        Get in touch →
      </button>

      <p className="mt-3 text-center text-xs text-gray-300">gopublic.io/jane</p>
    </div>
  );
}

function SocialMock() {
  return (
    <div className="flex flex-col gap-3 w-full">
      {[
        {
          platform: "LinkedIn",
          pillClass: "bg-blue-50 text-blue-600",
          text: "Most people think speech therapy is just about pronunciation. In reality, 80% of my clients come to me because they\u2019ve stopped being heard. Here\u2019s what that actually looks like \ud83d\udc47",
          scheduled: "Scheduled for Monday 9am",
        },
        {
          platform: "Instagram",
          pillClass: "bg-pink-50 text-pink-500",
          text: "The one question I ask every new client before we start: \u2018What would change in your life if this was sorted?\u2019 Their answer tells me everything.",
          scheduled: "Scheduled for Wednesday",
        },
      ].map((post) => (
        <div
          key={post.platform}
          className="rounded-xl bg-gray-50 border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium">
                J
              </div>
              <span className="text-xs font-medium text-gray-700">Jane van der Berg</span>
            </div>
            <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${post.pillClass}`}>
              {post.platform}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">{post.text}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">{post.scheduled}</span>
            <span className="text-xs text-green-500 font-medium">● Ready to post</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelineMock() {
  const rows = [
    {
      initial: "M",
      avatarClass: "bg-purple-100 text-purple-600",
      name: "Maria S.",
      sub: "Reached out via page",
      pillLabel: "New lead",
      pillClass: "bg-purple-50 text-purple-600",
      date: "Today",
    },
    {
      initial: "T",
      avatarClass: "bg-orange-100 text-orange-600",
      name: "Tom B.",
      sub: "Free consult booked",
      pillLabel: "Follow up",
      pillClass: "bg-orange-50 text-orange-600",
      date: "3 days ago",
    },
    {
      initial: "A",
      avatarClass: "bg-green-100 text-green-600",
      name: "Anna K.",
      sub: "Active client",
      pillLabel: "Active",
      pillClass: "bg-green-50 text-green-600",
      date: "Since Jan",
    },
  ];

  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 divide-y divide-gray-100 w-full">
      {rows.map((row) => (
        <div key={row.name} className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${row.avatarClass}`}
            >
              {row.initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-black leading-tight">{row.name}</p>
              <p className="text-xs text-gray-400 truncate">{row.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs rounded-full px-2 py-1 font-medium ${row.pillClass}`}>
              {row.pillLabel}
            </span>
            <span className="text-xs text-gray-400">{row.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const SECTIONS = [
  {
    title: "Your professional page",
    summary: "A page that looks handcrafted. Built in minutes.",
    hook: "Shared once, works everywhere — in emails, texts, Instagram bios, and business cards.",
    mock: <PageMock />,
  },
  {
    title: "Content, on autopilot",
    summary: "Your knowledge becomes content. Automatically.",
    hook: "GoPublic writes it, schedules it, and posts it. You stay focused on clients.",
    mock: <SocialMock />,
  },
  {
    title: "Your client pipeline",
    summary: "Every lead followed up. Nothing falls through.",
    hook: "GoPublic tracks every enquiry and follows up on your behalf. You just show up for the session.",
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
                  maxHeight: open === i ? "800px" : "0px",
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
