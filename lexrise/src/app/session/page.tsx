"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { GamesHub } from "@/components/GamesHub";

function SessionInner() {
  const params = useSearchParams();
  const initial = params.get("game") ?? "unscramble";
  const [started, setStarted] = useState(true);
  const title = useMemo(() => {
    if (initial === "flip") return "Letter flip";
    if (initial === "nonsense") return "Nonsense decode";
    if (initial === "scramble") return "Scramble challenge";
    return "Phonics session";
  }, [initial]);

  return (
    <>
      <div className="top-bar">
        <Link href="/" className="icon-btn" aria-label="Close session">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </Link>
        <p className="font-semibold">{title}</p>
        <span className="w-10" />
      </div>

      {started ? (
        <GamesHub initialTab={initial === "flip" || initial === "nonsense" || initial === "scramble" || initial === "unscramble" ? initial : "unscramble"} />
      ) : (
        <div className="panel text-center">
          <p className="text-[var(--ink-muted)]">Ready when you are.</p>
          <button type="button" className="btn btn-accent mt-4 w-full" onClick={() => setStarted(true)}>
            Begin
          </button>
        </div>
      )}
    </>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<p className="text-[var(--ink-muted)]">Loading session…</p>}>
      <SessionInner />
    </Suspense>
  );
}
