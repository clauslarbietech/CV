"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FadeIntro } from "@/components/FadeIntro";
import { SpeedHeroLogo } from "@/components/SpeedHeroLogo";

function IconExplore({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14.5 9.5 10 10l-.5 4.5 4.5-.5.5-4.5Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTraining({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 14c2.2-4 4-6 5-6s2.8 2 5 6c-2.5 1.8-7.5 1.8-10 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={active ? "currentColor" : "none"}
        opacity={active ? 0.35 : 1}
      />
      <path
        d="M8 10c1.5-2.5 2.8-3.5 4-3.5s2.5 1 4 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 18.5c1.6-2.6 3.8-3.9 6.5-3.9s4.9 1.3 6.5 3.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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
      <FadeIntro />
      <div className="app-content">{children}</div>
      {!hideNav ? (
        <nav className="bottom-nav" aria-label="Primary">
          {tabs.map(({ href, label, Icon, notify }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className="nav-item" data-active={active} aria-current={active ? "page" : undefined}>
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

export function TopChrome({
  streak = "1 day",
  right,
}: {
  streak?: string;
  right?: ReactNode;
}) {
  return (
    <div className="top-bar">
      <div className="top-bar-brand">
        <SpeedHeroLogo size={28} className="top-bar-logo" title="Speed" />
        <div className="streak" aria-label={`Streak ${streak}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2c1.5 3.2-.2 5.2-1.5 6.7C9 10.5 8 12 8 14.2 8 17 10.2 19 13 19c3.2 0 5-2.3 5-5.2 0-2.4-1.2-4.1-2.4-5.5.8 1.8.7 3.1.2 4.1C19 11 20.5 8.4 18.8 5.2 16.2 7 14.8 4.6 12 2Z" />
          </svg>
          <span>{streak}</span>
        </div>
      </div>
      {right ?? (
        <Link href="/profile" className="icon-btn" aria-label="Open calendar and profile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
