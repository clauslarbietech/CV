"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { computeDomainRatings } from "@/lib/hero/learning-profile";
import { buildPracticeSession, sessionMinutes } from "@/lib/hero/practice-session";
import { getProfileEvents, recordActivity, recordCheckIn, subscribeHero } from "@/lib/hero/store";

type Phase = "plan" | "steps" | "checkin" | "done";

export default function PracticePage() {
  const profile = useHeroProfile();
  const events = useSyncExternalStore(subscribeHero, getProfileEvents, () => []);
  const ratings = useMemo(() => computeDomainRatings(events), [events]);
  const steps = useMemo(() => buildPracticeSession(ratings, profile.mode), [ratings, profile.mode]);
  const totalMin = sessionMinutes(steps);

  const [phase, setPhase] = useState<Phase>("plan");
  const [stepIndex, setStepIndex] = useState(0);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [enjoyment, setEnjoyment] = useState<1 | 2 | 3 | 4 | 5>(3);

  const current = steps[stepIndex];

  function finishSession() {
    recordActivity(totalMin);
    setPhase("checkin");
  }

  function saveCheckIn() {
    recordCheckIn({ confidence, enjoyment, note: "post-session" });
    setPhase("done");
  }

  return (
    <div>
      <header className="module-header">
        <h1>Session</h1>
        <ScienceBadge tier="evidence-based" />
      </header>

      {phase === "plan" ? (
        <div className="panel">
          <p className="science-rec-label">~{totalMin} min</p>
          <ol className="session-plan-list">
            {steps.map((step) => (
              <li key={step.activity.id}>
                <strong>
                  {step.order}. {step.activity.title}
                </strong>
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn-white module-cta" onClick={() => setPhase("steps")}>
            Begin
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </button>
        </div>
      ) : null}

      {phase === "steps" && current ? (
        <div className="panel">
          <p className="science-rec-label">
            {current.order}/{steps.length}
          </p>
          <h2 className="text-xl font-bold">{current.activity.title}</h2>
          <Link href={current.activity.href} className="btn btn-accent module-cta">
            Open
          </Link>
          <div className="reader-controls">
            {stepIndex < steps.length - 1 ? (
              <button type="button" className="btn btn-white" onClick={() => setStepIndex((i) => i + 1)}>
                Next
              </button>
            ) : (
              <button type="button" className="btn btn-white" onClick={finishSession}>
                Finish
              </button>
            )}
          </div>
        </div>
      ) : null}

      {phase === "checkin" ? (
        <div className="panel">
          <p className="science-rec-label">Check-in</p>
          <label className="field">
            <span>Confidence {confidence}</span>
            <input
              className="w-full accent-[var(--accent)]"
              type="range"
              min={1}
              max={5}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
            />
          </label>
          <label className="field">
            <span>Enjoyment {enjoyment}</span>
            <input
              className="w-full accent-[var(--accent)]"
              type="range"
              min={1}
              max={5}
              value={enjoyment}
              onChange={(e) => setEnjoyment(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
            />
          </label>
          <button type="button" className="btn btn-white module-cta" onClick={saveCheckIn}>
            Save
          </button>
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="panel">
          <h2 className="text-xl font-bold">Done</h2>
          <Link href="/home" className="btn btn-white module-cta">
            Home
          </Link>
        </div>
      ) : null}
    </div>
  );
}
