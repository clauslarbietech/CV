"use client";

import { Suspense } from "react";
import { GamesHub } from "@/components/GamesHub";

export default function GamesPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Play & Train</h1>
        <p>Games and challenges that adapt to your performance—not just level completion.</p>
      </header>
      <Suspense fallback={<p>Loading games…</p>}>
        <GamesHub initialTab="unscramble" />
      </Suspense>
    </div>
  );
}
