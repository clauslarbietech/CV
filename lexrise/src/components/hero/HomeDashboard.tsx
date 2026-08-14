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

const PLAY_LINKS = [
  { href: "/games?skill=phonemic", icon: "🎮", label: "Sound Quest", detail: "Phonological awareness practice" },
  { href: "/train", icon: "🧠", label: "Memory Lab", detail: "Focus practice (not dyslexia treatment)" },
] as const;

const GROW_LINKS = [
  { href: "/read", icon: "📖", label: "Reader", detail: "Structured Literacy path" },
  { href: "/games?skill=morphology", icon: "🧩", label: "Word Parts", detail: "Prefixes, roots & suffixes" },
  { href: "/games?skill=fluency", icon: "🌊", label: "Reader Flow", detail: "Repeated reading for ease" },
] as const;

const LIVE_LINKS = [
  { href: "/scan", icon: "📷", label: "Scan", detail: "Capture text into HERO" },
  { href: "/listen", icon: "🔊", label: "Listen", detail: "TTS with word highlights" },
  { href: "/simplify", icon: "✨", label: "Simplify", detail: "Clearer wording for hard text" },
  { href: "/library", icon: "📚", label: "My Library", detail: "Saved passages & documents" },
] as const;

export function HomeDashboard() {
  const profile = useHeroProfile();
  const summary = useSyncExternalStore(subscribeHero, getSummary, () => emptySummary);

  if (profile.mode === "kids") {
    return <KidsHome name={profile.displayName} summary={summary} />;
  }
  return <AdultHome name={profile.displayName} summary={summary} />;
}

function HeroFlowButton({ variant }: { variant: "kids" | "adult" }) {
  return (
    <Link href="/flow" className={`hero-flow-cta hero-flow-cta-${variant}`}>
      <span className="hero-flow-cta-icon" aria-hidden>
        ✦
      </span>
      <span>
        <strong>What do you want to do?</strong>
        <span className="hero-flow-cta-sub">Scan · Listen · Read · Play · Focus</span>
      </span>
      <span className="chevron" aria-hidden>
        ›
      </span>
    </Link>
  );
}

function ZoneSection({
  title,
  subtitle,
  links,
  variant,
}: {
  title: string;
  subtitle: string;
  links: readonly { href: string; icon: string; label: string; detail: string }[];
  variant: "kids" | "adult";
}) {
  return (
    <section className="hero-zone">
      <div className="hero-zone-head">
        <p className="hero-zone-title">{title}</p>
        <p className="hero-zone-sub">{subtitle}</p>
      </div>
      <div className={`hero-zone-grid hero-zone-${variant}`}>
        {links.map((link) => (
          <Link key={link.href + link.label} href={link.href} className="hero-zone-card">
            <span className="hero-zone-icon" aria-hidden>
              {link.icon}
            </span>
            <strong>{link.label}</strong>
            <span>{link.detail}</span>
          </Link>
        ))}
      </div>
    </section>
  );
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
        <p className="hero-place-line">Your space to read, play, and explore differently.</p>
        <div className="mission-bar">
          <span>Today&apos;s mission</span>
          <strong>{missionDone}/5 activities</strong>
          <div className="mission-track">
            <div className="mission-fill" style={{ width: `${(missionDone / 5) * 100}%` }} />
          </div>
        </div>
      </header>

      <HeroFlowButton variant="kids" />

      <ZoneSection title="Play" subtitle="Games, adventures & achievements" links={PLAY_LINKS} variant="kids" />
      <ZoneSection title="Grow" subtitle="Reading practice that builds confidence" links={GROW_LINKS} variant="kids" />
      <ZoneSection title="Live" subtitle="Use HERO in everyday life" links={LIVE_LINKS} variant="kids" />

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
        <p className="adult-kicker">HERO</p>
        <h1>Welcome back, {name}</h1>
        <p className="hero-place-line">Your personalized space for reading, listening, learning, and getting things done differently.</p>
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

      <HeroFlowButton variant="adult" />

      <ZoneSection title="Play" subtitle="Challenges, games & mind training" links={PLAY_LINKS} variant="adult" />
      <ZoneSection title="Grow" subtitle="Phonics, comprehension & progress" links={GROW_LINKS} variant="adult" />
      <ZoneSection title="Live" subtitle="Scan, listen, simplify & save" links={LIVE_LINKS} variant="adult" />

      <Link href="/progress" className="home-practice-row">
        <span>
          <strong>My Progress</strong>
          <span className="home-practice-detail">Reading time, activities & consistency</span>
        </span>
        <span className="chevron">›</span>
      </Link>
    </div>
  );
}
