"use client";

import Link from "next/link";
import { READ_SKILLS } from "@/lib/hero/types";

const TONES = ["crimson", "teal", "indigo", "amber", "violet", "ocean", "pink"] as const;

export default function ReadPage() {
  return (
    <div className="elevate-games">
      <div className="elevate-banner">
        <p>GROW YOUR READING SKILLS</p>
      </div>
      <section className="elevate-sheet">
        <Link href="/practice" className="elevate-start">
          <span className="elevate-start-orb" aria-hidden>
            ✦
          </span>
          <span>
            <strong>Science session</strong>
            <span className="elevate-start-sub">Guided practice</span>
          </span>
        </Link>
        <div className="elevate-card-grid">
          {READ_SKILLS.map((skill, i) => (
            <Link key={skill.id} href={`/games?skill=${skill.id}`} className={`elevate-game-card tone-${TONES[i % TONES.length]}`}>
              <span className="elevate-game-icon" aria-hidden>
                {skill.id === "phonemic" ? "🔊" : skill.id === "morphology" ? "🧩" : skill.id === "fluency" ? "🌊" : "Aa"}
              </span>
              <strong>{skill.label}</strong>
              <span className="elevate-game-tag">READING</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
