"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { recommendActivities, rankedFocusFromRatings } from "@/lib/hero/activity-engine";
import {
  computeDomainRatings,
  computeWellbeingRatings,
} from "@/lib/hero/learning-profile";
import { getAssistiveLog, getCheckIns, getProfileEvents, getSummary, subscribeHero } from "@/lib/hero/store";

function StarRow({ stars, max = 5 }: { stars: number; max?: number }) {
  return (
    <span className="star-row" aria-label={`${stars} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className="star" data-filled={i < stars}>
          ★
        </span>
      ))}
    </span>
  );
}

const emptyAssistive = {
  scans: 0,
  listenSessions: 0,
  readerSessions: 0,
  librarySaves: 0,
};

export function HeroLearningProfile() {
  const profile = useHeroProfile();
  const events = useSyncExternalStore(subscribeHero, getProfileEvents, () => []);
  const summary = useSyncExternalStore(subscribeHero, getSummary, () => ({
    totalSessions: 0,
    totalMinutes: 0,
    activitiesCompleted: 0,
    lastActiveDate: null,
    daysActiveThisWeek: 0,
  }));
  const assistive = useSyncExternalStore(subscribeHero, getAssistiveLog, () => emptyAssistive);
  const checkIns = useSyncExternalStore(subscribeHero, getCheckIns, () => []);

  const domains = computeDomainRatings(events);
  const wellbeing = computeWellbeingRatings(summary, events, assistive, profile.goals.length);
  const latestCheckIn = checkIns[0];

  const focusDomains = rankedFocusFromRatings(domains);
  const recommended = recommendActivities(focusDomains, profile.mode, 3);
  const strengths = domains.filter((d) => d.status === "strength").slice(0, 4);

  return (
    <section className="learning-profile">
      <header className="learning-profile-head">
        <h2>Your HERO Profile</h2>
        <p>
          A learning profile—not a diagnosis. HERO learns your strengths and where to train next.
        </p>
      </header>

      {strengths.length > 0 ? (
        <p className="learning-profile-encourage">
          Your brain has strengths. HERO trains the areas that need more support.
        </p>
      ) : (
        <p className="learning-profile-encourage">
          Start a few activities and HERO will learn what helps you most.
        </p>
      )}

      <p className="section-label">Reading & language</p>
      <ul className="profile-rating-list">
        {domains.map((domain) => (
          <li key={domain.id} className="profile-rating-row">
            <span>
              <strong>{domain.label}</strong>
              <span className="profile-rating-detail">{domain.detail}</span>
            </span>
            <StarRow stars={domain.stars} />
          </li>
        ))}
      </ul>

      <p className="section-label">Confidence & independence</p>
      {latestCheckIn ? (
        <p className="home-practice-detail" style={{ marginBottom: 8 }}>
          Latest check-in: confidence {latestCheckIn.confidence}/5 · enjoyment {latestCheckIn.enjoyment}/5
        </p>
      ) : null}
      <ul className="profile-rating-list">
        {wellbeing.map((metric) => (
          <li key={metric.id} className="profile-rating-row">
            <span>
              <strong>{metric.label}</strong>
              <span className="profile-rating-detail">{metric.detail}</span>
            </span>
            <StarRow stars={metric.stars} />
          </li>
        ))}
      </ul>

      {recommended.length > 0 ? (
        <div className="panel learning-profile-focus">
          <p className="learning-profile-focus-label">Science-guided next steps</p>
          <p>
            Focus areas:{" "}
            <strong>
              {focusDomains
                .slice(0, 3)
                .map((id) => domains.find((d) => d.id === id)?.label)
                .filter(Boolean)
                .join(", ")}
            </strong>
          </p>
          <div className="science-rec-list">
            {recommended.map((activity) => (
              <Link key={activity.id} href={activity.href} className="science-rec-card">
                <div className="read-skill-head">
                  <strong>{activity.title}</strong>
                  <ScienceBadge tier={activity.tier} compact />
                </div>
                <span>{activity.detail}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <p className="module-disclaimer">
        Star ratings reflect your activity in HERO—not clinical test scores. HERO supports learning; it does not diagnose dyslexia.
      </p>
    </section>
  );
}
