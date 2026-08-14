"use client";

import Link from "next/link";
import { READ_SKILLS } from "@/lib/hero/types";

export default function ReadPage() {
  return (
    <div>
      <header className="module-header">
        <h1>HERO Read</h1>
        <p>Evidence-informed exercises. Difficulty adapts to how you perform—not just level number.</p>
      </header>

      <div className="read-skills">
        {READ_SKILLS.map((skill) => (
          <Link key={skill.id} href={`/games?skill=${skill.id}`} className="read-skill-card">
            <strong>{skill.label}</strong>
            <span>{skill.detail}</span>
          </Link>
        ))}
      </div>

      <Link href="/games" className="btn btn-white module-cta">
        Start reading game
      </Link>

      <p className="module-disclaimer">
        HERO Read supports learning. It is not a clinical diagnosis or treatment program.
      </p>
    </div>
  );
}
