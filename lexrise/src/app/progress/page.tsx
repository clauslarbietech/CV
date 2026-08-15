"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { computeDomainRatings } from "@/lib/hero/learning-profile";
import { getProfileEvents, getSummary, subscribeHero } from "@/lib/hero/store";
import { LEARNING_DOMAINS } from "@/lib/hero/science";

export default function ProgressPage() {
  const profile = useHeroProfile();
  const [tab, setTab] = useState<"performance" | "profile">("performance");
  const summary = useSyncExternalStore(subscribeHero, getSummary, () => ({
    totalSessions: 0,
    totalMinutes: 0,
    activitiesCompleted: 0,
    lastActiveDate: null,
    daysActiveThisWeek: 0,
  }));
  const events = useSyncExternalStore(subscribeHero, getProfileEvents, () => []);
  const ratings = useMemo(() => computeDomainRatings(events), [events]);
  const streak = Math.max(summary.daysActiveThisWeek, summary.lastActiveDate ? 1 : 0);
  const xp = summary.activitiesCompleted * 40 + summary.totalMinutes * 5;

  const skillBars = LEARNING_DOMAINS.filter((d) =>
    ["sounds", "letters", "words", "word-parts", "spelling", "fluency", "listening"].includes(d.id),
  ).map((domain) => {
    const rating = ratings.find((r) => r.id === domain.id);
    const stars = rating?.stars ?? 3;
    return {
      id: domain.id,
      label: domain.label,
      stars,
      rank: stars >= 5 ? "EXPERT" : stars >= 4 ? "ADVANCED" : stars >= 3 ? "GROWING" : "BUILDING",
      tone:
        domain.id === "sounds"
          ? "teal"
          : domain.id === "letters"
            ? "amber"
            : domain.id === "words"
              ? "crimson"
              : domain.id === "word-parts"
                ? "violet"
                : domain.id === "spelling"
                  ? "indigo"
                  : domain.id === "fluency"
                    ? "ocean"
                    : "pink",
    };
  });

  return (
    <div className="elevate-progress">
      <div className="elevate-banner">
        <p>TRACK YOUR PROGRESS</p>
      </div>

      <section className="elevate-sheet">
        <div className="elevate-stat-row">
          <div>
            <span className="elevate-stat-label">STREAK</span>
            <strong>🔥 {streak} days</strong>
          </div>
          <div>
            <span className="elevate-stat-label">XP</span>
            <strong>{xp}</strong>
          </div>
          <div>
            <span className="elevate-stat-label">SESSIONS</span>
            <strong>{summary.totalSessions}</strong>
          </div>
        </div>

        <div className="elevate-tabs">
          <button type="button" data-active={tab === "performance"} onClick={() => setTab("performance")}>
            Performance
          </button>
          <button type="button" data-active={tab === "profile"} onClick={() => setTab("profile")}>
            Profile
          </button>
        </div>

        {tab === "performance" ? (
          <div className="elevate-skill-list">
            {skillBars.map((skill) => (
              <div key={skill.id} className="elevate-skill-row">
                <div className="elevate-skill-meta">
                  <strong>{skill.label}</strong>
                  <span>{skill.rank}</span>
                </div>
                <div className="elevate-segments" aria-label={`${skill.stars} of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`elevate-segment tone-${skill.tone}`} data-filled={i < skill.stars} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="elevate-profile-mini">
            <h2>{profile.displayName || "HERO"}</h2>
            <p>{profile.mode === "kids" ? "Kids & Teens" : "Adult"} · learning profile, not a diagnosis</p>
            <Link href="/profile" className="btn btn-elevate">
              Open settings
            </Link>
          </div>
        )}

        <Link href="/games" className="btn btn-elevate module-cta">
          Play a game
        </Link>
      </section>
    </div>
  );
}
