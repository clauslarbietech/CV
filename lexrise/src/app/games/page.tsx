"use client";

import { Suspense } from "react";
import { GamesHub } from "@/components/GamesHub";
import { ScienceBadge } from "@/components/hero/ScienceBadge";

export default function GamesPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Play & Train</h1>
        <p>Games can support phonological skills and engagement—gains vary and do not always transfer to every reading skill.</p>
        <ScienceBadge tier="evidence-informed" />
      </header>
      <Suspense fallback={<p>Loading games…</p>}>
        <GamesHub initialTab="unscramble" />
      </Suspense>
    </div>
  );
}
