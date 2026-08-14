"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { HeroLearningProfile } from "@/components/hero/HeroLearningProfile";
import { getSummary, subscribeHero } from "@/lib/hero/store";
import { useHeroProfile } from "@/hooks/useHeroProfile";

export default function ProgressPage() {
  const profile = useHeroProfile();
  const summary = useSyncExternalStore(subscribeHero, getSummary, () => ({
    totalSessions: 0,
    totalMinutes: 0,
    activitiesCompleted: 0,
    lastActiveDate: null,
    daysActiveThisWeek: 0,
  }));

  return (
    <div>
      <header className="module-header">
        <h1>My Progress</h1>
        <p>
          {profile.mode === "kids"
            ? "Your journey—strengths, growth areas, and honest encouragement."
            : "Learning profile, activity, and weekly consistency."}
        </p>
      </header>

      <HeroLearningProfile />

      <p className="section-label">Activity</p>
      <div className="metric-row">
        <div className="metric-card">
          <span>Sessions</span>
          <strong>{summary.totalSessions}</strong>
        </div>
        <div className="metric-card">
          <span>Minutes</span>
          <strong>{summary.totalMinutes}</strong>
        </div>
        <div className="metric-card">
          <span>Activities</span>
          <strong>{summary.activitiesCompleted}</strong>
        </div>
      </div>

      <div className="panel">
        <p>
          Active days this week: <strong>{summary.daysActiveThisWeek}</strong>
        </p>
        {profile.mode === "kids" ? (
          <p className="kids-encourage">Every session you finish helps your reading brain grow. Rest days are okay too.</p>
        ) : (
          <p className="home-practice-detail">HERO adapts from your performance—not percentages or diagnostic scores.</p>
        )}
      </div>

      <Link href="/research" className="btn btn-ghost module-cta">
        How HERO uses research →
      </Link>

      <Link href="/games" className="btn btn-white module-cta">
        Practice again
      </Link>
    </div>
  );
}
