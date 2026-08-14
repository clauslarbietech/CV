"use client";

import Link from "next/link";
import { HeroBrand } from "@/components/hero/HeroShell";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { saveProfile, updateExperience } from "@/lib/hero/store";
import type { HeroMode } from "@/lib/hero/types";

export default function ProfilePage() {
  const profile = useHeroProfile();
  const { experience } = profile;

  return (
    <div className="mendi-profile">
      <header className="mendi-profile-top">
        <HeroBrand />
      </header>

      <div className="mendi-identity">
        <h1>{profile.displayName || "HERO"}</h1>
        <p>{profile.mode === "kids" ? "Kids & Teens" : "Adult"}</p>
        <div className="mendi-badges" aria-hidden>
          <span>⭐</span>
          <span>🎯</span>
          <span>📚</span>
          <span>🎧</span>
        </div>
      </div>

      <Link href="/practice" className="profile-cta-card">
        <span className="profile-cta-kicker">Ready when you are</span>
        <strong>Continue your journey</strong>
        <span className="profile-cta-btn">Start session</span>
      </Link>

      <p className="section-label">Settings</p>
      <div className="list-group">
        <Link href="/style" className="list-row">
          <span className="list-icon">Aa</span>
          <span>Reading Style</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/progress" className="list-row">
          <span className="list-icon">◎</span>
          <span>Progress</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/library" className="list-row">
          <span className="list-icon">▤</span>
          <span>Library</span>
          <span className="chevron">›</span>
        </Link>
        <Link href="/research" className="list-row">
          <span className="list-icon">◈</span>
          <span>Science</span>
          <span className="chevron">›</span>
        </Link>
        {profile.mode === "kids" ? (
          <Link href="/parent" className="list-row">
            <span className="list-icon">☺</span>
            <span>Parent</span>
            <span className="chevron">›</span>
          </Link>
        ) : null}
      </div>

      <p className="section-label">Preferences</p>
      <div className="list-group">
        <ToggleRow label="Reduce motion" checked={experience.reduceMotion} onChange={(v) => updateExperience({ reduceMotion: v })} />
        <ToggleRow label="Skip intro" checked={experience.skipIntro} onChange={(v) => updateExperience({ skipIntro: v })} />
        <ToggleRow label="Sound off" checked={experience.soundOff} onChange={(v) => updateExperience({ soundOff: v })} />
      </div>

      <div className="mode-switch mendi-mode-switch">
        {(["kids", "adult"] as HeroMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            className="btn btn-ghost"
            data-active={profile.mode === mode}
            onClick={() => saveProfile({ mode })}
          >
            {mode === "kids" ? "Kids" : "Adult"}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="list-row experience-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
