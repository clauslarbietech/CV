"use client";

import Link from "next/link";
import { HERO_FLOW_OPTIONS } from "@/lib/hero/types";

export function HeroFlow() {
  return (
    <div className="flow-page mendi-explore">
      <header className="mendi-explore-head">
        <h1>Explore</h1>
      </header>

      <div className="explore-grid explore-grid-flow">
        {HERO_FLOW_OPTIONS.map((item) => (
          <Link key={item.id} href={item.href} className={`explore-tile explore-${item.zone}`}>
            <span className="explore-tile-label">{item.label.replace(" something", "").replace("Help me ", "")}</span>
            <span className="explore-tile-art" aria-hidden>
              {item.icon}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
