"use client";

import { Suspense } from "react";
import { GamesHub } from "@/components/GamesHub";
import { ScienceBadge } from "@/components/hero/ScienceBadge";

export default function GamesPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Play & Train</h1>
        <p>
          Evidence-based Structured Literacy practice plus evidence-informed games. Adult learners are underserved in game research—HERO includes them on purpose.
        </p>
        <ScienceBadge tier="evidence-informed" />
      </header>
      <Suspense fallback={<p>Loading practice…</p>}>
        <GamesHub />
      </Suspense>
    </div>
  );
}
