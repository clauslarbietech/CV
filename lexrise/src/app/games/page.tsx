"use client";

import { Suspense } from "react";
import { GamesHub } from "@/components/GamesHub";

export default function GamesPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Reading games</h1>
        <p>Phonics practice that adapts to performance—not just level completion.</p>
      </header>
      <Suspense fallback={<p>Loading games…</p>}>
        <GamesHub initialTab="unscramble" />
      </Suspense>
    </div>
  );
}
