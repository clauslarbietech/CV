"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeroBrand } from "@/components/hero/HeroShell";
import { saveProfile } from "@/lib/hero/store";
import type { HeroMode } from "@/lib/hero/types";

export default function ModePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<HeroMode | null>(null);

  function continueNext() {
    if (!selected) return;
    saveProfile({ mode: selected });
    router.push("/onboarding/goals");
  }

  return (
    <div className="onboard-screen">
      <HeroBrand />
      <h1 className="onboard-title">Who is HERO for?</h1>
      <p className="onboard-lead">One account. Two experiences. Pick what fits best—you can change this later.</p>

      <div className="mode-cards">
        <button
          type="button"
          className="mode-card mode-card-kids"
          data-selected={selected === "kids"}
          onClick={() => setSelected("kids")}
        >
          <span className="mode-emoji" aria-hidden>
            🦸
          </span>
          <strong>Kids & Teens</strong>
          <span>Playful missions, mascot guide, big buttons</span>
        </button>
        <button
          type="button"
          className="mode-card mode-card-adult"
          data-selected={selected === "adult"}
          onClick={() => setSelected("adult")}
        >
          <span className="mode-emoji" aria-hidden>
            ✦
          </span>
          <strong>Adults</strong>
          <span>Focus tools, scan & listen, calm dashboard</span>
        </button>
      </div>

      <button type="button" className="btn btn-white onboard-continue" disabled={!selected} onClick={continueNext}>
        Continue
        <span className="btn-arrow" aria-hidden>
          →
        </span>
      </button>
    </div>
  );
}
