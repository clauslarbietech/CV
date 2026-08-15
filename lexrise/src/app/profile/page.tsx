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
    <div className="elevate-me">
      <div className="elevate-banner elevate-banner-warm">
        <p>YOUR HERO SPACE</p>
      </div>

      <section className="elevate-sheet">
        <div className="elevate-me-identity">
          <HeroBrand />
          <h1>{profile.displayName || "HERO"}</h1>
          <p>{profile.mode === "kids" ? "Kids & Teens" : "Adult"}</p>
        </div>

        <Link href="/practice" className="elevate-start">
          <span className="elevate-start-orb" aria-hidden>
            ✦
          </span>
          <span>
            <strong>Continue training</strong>
            <span className="elevate-start-sub">Science session</span>
          </span>
        </Link>

        <div className="list-group elevate-list">
          <Link href="/progress" className="list-row">
            <span className="list-icon">◎</span>
            <span>Progress</span>
            <span className="chevron">›</span>
          </Link>
          <Link href="/style" className="list-row">
            <span className="list-icon">Aa</span>
            <span>Reading Style</span>
            <span className="chevron">›</span>
          </Link>
          <Link href="/library" className="list-row">
            <span className="list-icon">▤</span>
            <span>Library</span>
            <span className="chevron">›</span>
          </Link>
          <Link href="/flow" className="list-row">
            <span className="list-icon">✦</span>
            <span>Quick actions</span>
            <span className="chevron">›</span>
          </Link>
          <Link href="/research" className="list-row">
            <span className="list-icon">◈</span>
            <span>Science</span>
            <span className="chevron">›</span>
          </Link>
        </div>

        <div className="list-group elevate-list">
          <ToggleRow label="Reduce motion" checked={experience.reduceMotion} onChange={(v) => updateExperience({ reduceMotion: v })} />
          <ToggleRow label="Skip intro" checked={experience.skipIntro} onChange={(v) => updateExperience({ skipIntro: v })} />
          <ToggleRow label="Sound off" checked={experience.soundOff} onChange={(v) => updateExperience({ soundOff: v })} />
        </div>

        <div className="mode-switch mendi-mode-switch">
          {(["kids", "adult"] as HeroMode[]).map((mode) => (
            <button key={mode} type="button" className="btn btn-ghost" data-active={profile.mode === mode} onClick={() => saveProfile({ mode })}>
              {mode === "kids" ? "Kids" : "Adult"}
            </button>
          ))}
        </div>
      </section>
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
