"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import { GamesHub } from "@/components/GamesHub";
import { recordPracticeSession } from "@/lib/practice";

function SessionInner() {
  const params = useSearchParams();
  const initial = params.get("game") ?? "unscramble";
  const title = useMemo(() => {
    if (initial === "flip") return "Letter flip";
    if (initial === "nonsense") return "Nonsense decode";
    if (initial === "scramble") return "Scramble challenge";
    return "Practice";
  }, [initial]);

  const tab =
    initial === "flip" || initial === "nonsense" || initial === "scramble" || initial === "unscramble"
      ? initial
      : "unscramble";

  useEffect(() => {
    recordPracticeSession();
  }, []);

  return (
    <>
      <div className="top-bar">
        <Link href="/" className="icon-btn" aria-label="Close practice">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </Link>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 17 }}>{title}</p>
        <span style={{ width: 40 }} />
      </div>
      <GamesHub initialTab={tab} />
    </>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<p style={{ color: "var(--ink-muted)" }}>Loading practice…</p>}>
      <SessionInner />
    </Suspense>
  );
}
