"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveProfile } from "@/lib/hero/store";
import type { HeroGoal } from "@/lib/hero/types";

const GOALS: { id: HeroGoal; label: string; detail: string }[] = [
  { id: "reading", label: "Read more comfortably", detail: "Fonts, spacing, and focus tools" },
  { id: "confidence", label: "Build confidence", detail: "Celebrate progress, not perfection" },
  { id: "school", label: "School support", detail: "Phonics and decoding practice" },
  { id: "work", label: "Work & real-world reading", detail: "Scan documents and listen on the go" },
  { id: "focus", label: "Focus & attention", detail: "Mind training separate from reading claims" },
  { id: "listen", label: "Listen to text", detail: "Text-to-speech with word highlighting" },
];

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<HeroGoal[]>([]);

  function toggle(goal: HeroGoal) {
    setGoals((current) => (current.includes(goal) ? current.filter((g) => g !== goal) : [...current, goal]));
  }

  return (
    <div className="onboard-screen">
      <p className="onboard-step">Step 2 of 3</p>
      <h1 className="onboard-title">What do you want HERO to help with?</h1>
      <p className="onboard-lead">Choose any that apply. HERO adapts activities to your goals—not labels.</p>

      <div className="goal-list">
        {GOALS.map((goal) => (
          <button
            key={goal.id}
            type="button"
            className="goal-row"
            data-selected={goals.includes(goal.id)}
            onClick={() => toggle(goal.id)}
          >
            <span>
              <strong>{goal.label}</strong>
              <span className="goal-detail">{goal.detail}</span>
            </span>
            <span className="goal-check" aria-hidden>
              {goals.includes(goal.id) ? "✓" : ""}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-white onboard-continue"
        disabled={goals.length === 0}
        onClick={() => {
          saveProfile({ goals });
          router.push("/onboarding/style");
        }}
      >
        Continue
      </button>
    </div>
  );
}
