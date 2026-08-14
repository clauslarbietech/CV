"use client";

import Link from "next/link";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { READ_SKILLS } from "@/lib/hero/types";

export default function ReadPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Reader</h1>
        <p>Structured Literacy practice—phonics, morphology, syllables, and fluency with explicit instruction.</p>
        <ScienceBadge tier="evidence-based" />
      </header>

      <div className="read-skills">
        {READ_SKILLS.map((skill) => (
          <Link key={skill.id} href={`/games?skill=${skill.id}`} className="read-skill-card">
            <div className="read-skill-head">
              <strong>{skill.label}</strong>
              <ScienceBadge tier={skill.tier} compact />
            </div>
            <span>{skill.detail}</span>
          </Link>
        ))}
      </div>

      <Link href="/games" className="btn btn-white module-cta">
        Start a challenge
      </Link>

      <p className="module-disclaimer">
        Reader supports learning. It is a learning profile—not a clinical diagnosis or treatment program.
      </p>
    </div>
  );
}
