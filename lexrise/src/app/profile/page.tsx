"use client";

import Link from "next/link";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { saveProfile } from "@/lib/hero/store";
import type { HeroMode } from "@/lib/hero/types";

export default function ProfilePage() {
  const profile = useHeroProfile();

  return (
    <div>
      <header className="module-header">
        <h1>Profile & Settings</h1>
        <p>{profile.displayName}</p>
      </header>

      <div className="list-group">
        <Link href="/style" className="list-row">
          <span className="list-icon">Aa</span>
          <span>Reading Style</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/library" className="list-row">
          <span className="list-icon">📚</span>
          <span>Library</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/progress" className="list-row">
          <span className="list-icon">📈</span>
          <span>Progress</span>
          <span className="chevron">›</span>
        </Link>
        {profile.mode === "kids" ? (
          <Link href="/parent" className="list-row">
            <span className="list-icon">👪</span>
            <span>Parent / Caregiver</span>
            <span className="chevron">›</span>
          </Link>
        ) : null}
      </div>

      <p className="section-label">Experience</p>
      <div className="mode-switch">
        {(["kids", "adult"] as HeroMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            className="btn btn-ghost"
            data-active={profile.mode === mode}
            onClick={() => saveProfile({ mode })}
          >
            {mode === "kids" ? "Kids & Teens" : "Adult"}
          </button>
        ))}
      </div>

      <p className="module-disclaimer">
        HERO supports reading and learning. It does not diagnose dyslexia. For clinical questions, consult a qualified specialist.
      </p>

      <button type="button" className="btn btn-ghost module-cta" onClick={() => saveProfile({ onboardingComplete: false })}>
        Replay onboarding
      </button>
    </div>
  );
}
