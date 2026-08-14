"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import { GamesHub } from "@/components/GamesHub";
import { recordPracticeSession } from "@/lib/practice";

const GAME_MAP = {
  unscramble: "decoding",
  flip: "mapping",
  nonsense: "nonsense",
  scramble: "scramble",
  phonemic: "phonemic",
  mapping: "mapping",
  decoding: "decoding",
  morphology: "morphology",
  syllables: "syllables",
  spelling: "spelling",
  fluency: "fluency",
} as const;

type MappedTab = (typeof GAME_MAP)[keyof typeof GAME_MAP];

function SessionInner() {
  const params = useSearchParams();
  const initial = params.get("game") ?? params.get("skill") ?? "decoding";
  const tab: MappedTab = GAME_MAP[initial as keyof typeof GAME_MAP] ?? "decoding";
  const title = useMemo(() => {
    if (tab === "mapping") return "Letter Match";
    if (tab === "nonsense") return "Nonsense Decode";
    if (tab === "scramble") return "Myth check";
    if (tab === "morphology") return "Word Parts";
    if (tab === "phonemic") return "Sound Quest";
    if (tab === "fluency") return "Reader Flow";
    if (tab === "spelling") return "Spelling Lab";
    if (tab === "syllables") return "Syllable Split";
    return "Word Builder";
  }, [tab]);

  useEffect(() => {
    recordPracticeSession();
  }, []);

  return (
    <>
      <div className="top-bar">
        <Link href="/home" className="icon-btn" aria-label="Close practice">
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
