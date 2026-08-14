"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { HeroBrand } from "@/components/hero/HeroShell";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { getSummary, subscribeHero } from "@/lib/hero/store";

const emptySummary = {
  totalSessions: 0,
  totalMinutes: 0,
  activitiesCompleted: 0,
  lastActiveDate: null,
  daysActiveThisWeek: 0,
};

const EXPLORE_TILES = [
  { href: "/games", label: "Play", visual: "play", icon: "🎮" },
  { href: "/read", label: "Grow", visual: "grow", icon: "📖" },
  { href: "/scan", label: "Live", visual: "live", icon: "📷" },
  { href: "/train", label: "Focus", visual: "focus", icon: "🧠" },
] as const;

export function HomeDashboard() {
  const profile = useHeroProfile();
  const summary = useSyncExternalStore(subscribeHero, getSummary, () => emptySummary);
  const streak = Math.max(1, summary.daysActiveThisWeek || (summary.lastActiveDate ? 1 : 0));

  return (
    <div className={`dashboard mendi-home ${profile.mode === "kids" ? "mendi-kids" : "mendi-adult"}`}>
      <header className="mendi-top">
        <div className="mendi-streak" aria-label={`${streak} day streak`}>
          <span aria-hidden>🔥</span>
          <span>{streak} day{streak === 1 ? "" : "s"}</span>
        </div>
        <HeroBrand />
        <Link href="/progress" className="icon-btn" aria-label="Progress">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </Link>
      </header>

      <Link href="/practice" className="start-session-card">
        <span className="start-session-orb" aria-hidden>
          ✦
        </span>
        <strong>Start session</strong>
      </Link>
      <p className="start-session-hint">
        {profile.mode === "kids" ? "One short adventure today." : "Keep building your streak."}
      </p>

      <div className="explore-grid">
        {EXPLORE_TILES.map((tile) => (
          <Link key={tile.href} href={tile.href} className={`explore-tile explore-${tile.visual}`}>
            <span className="explore-tile-label">{tile.label}</span>
            <span className="explore-tile-art" aria-hidden>
              {tile.icon}
            </span>
          </Link>
        ))}
      </div>

      <Link href="/flow" className="mendi-ghost-cta">
        What do you need?
      </Link>
    </div>
  );
}
