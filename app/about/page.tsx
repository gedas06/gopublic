"use client";

import Link from "next/link";
import { useState } from "react";

function PageMock() {
  return (
    <div className="rounded-xl bg-gray-50 p-5 text-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium shrink-0">
          JB
        </div>
        <div>
          <p className="font-semibold text-black">Jane van der Berg</p>
          <p className="text-xs text-gray-400">Speech Therapist · Amsterdam</p>
        </div>
      </div>
      <p className="text-gray-700 mb-3">Helping adults find their voice again.</p>
      <div className="divide-y divide-gray-200 mb-4">
        <p className="py-2 text-gray-600">Individual therapy sessions</p>
        <p className="py-2 text-gray-600">Communication coaching</p>
        <p className="py-2 text-gray-600">Child speech development</p>
      </div>
      <button className="w-full rounded-md bg-black py-2 text-xs font-medium text-white">
        Get in touch
      </button>
    </div>
  );
}

function SocialMock() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          &ldquo;Most people think speech therapy is just for kids. Here&apos;s
          what I actually spend most of my week doing: [thread]&rdquo;
        </p>
        <p className="mt-2 text-xs text-gray-400">LinkedIn post</p>
      </div>
      <div className="flex-1 rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          &ldquo;One question I ask every new client that changes everything
          👇&rdquo;
        </p>
        <p className="mt-2 text-xs text-gray-400">Instagram caption</p>
      </div>
    </div>
  );
}

function ClientsMock() {
  const rows = [
    { name: "Maria S.", status: "New lead", statusColor: "bg-blue-50 text-blue-600", date: "Today" },
    { name: "Tom B.", status: "Follow up", statusColor: "bg-amber-50 text-amber-600", date: "3 days ago" },
    { name: "Anna K.", status: "Active", statusColor: "bg-green-50 text-green-600", date: "2 weeks ago" },
  ];
  return (
    <div className="rounded-xl bg-gray-50 divide-y divide-gray-200 overflow-hidden">
      {rows.map((row) => (
        <div key={row.name} className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="font-medium text-black">{row.name}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${row.statusColor}`}>
            {row.status}
          </span>
          <span className="text-gray-400 text-xs">{row.date}</span>
        </div>
      ))}
    </div>
  );
}

const ITEMS = [
  {
    num: "1",
    title: "Your professional page",
    summary: "A clean, shareable landing page that introduces you, your services, and how to get in touch. Live in minutes.",
    hook: "A page that looks like you hired a designer. Without hiring a designer.",
    mock: <PageMock />,
    footer: "Your page lives at gopublic.io/jane — ready to share in a text, email, or Instagram bio.",
  },
  {
    num: "2",
    title: "Social media, handled",
    summary: "We turn your expertise into posts, stories, and content you can share — without spending hours writing captions or figuring out what to say.",
    hook: "You do the work. We find the words.",
    mock: <SocialMock />,
    footer: "We turn your answers into ready-to-post content for LinkedIn, Instagram, and more. You review, you post.",
  },
  {
    num: "3",
    title: "Your clients, organised",
    summary: "Keep track of who you\u2019re working with, follow up at the right time, and never lose a lead again.",
    hook: "Never lose track of a lead again.",
    mock: <ClientsMock />,
    footer: "See who\u2019s waiting to hear from you, who needs a follow-up, and who\u2019s already a client \u2014 all in one place.",
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
          Your practice, online and growing.
        </h1>

        <p className="mt-6 text-base text-gray-600 leading-relaxed">
          GoPublic helps solo specialists — therapists, coaches, consultants —
          build their presence and manage their practice without needing a
          designer, developer, or extra staff. Everything in one place, built
          for people who work alone.
        </p>

        <ol className="mt-10 space-y-6">
          {ITEMS.map((item, i) => (
            <li key={i}>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {item.num}
              </span>
              <button
                onClick={() => toggle(i)}
                className="mt-1 flex w-full items-start justify-between gap-4 text-left focus:outline-none group"
              >
                <p className="text-base font-medium text-black group-hover:text-gray-700 transition-colors">
                  {item.title}
                </p>
                <span
                  className="mt-0.5 shrink-0 text-gray-400 text-lg leading-none transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <p className="text-sm text-gray-500 mt-1">{item.summary}</p>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? "600px" : "0px", opacity: open === i ? 1 : 0 }}
              >
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-700 font-medium">{item.hook}</p>
                  {item.mock}
                  <p className="text-sm text-gray-400">{item.footer}</p>
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
