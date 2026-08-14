import Link from "next/link";
import type { ReactNode } from "react";
import { ProfileTopBar } from "@/components/AppShell";

function Row({
  href,
  label,
  badge,
  children,
}: {
  href: string;
  label: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="list-row">
      <span className="list-icon" aria-hidden>
        {children}
      </span>
      <span className="label-wrap">
        {label}
        {badge ? <span className="badge-new">{badge}</span> : null}
      </span>
      <span className="chevron" aria-hidden>
        ›
      </span>
    </Link>
  );
}

const badges = [
  { id: "1", colors: ["#ff6b2c", "#ffb347"] },
  { id: "2", colors: ["#6b4eff", "#4cc9f0"] },
  { id: "3", colors: ["#34c759", "#a8e063"] },
  { id: "4", colors: ["#ff2d55", "#ff9f0a"] },
  { id: "5", colors: ["#5ac8fa", "#007aff"] },
];

export default function ProfilePage() {
  return (
    <>
      <ProfileTopBar />

      <div className="profile-head">
        <h1>LexRise User</h1>
        <p className="email">clauslarbietech@gmail.com</p>
        <div className="badge-row" aria-label="Achievements">
          {badges.map((badge) => (
            <span
              key={badge.id}
              className="mini-badge"
              style={{
                background: `linear-gradient(145deg, ${badge.colors[0]}, ${badge.colors[1]})`,
              }}
            >
              <svg viewBox="0 0 36 36" aria-hidden>
                <circle cx="18" cy="18" r="10" fill="rgba(255,255,255,0.25)" />
                <path d="M18 10l2.4 5.1 5.6.5-4.3 3.7 1.3 5.4L18 21.8l-4.9 2.9 1.3-5.4-4.3-3.7 5.6-.5L18 10z" fill="#fff" />
              </svg>
            </span>
          ))}
          <span className="badge-more">+ 23</span>
        </div>
      </div>

      <div className="checkin-card">
        <p className="eyebrow">It&apos;s time for your check-in.</p>
        <h2>Build reading comfort</h2>
        <p className="status">
          Your reading load is <strong>moderate</strong>.
        </p>
        <p className="meta">Last updated today</p>
        <Link href="/session" className="btn btn-white">
          Take the questionnaire
        </Link>
      </div>

      <p className="section-label">Account settings</p>
      <div className="list-group">
        <Row href="/profile" label="Account">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M5 18.5c1.6-2.6 3.8-3.9 7-3.9s5.4 1.3 7 3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </Row>
        <Row href="/fonts" label="Appearance">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
          </svg>
        </Row>
        <Row href="/research" label="Health">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 20s-6.5-4.2-8.7-8C1.5 8.5 3.4 5 6.8 5c1.8 0 3.2 1 5.2 3 2-2 3.4-3 5.2-3 3.4 0 5.3 3.5 3.5 7-2.2 3.8-8.7 8-8.7 8Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </Row>
      </div>

      <p className="section-label">Training settings</p>
      <div className="list-group">
        <Row href="/session" label="Session games" badge="New">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </Row>
        <Row href="/fonts" label="Audio" badge="New">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 10v4h3l4 3V7L7 10H4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M15 9.5a3.5 3.5 0 0 1 0 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M17.5 7a6 6 0 0 1 0 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </Row>
        <Row href="/accomplishments" label="Accomplishments">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="m12 3.5 2.2 4.6 5 .7-3.6 3.4.9 5L12 15.4 7.5 17.2l.9-5L4.8 8.8l5-.7L12 3.5Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </Row>
      </div>
    </>
  );
}
