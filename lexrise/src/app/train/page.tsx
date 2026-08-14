"use client";

import Link from "next/link";

export default function TrainPage() {
  return (
    <div>
      <header className="module-header">
        <h1>HERO Mind</h1>
        <p>Working memory, sequencing, and attention challenges—kept separate from dyslexia intervention claims.</p>
      </header>

      <div className="panel">
        <h2 className="text-lg font-bold">Sequence Master (preview)</h2>
        <p className="home-practice-detail">
          Pattern and memory games can support focus practice. They are not marketed as treating dyslexia or developing specific brain regions.
        </p>
        <Link href="/games?game=flip" className="btn btn-white module-cta">
          Try letter focus game
        </Link>
      </div>
    </div>
  );
}
