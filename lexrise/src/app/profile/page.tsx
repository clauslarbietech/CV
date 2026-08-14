import Link from "next/link";
import { TopChrome } from "@/components/AppShell";
import { SpeedHeroLogo } from "@/components/SpeedHeroLogo";

function Row({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: string;
  label: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="list-row">
      <span className="list-icon" aria-hidden>
        {icon}
      </span>
      <span className="font-medium">
        {label}
        {badge ? <span className="badge-new">{badge}</span> : null}
      </span>
      <span className="chevron" aria-hidden>
        ›
      </span>
    </Link>
  );
}

export default function ProfilePage() {
  return (
    <>
      <TopChrome
        right={
          <button type="button" className="icon-btn" aria-label="Support">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 18.5v-7a7 7 0 0 1 14 0v7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path d="M5 14h2.5v4.5H5zM16.5 14H19v4.5h-2.5z" fill="currentColor" />
            </svg>
          </button>
        }
      />

      <div className="mb-2 flex items-center gap-2">
        <SpeedHeroLogo size={36} title="Speed" />
        <p className="text-sm font-semibold tracking-wide text-[var(--ink-soft)]">lexrise</p>
      </div>

      <div className="profile-head">
        <h1 className="text-2xl font-bold">LexRise Reader</h1>
        <p className="mt-1 text-[var(--ink-muted)]">Powered by Speed</p>
        <p className="mt-0.5 text-sm text-[var(--ink-muted)]">reader@lexrise.app</p>
        <div className="badge-row" aria-label="Achievements">
          {["S", "P", "F", "R"].map((b) => (
            <span key={b} className="mini-badge">
              {b}
            </span>
          ))}
          <span className="mini-badge" style={{ background: "rgba(255,255,255,0.08)" }}>
            +4
          </span>
        </div>
      </div>

      <div className="checkin-card">
        <p className="eyebrow">It&apos;s time for your check-in.</p>
        <h2 className="mt-3 text-2xl font-bold leading-tight">Build reading comfort</h2>
        <p className="mt-2 text-white/90">
          Your practice streak is <strong>1 day</strong>.
        </p>
        <p className="mt-1 text-sm text-white/70">Last session today</p>
        <Link href="/session" className="btn btn-white mt-5">
          Start today&apos;s session
        </Link>
      </div>

      <p className="section-label">Account settings</p>
      <div className="panel !py-1">
        <Row href="/profile" icon="A" label="Account" />
        <Row href="/fonts" icon="Aa" label="Appearance & fonts" />
        <Row href="/research" icon="i" label="Reading health tips" />
      </div>

      <p className="section-label">Training settings</p>
      <div className="panel !py-1">
        <Row href="/session" icon="▸" label="Session games" badge="New" />
        <Row href="/fonts" icon="♪" label="Audio cues" badge="New" />
        <Row href="/accomplishments" icon="★" label="Accomplishments" />
      </div>
    </>
  );
}
