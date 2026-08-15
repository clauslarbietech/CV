"use client";

import Link from "next/link";
import { HERO_FLOW_OPTIONS } from "@/lib/hero/types";

const TONE = ["crimson", "teal", "indigo", "amber", "violet", "ocean", "pink"] as const;

export function HeroFlow() {
  return (
    <div className="elevate-games">
      <div className="elevate-banner">
        <p>WHAT DO YOU WANT TO DO?</p>
      </div>
      <section className="elevate-sheet">
        <div className="elevate-card-grid">
          {HERO_FLOW_OPTIONS.map((item, i) => (
            <Link key={item.id} href={item.href} className={`elevate-game-card tone-${TONE[i % TONE.length]}`}>
              <span className="elevate-game-icon" aria-hidden>
                {item.icon}
              </span>
              <strong>{item.label.replace(" something", "").replace("Help me ", "")}</strong>
              <span className="elevate-game-tag">{item.zone.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
