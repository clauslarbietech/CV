"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { getSummary, subscribeHero } from "@/lib/hero/store";

const emptySummary = {
  totalSessions: 0,
  totalMinutes: 0,
  activitiesCompleted: 0,
  lastActiveDate: null,
  daysActiveThisWeek: 0,
};

const FEATURED = [
  { href: "/games?skill=morphology", title: "Word Parts", tag: "READING", tone: "crimson", icon: "🧩" },
  { href: "/games?skill=phonemic", title: "Sound Quest", tag: "SOUNDS", tone: "teal", icon: "🔊" },
  { href: "/games?skill=fluency", title: "Reader Flow", tag: "FLUENCY", tone: "indigo", icon: "🌊" },
] as const;

export function HomeDashboard() {
  const profile = useHeroProfile();
  const summary = useSyncExternalStore(subscribeHero, getSummary, () => emptySummary);
  const streak = Math.max(summary.daysActiveThisWeek, summary.lastActiveDate ? 1 : 0);
  const xp = summary.activitiesCompleted * 40 + summary.totalMinutes * 5;

  return (
    <div className="elevate-today">
      <div className="elevate-banner">
        <p>TRAIN YOUR READING BRAIN</p>
      </div>

      <section className="elevate-sheet">
        <div className="elevate-stat-row">
          <div>
            <span className="elevate-stat-label">STREAK</span>
            <strong>🔥 {streak || 0} days</strong>
          </div>
          <div>
            <span className="elevate-stat-label">XP</span>
            <strong>{xp}</strong>
          </div>
          <div>
            <span className="elevate-stat-label">DONE</span>
            <strong>{summary.activitiesCompleted}</strong>
          </div>
        </div>

        <Link href="/practice" className="elevate-start">
          <span className="elevate-start-orb" aria-hidden>
            ✦
          </span>
          <span>
            <strong>Start training</strong>
            <span className="elevate-start-sub">Hi {profile.displayName || "there"}</span>
          </span>
        </Link>

        <div className="elevate-section-head">
          <h2>Featured</h2>
          <Link href="/games">See all</Link>
        </div>

        <div className="elevate-feature-scroll">
          {FEATURED.map((game) => (
            <Link key={game.href} href={game.href} className={`elevate-game-card tone-${game.tone}`}>
              <span className="elevate-game-icon" aria-hidden>
                {game.icon}
              </span>
              <strong>{game.title}</strong>
              <span className="elevate-game-tag">{game.tag}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
