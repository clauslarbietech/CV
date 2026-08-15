"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { IconBrainMark, TrainingTopBar } from "@/components/AppShell";
import { getPracticeStats, subscribePracticeStats, type PracticeStats } from "@/lib/practice";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const practices = [
  {
    href: "/session?game=unscramble",
    title: "Phonics unscramble",
    detail: "Build words from sounds",
  },
  {
    href: "/session?game=flip",
    title: "Letter flip",
    detail: "Practice b, d, p, and q",
  },
  {
    href: "/session?game=nonsense",
    title: "Nonsense decode",
    detail: "Sound out made-up words",
  },
];

const emptyStats: PracticeStats = { streak: 0, totalSessions: 0, lastPracticeDate: null };

export function HomeScreen() {
  const stats = useSyncExternalStore(subscribePracticeStats, getPracticeStats, () => emptyStats);
  const streakLabel = `${Math.max(stats.streak, 0)} day${stats.streak === 1 ? "" : "s"}`;
  const isNew = stats.totalSessions === 0;

  return (
    <div className="home-screen">
      <TrainingTopBar streak={streakLabel} />

      <header className="home-hero">
        <p className="home-kicker">{isNew ? "Welcome to LexRise" : greeting()}</p>
        <h1 className="home-title">{isNew ? "Start your first reading practice" : "Ready for today’s practice?"}</h1>
        <p className="home-lead">
          {isNew
            ? "Short phonics games that help with reading—go at your own pace."
            : `You’ve practiced ${stats.totalSessions} time${stats.totalSessions === 1 ? "" : "s"}. Keep your streak going.`}
        </p>
      </header>

      <Link href="/session" className="home-cta" aria-label="Start practice">
        <span className="session-orb">
          <IconBrainMark />
        </span>
        <span className="home-cta-copy">
          <strong>{isNew ? "Begin practice" : "Continue practice"}</strong>
          <span>{isNew ? "About 3–5 minutes" : "Pick up where it feels easy"}</span>
        </span>
        <span className="home-cta-arrow" aria-hidden>
          →
        </span>
      </Link>

      <p className="home-section-label">Or choose a skill</p>
      <div className="home-practice-list">
        {practices.map((item) => (
          <Link key={item.href} href={item.href} className="home-practice-row">
            <span>
              <strong>{item.title}</strong>
              <span className="home-practice-detail">{item.detail}</span>
            </span>
            <span className="chevron" aria-hidden>
              ›
            </span>
          </Link>
        ))}
      </div>

      <Link href="/accomplishments" className="home-soft-link">
        See people with dyslexia who thrived →
      </Link>
    </div>
  );
}
