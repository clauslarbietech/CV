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

export function HomeDashboard() {
  const profile = useHeroProfile();
  const summary = useSyncExternalStore(subscribeHero, getSummary, () => emptySummary);

  if (profile.mode === "kids") {
    return <KidsHome name={profile.displayName} summary={summary} />;
  }
  return <AdultHome name={profile.displayName} summary={summary} />;
}

function KidsHome({
  name,
  summary,
}: {
  name: string;
  summary: ReturnType<typeof getSummary>;
}) {
  const missionDone = Math.min(summary.activitiesCompleted % 5, 5);
  return (
    <div className="dashboard kids-dashboard">
      <header className="kids-header">
        <HeroBrand />
        <p className="kids-greeting">Hi, {name}! 👋</p>
        <div className="mission-bar">
          <span>Today&apos;s mission</span>
          <strong>
            {missionDone}/5 activities
          </strong>
          <div className="mission-track">
            <div className="mission-fill" style={{ width: `${(missionDone / 5) * 100}%` }} />
          </div>
        </div>
      </header>

      <section className="kids-cards">
        <Link href="/games" className="kids-card kids-card-orange">
          <span>🐱</span>
          <strong>Letter Quest</strong>
          <span>Build words from sounds</span>
        </Link>
        <Link href="/read" className="kids-card kids-card-blue">
          <span>🔤</span>
          <strong>Sound Match</strong>
          <span>Match letters and sounds</span>
        </Link>
        <Link href="/listen" className="kids-card kids-card-green">
          <span>🎧</span>
          <strong>Listen & Read</strong>
          <span>Words light up as you hear them</span>
        </Link>
        <Link href="/scan" className="kids-card kids-card-purple">
          <span>📷</span>
          <strong>Scan a page</strong>
          <span>Turn a photo into readable text</span>
        </Link>
      </section>

      <p className="kids-encourage">
        {summary.daysActiveThisWeek > 0
          ? `You showed up ${summary.daysActiveThisWeek} day${summary.daysActiveThisWeek === 1 ? "" : "s"} this week. That counts!`
          : "Every small step is a win. Start with one activity."}
      </p>
    </div>
  );
}

function AdultHome({
  name,
  summary,
}: {
  name: string;
  summary: ReturnType<typeof getSummary>;
}) {
  return (
    <div className="dashboard adult-dashboard">
      <header className="adult-header">
        <p className="adult-kicker">HERO Dashboard</p>
        <h1>Welcome back, {name}</h1>
      </header>

      <div className="metric-row">
        <div className="metric-card">
          <span>Reading</span>
          <strong>{summary.totalMinutes} min</strong>
        </div>
        <div className="metric-card">
          <span>Activities</span>
          <strong>{summary.activitiesCompleted}</strong>
        </div>
        <div className="metric-card">
          <span>This week</span>
          <strong>{summary.daysActiveThisWeek} days</strong>
        </div>
      </div>

      <Link href="/scan" className="hero-loop-card">
        <p className="loop-label">HERO signature loop</p>
        <strong>Scan → Read → Listen → Save</strong>
        <span>Photograph text, transform how it looks, listen with highlights</span>
      </Link>

      <p className="section-label">Continue</p>
      <div className="adult-links">
        <Link href="/read" className="home-practice-row">
          <span>
            <strong>HERO Read</strong>
            <span className="home-practice-detail">Phonics, decoding, fluency</span>
          </span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/games" className="home-practice-row">
          <span>
            <strong>Reading games</strong>
            <span className="home-practice-detail">Adaptive phonics practice</span>
          </span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/train" className="home-practice-row">
          <span>
            <strong>HERO Mind</strong>
            <span className="home-practice-detail">Focus & memory—separate from dyslexia claims</span>
          </span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/library" className="home-practice-row">
          <span>
            <strong>Library</strong>
            <span className="home-practice-detail">Saved scans and passages</span>
          </span>
          <span className="chevron">›</span>
        </Link>
      </div>
    </div>
  );
}
