"use client";

import Link from "next/link";
import { ScienceBadge } from "@/components/hero/ScienceBadge";

export default function TrainPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Focus</h1>
        <p>Memory Lab and mind training—inspired by calm focus UX, not neurofeedback therapy.</p>
        <ScienceBadge tier="evidence-informed" />
      </header>

      <div className="panel">
        <h2 className="text-lg font-bold">Memory Lab (preview)</h2>
        <p className="home-practice-detail">
          Pattern and memory games support focus practice. Mind training is separate from reading support.
        </p>
        <Link href="/games?game=flip" className="btn btn-white module-cta">
          Try focus game
        </Link>
      </div>
    </div>
  );
}
