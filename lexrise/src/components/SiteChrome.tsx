"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/accomplishments", label: "Accomplishments" },
  { href: "/fonts", label: "Font Lab" },
  { href: "/games", label: "Games" },
  { href: "/research", label: "Research" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(232,244,242,0.86)] backdrop-blur-md">
      <div className="site-shell flex flex-wrap items-center justify-between gap-4 py-3">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-[var(--bg-deep)]">
          LexRise
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:text-base">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="nav-link" data-active={active}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[rgba(12,61,66,0.04)]">
      <div className="site-shell flex flex-col gap-3 py-8 text-[var(--ink-soft)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xl text-[var(--ink)]">LexRise</p>
          <p className="max-w-md text-sm">
            Built to support readers with dyslexia through clearer text, phonics games, and stories of real
            achievement. Not a medical diagnosis tool.
          </p>
        </div>
        <p className="text-sm">Practice daily. Celebrate strengths. Keep going.</p>
      </div>
    </footer>
  );
}
