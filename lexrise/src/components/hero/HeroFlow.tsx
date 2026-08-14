"use client";

import Link from "next/link";
import { HERO_FLOW_OPTIONS } from "@/lib/hero/types";

const ZONE_LABELS = {
  play: "Play",
  grow: "Grow",
  live: "Live",
} as const;

export function HeroFlow() {
  return (
    <div className="flow-page">
      <header className="flow-header">
        <h1>What do you want to do?</h1>
        <p>HERO is your space to read, listen, learn, play, and get things done differently.</p>
      </header>

      {(["play", "grow", "live"] as const).map((zone) => {
        const items = HERO_FLOW_OPTIONS.filter((o) => o.zone === zone);
        return (
          <section key={zone} className="flow-zone">
            <p className="flow-zone-label">{ZONE_LABELS[zone]}</p>
            <div className="flow-grid">
              {items.map((item) => (
                <Link key={item.id} href={item.href} className="flow-card">
                  <span className="flow-icon" aria-hidden>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
