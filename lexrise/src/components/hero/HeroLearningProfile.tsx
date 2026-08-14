"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import {
  computeDomainRatings,
  computeWellbeingRatings,
  getAssistiveLog,
  suggestFocusDomains,
} from "@/lib/hero/learning-profile";
import { getProfileEvents, getSummary, subscribeHero } from "@/lib/hero/store";

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
  const assistive = useSyncExternalStore(subscribeHero, getAssistiveLog, () => ({
    scans: 0,
    listenSessions: 0,
    readerSessions: 0,
    librarySaves: 0,
  }));

  const domains = computeDomainRatings(events);
  const wellbeing = computeWellbeingRatings(summary, events, assistive, profile.goals.length);

  const focusDomains = suggestFocusDomains(domains);
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

      {focusDomains.length > 0 ? (
        <div className="panel learning-profile-focus">
          <p className="learning-profile-focus-label">Suggested focus</p>
          <p>
            HERO recommends extra practice in:{" "}
            <strong>
              {focusDomains
                .map((id) => domains.find((d) => d.id === id)?.label)
                .filter(Boolean)
                .join(", ")}
            </strong>
          </p>
          <Link href="/read" className="btn btn-white module-cta">
            Go to Reader
          </Link>
        </div>
      ) : null}

      <p className="module-disclaimer">
        Star ratings reflect your activity in HERO—not clinical test scores. HERO supports learning; it does not diagnose dyslexia.
      </p>
    </section>
  );
}
