"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function IconExplore({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m14.8 9.2-5.1.7-.7 5.1 5.1-.7.7-5.1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.25 : 0}
      />
    </svg>
  );
}

export function IconTraining({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.8 14.2c2.4-4.4 4.2-6.4 5.2-6.4s2.8 2 5.2 6.4c-2.7 1.7-7.7 1.7-10.4 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.22 : 0}
      />
      <path
        d="M8 10.2c1.5-2.4 2.8-3.4 4-3.4s2.5 1 4 3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M9.2 16.8c1.8.55 3.8.55 5.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconProfile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8.2" r="3.1" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.2 18.4c1.5-2.5 3.7-3.8 6.8-3.8s5.3 1.3 6.8 3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconFlame() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden>
      <path d="M8 .8c2.4 2.8 3.4 4.6 3.4 7.1 0 .7-.1 1.3-.3 1.9.9-1.1 1.4-2.4 1.4-4 .8 1.5 1.3 3 1.3 4.7C13.8 14.2 11.3 17 8 17S2.2 14.2 2.2 10.5C2.2 7.2 4.1 4.6 8 .8Zm0 6.4c-.9 1.1-1.4 2-1.4 3.2 0 1.7 1.1 2.8 2.5 2.8 1.7 0 2.7-1.3 2.7-3 0-1.2-.5-2.2-1.3-3.1-.2 1.2-.7 2-1.5 2.5.2-.9.1-1.7-.1-2.4L8 7.2Z" />
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.2v3.2M16 3.2v3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 17.5V8.8A4.8 4.8 0 0 1 9.8 4h4.4A4.8 4.8 0 0 1 19 8.8v3.4A4.8 4.8 0 0 1 14.2 17H9.2L5 20v-2.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBrainMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M14 30c5.5-10 9.5-14.5 12-14.5S32.5 20 38 30c-6 4-18 4-24 0Z"
        fill="#6b4eff"
        fillOpacity="0.28"
      />
      <path
        d="M14 30c5.5-10 9.5-14.5 12-14.5S32.5 20 38 30c-6 4-18 4-24 0Z"
        stroke="#6b4eff"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M17 21c3.2-5.2 6-7.4 9-7.4s5.8 2.2 9 7.4"
        stroke="#6b4eff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M19.5 34.5c3.8 1.2 8.2 1.2 12 0" stroke="#6b4eff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

const tabs = [
  { href: "/explore", label: "Explore", Icon: IconExplore },
  { href: "/", label: "Training", Icon: IconTraining },
  { href: "/profile", label: "Profile", Icon: IconProfile, notify: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/session");

  return (
    <div className="app-frame">
      <div className="app-content">{children}</div>
      {!hideNav ? (
        <nav className="bottom-nav" aria-label="Primary">
          {tabs.map(({ href, label, Icon, notify }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="nav-item"
                data-active={active}
                aria-current={active ? "page" : undefined}
              >
                <Icon active={active} />
                <span>{label}</span>
                {notify ? <span className="nav-dot" aria-hidden /> : null}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}

export function TrainingTopBar({ streak = "1 day" }: { streak?: string }) {
  return (
    <div className="top-bar">
      <div className="streak" aria-label={`Streak ${streak}`}>
        <IconFlame />
        <span>{streak}</span>
      </div>
      <Link href="/profile" className="icon-btn" aria-label="Calendar">
        <IconCalendar />
      </Link>
    </div>
  );
}

export function ProfileTopBar() {
  return (
    <div className="top-bar">
      <Link href="/" className="brand-mark" aria-label="LexRise home">
        <span className="brand-orb" aria-hidden />
        lexrise
      </Link>
      <button type="button" className="icon-btn" aria-label="Support chat">
        <IconChat />
      </button>
    </div>
  );
}

export function PageTopBar({ title }: { title: string }) {
  return (
    <div className="top-bar">
      <Link href="/explore" className="icon-btn" aria-label="Back to Explore">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M15 5.5 8.5 12 15 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 17 }}>{title}</p>
      <span style={{ width: 40 }} />
    </div>
  );
}
