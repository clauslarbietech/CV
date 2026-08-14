"use client";

import Link from "next/link";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { READ_SKILLS } from "@/lib/hero/types";

export default function ReadPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Grow</h1>
        <ScienceBadge tier="evidence-based" />
      </header>

      <Link href="/practice" className="start-session-card" style={{ minHeight: 120, marginBottom: 16 }}>
        <span className="start-session-orb" aria-hidden>
          ✦
        </span>
        <strong>Science session</strong>
      </Link>

      <div className="explore-grid">
        {READ_SKILLS.map((skill) => (
          <Link key={skill.id} href={`/games?skill=${skill.id}`} className="explore-tile explore-grow">
            <span className="explore-tile-label">{skill.label}</span>
            <span className="explore-tile-art" aria-hidden>
              {skill.id === "phonemic"
                ? "🔊"
                : skill.id === "morphology"
                  ? "🧩"
                  : skill.id === "fluency"
                    ? "🌊"
                    : skill.id === "spelling"
                      ? "✏️"
                      : "Aa"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
