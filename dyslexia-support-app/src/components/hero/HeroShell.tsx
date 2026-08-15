"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FadeIntro } from "@/components/FadeIntro";
import { useHeroProfile } from "@/hooks/useHeroProfile";

const NAV = [
  { href: "/home", label: "Today", icon: "⬡" },
  { href: "/games", label: "Games", icon: "▣" },
  { href: "/profile", label: "Me", icon: "☺" },
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

  return (
    <div className="app-frame elevate-shell">
      <FadeIntro />
      <div className={`app-content${fullBleed ? " app-content-full" : ""}`}>{children}</div>
      {!hideNav && profile.onboardingComplete ? <HeroNav pathname={pathname} /> : null}
    </div>
  );
}

function HeroNav({ pathname }: { pathname: string }) {
  return (
    <nav className="bottom-nav elevate-nav" aria-label="Primary">
      {NAV.map(({ href, label, icon }) => {
        const active =
          href === "/home"
            ? pathname === "/home" || pathname.startsWith("/practice")
            : href === "/games"
              ? pathname.startsWith("/games") || pathname.startsWith("/read") || pathname.startsWith("/session") || pathname.startsWith("/train")
              : pathname.startsWith("/profile") || pathname.startsWith("/progress") || pathname.startsWith("/style") || pathname.startsWith("/library");
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
    <span className="hero-logo hero-logo-compact" aria-label="HERO">
      H<span className="hero-logo-r">E</span>ЯO
    </span>
  );
}
