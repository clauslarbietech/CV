"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { recommendActivities, rankedFocusFromRatings, LITERACY_ACTIVITIES } from "@/lib/hero/activity-engine";
import { computeDomainRatings } from "@/lib/hero/learning-profile";
import { getProfileEvents, subscribeHero } from "@/lib/hero/store";
import { READ_SKILLS } from "@/lib/hero/types";

export default function ReadPage() {
  const profile = useHeroProfile();
  const events = useSyncExternalStore(subscribeHero, getProfileEvents, () => []);
  const ratings = computeDomainRatings(events);
  const focus = rankedFocusFromRatings(ratings);
  const recommended = recommendActivities(focus, profile.mode, 3);

  return (
    <div>
      <header className="module-header">
        <h1>Reader</h1>
        <p>Structured Literacy practice—phonics, morphology, syllables, spelling, and fluency with explicit instruction.</p>
        <ScienceBadge tier="evidence-based" />
      </header>

      {recommended.length > 0 ? (
        <section className="panel science-rec-panel">
          <p className="science-rec-label">Recommended for you</p>
          <p className="home-practice-detail">
            Based on your HERO Learning Profile—not a diagnosis. Train the areas that need more support.
          </p>
          <div className="science-rec-list">
            {recommended.map((activity) => (
              <Link key={activity.id} href={activity.href} className="science-rec-card">
                <div className="read-skill-head">
                  <strong>{activity.title}</strong>
                  <ScienceBadge tier={activity.tier} compact />
                </div>
                <span>{activity.detail}</span>
                <span className="science-rec-why">{activity.why}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="section-label">Structured Literacy path</p>
      <div className="read-skills">
        {READ_SKILLS.map((skill) => (
          <Link key={skill.id} href={`/games?skill=${skill.id}`} className="read-skill-card">
            <div className="read-skill-head">
              <strong>{skill.label}</strong>
              <ScienceBadge tier={skill.tier} compact />
            </div>
            <span>{skill.detail}</span>
          </Link>
        ))}
      </div>

      <p className="section-label">All literacy activities</p>
      <div className="read-skills">
        {LITERACY_ACTIVITIES.filter((a) => a.tier === "evidence-based" || a.skill === "fluency").map((activity) => (
          <Link key={activity.id} href={activity.href} className="read-skill-card">
            <div className="read-skill-head">
              <strong>{activity.title}</strong>
              <ScienceBadge tier={activity.tier} compact />
            </div>
            <span>{activity.detail}</span>
          </Link>
        ))}
      </div>

      <Link href="/games" className="btn btn-white module-cta">
        Open practice studio
        <span className="btn-arrow" aria-hidden>
          →
        </span>
      </Link>

      <p className="module-disclaimer">
        Reader supports learning. Your Learning Profile is not a clinical diagnosis or treatment program.
      </p>
    </div>
  );
}
