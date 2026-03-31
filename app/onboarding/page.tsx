"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Answers {
  specialisation: string;
  ideal_client: string;
  outcome: string;
  differentiator: string;
  contact_preference: string;
}

const QUESTIONS: {
  key: keyof Answers;
  text: string;
  options: string[];
}[] = [
  {
    key: "specialisation",
    text: "What do you specialise in?",
    options: [
      "Individual therapy sessions",
      "Group programmes",
      "Workshops & training",
      "Coaching & consultancy",
    ],
  },
  {
    key: "ideal_client",
    text: "Who do you typically work with?",
    options: [
      "Adults going through a life transition",
      "Children and young people",
      "Professionals and executives",
      "Families and couples",
    ],
  },
  {
    key: "outcome",
    text: "What do clients usually come to you with?",
    options: [
      "Stress, anxiety or burnout",
      "Communication or relationship issues",
      "A specific diagnosis or condition",
      "Personal growth and clarity",
    ],
  },
  {
    key: "differentiator",
    text: "What makes your approach different?",
    options: [
      "I combine multiple methods",
      "I focus on practical, real-world results",
      "I take a holistic, whole-person view",
      "My lived experience informs my work",
    ],
  },
  {
    key: "contact_preference",
    text: "How should clients get in touch?",
    options: [
      "Email me directly",
      "Call or WhatsApp me",
      "Book via my online calendar",
      "Contact form on my page",
    ],
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [done, setDone] = useState(false);

  const question = QUESTIONS[step];
  const total = QUESTIONS.length;

  async function advance(answer: string) {
    const newAnswers = { ...answers, [question.key]: answer };
    setAnswers(newAnswers);
    setTransitioning(true);

    await new Promise((r) => setTimeout(r, 180));

    if (step < total - 1) {
      setStep((s) => s + 1);
      setSelected(null);
      setShowCustom(false);
      setCustomInput("");
      setTransitioning(false);
    } else {
      saveInBackground(newAnswers as Answers);
      setDone(true);
    }
  }

  async function handleChipClick(option: string) {
    if (selected || transitioning) return;
    setSelected(option);
    await new Promise((r) => setTimeout(r, 120));
    await advance(option);
  }

  async function handleCustomSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const val = customInput.trim();
    if (!val) return;
    await advance(val);
  }

  function saveInBackground(finalAnswers: Answers) {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!user) return;
        fetch("/api/generate-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, answers: finalAnswers }),
        }).catch(() => {});
      })
      .catch(() => {});
  }

  if (done) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-black"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="mb-3 text-3xl font-light tracking-tight text-black">
          We&apos;ll be in touch soon.
        </h1>
        <p className="mb-6 text-sm text-gray-400">
          We&apos;re reviewing your answers and will reach out shortly.
        </p>
        <p className="text-base font-medium text-black">
          You&apos;re about to GoPublic.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white px-6 py-10 sm:px-10">
      {/* Progress */}
      <div className="mb-12 flex items-center justify-between">
        <span className="text-xs tracking-wide text-gray-400">
          {step + 1} of {total}
        </span>
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-black" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question + answers */}
      <div
        className={`flex-1 transition-all duration-200 ${
          transitioning
            ? "translate-y-2 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <h1 className="mb-8 text-3xl font-light tracking-tight text-black sm:text-4xl">
          {question.text}
        </h1>

        {!showCustom ? (
          <div className="flex flex-col gap-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleChipClick(option)}
                disabled={!!selected || transitioning}
                className={`rounded-full border px-5 py-3 text-left text-sm transition-colors duration-150 focus:outline-none disabled:cursor-default ${
                  selected === option
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
                }`}
              >
                {option}
              </button>
            ))}

            <button
              onClick={() => setShowCustom(true)}
              className="mt-2 text-left text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              Type my own answer
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              autoFocus
              placeholder="Your answer…"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 focus:outline-none"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustom(false);
                  setCustomInput("");
                }}
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm text-gray-500 hover:border-gray-400 focus:outline-none"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
