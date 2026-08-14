"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import type { HeroMode } from "@/lib/hero/types";

const KIDS_NAV = [
  { href: "/home", label: "Home", icon: "⌂" },
  { href: "/read", label: "Reader", icon: "📖" },
  { href: "/games", label: "Play", icon: "🎮" },
  { href: "/listen", label: "Listen", icon: "🔊" },
  { href: "/profile", label: "Profile", icon: "☺" },
];

const ADULT_NAV = [
  { href: "/home", label: "Home", icon: "◉" },
  { href: "/read", label: "Reader", icon: "R" },
  { href: "/scan", label: "Scan", icon: "⎘" },
  { href: "/listen", label: "Listen", icon: "♪" },
  { href: "/profile", label: "Profile", icon: "☺" },
];

const FULL_BLEED_ROUTES = ["/intro", "/splash"];

export function HeroShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const profile = useHeroProfile();
  const fullBleed = FULL_BLEED_ROUTES.some((route) => pathname.startsWith(route));
  const hideNav =
    fullBleed ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/reader");

  const modeClass = profile.mode === "kids" ? "hero-kids" : "hero-adult";

  return (
    <div className={`app-frame ${modeClass}`}>
      <div className={`app-content${fullBleed ? " app-content-full" : ""}`}>{children}</div>
      {!hideNav && profile.onboardingComplete ? (
        <HeroNav mode={profile.mode} pathname={pathname} />
      ) : null}
    </div>
  );
}

function HeroNav({ mode, pathname }: { mode: HeroMode; pathname: string }) {
  const items = mode === "kids" ? KIDS_NAV : ADULT_NAV;
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map(({ href, label, icon }) => {
        const active = pathname === href || (href !== "/home" && pathname.startsWith(href));
        return (
          <Link key={href} href={href} className="nav-item" data-active={active} aria-current={active ? "page" : undefined}>
            <span className="nav-icon" aria-hidden>
              {icon}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function HeroBrand() {
  return (
    <span className="hero-logo" aria-label="HERO">
      H<span className="hero-logo-r">E</span>ЯO
    </span>
  );
}
