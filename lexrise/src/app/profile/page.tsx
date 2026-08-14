"use client";

import Link from "next/link";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { saveProfile, updateExperience } from "@/lib/hero/store";
import type { HeroMode } from "@/lib/hero/types";

export default function ProfilePage() {
  const profile = useHeroProfile();
  const { experience } = profile;

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
          <span>My Library</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/progress" className="list-row">
          <span className="list-icon">📈</span>
          <span>My Progress</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/flow" className="list-row">
          <span className="list-icon">✦</span>
          <span>HERO Flow</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/research" className="list-row">
          <span className="list-icon">🔬</span>
          <span>Science & Research</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/labs" className="list-row">
          <span className="list-icon">🧪</span>
          <span>HERO Labs</span>
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
      <div className="panel space-y-1">
        <ExperienceToggle
          label="Reduce motion"
          detail="Shorter transitions and less animation"
          checked={experience.reduceMotion}
          onChange={(v) => updateExperience({ reduceMotion: v })}
        />
        <ExperienceToggle
          label="Skip intro"
          detail="Go straight to your HERO space"
          checked={experience.skipIntro}
          onChange={(v) => updateExperience({ skipIntro: v })}
        />
        <ExperienceToggle
          label="Sound off"
          detail="Mute HERO sonic identity and ambient sounds"
          checked={experience.soundOff}
          onChange={(v) => updateExperience({ soundOff: v })}
        />
      </div>

      <p className="section-label">Mode</p>
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

function ExperienceToggle({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="experience-toggle">
      <span>
        <strong>{label}</strong>
        <span className="experience-toggle-detail">{detail}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
