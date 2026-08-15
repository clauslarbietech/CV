"use client";

import { useEffect, useState } from "react";
import { SpeedHeroLogo, SpeedHeroWordmark } from "@/components/SpeedHeroLogo";

const INTRO_KEY = "hero-speed-intro-seen";
const ENTER_MS = 850;
const HOLD_MS = 1600;
const EXIT_MS = 700;

type Phase = "boot" | "enter" | "hold" | "exit" | "done";

function markSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* private mode */
  }
}

function alreadySeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Smooth fade-in splash with Speed hero as the logo.
 * Dyslexia-friendly: gentle timing, no flash, honors prefers-reduced-motion,
 * and can be skipped with Enter / Space / Escape / tap.
 */
export function FadeIntro() {
  const [phase, setPhase] = useState<Phase>("boot");

  useEffect(() => {
    let holdTimer = 0;
    let exitTimer = 0;
    let doneTimer = 0;

    const startId = window.requestAnimationFrame(() => {
      if (alreadySeen()) {
        setPhase("done");
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setPhase("hold");
        doneTimer = window.setTimeout(() => {
          markSeen();
          setPhase("done");
        }, 400);
        return;
      }

      setPhase("enter");
      holdTimer = window.setTimeout(() => setPhase("hold"), ENTER_MS);
      exitTimer = window.setTimeout(() => setPhase("exit"), ENTER_MS + HOLD_MS);
      doneTimer = window.setTimeout(() => {
        markSeen();
        setPhase("done");
      }, ENTER_MS + HOLD_MS + EXIT_MS);
    });

    return () => {
      window.cancelAnimationFrame(startId);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (phase === "boot" || phase === "done") return;

    const skip = () => {
      markSeen();
      setPhase("done");
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (phase === "boot" || phase === "done") return null;

  return (
    <div
      className="fade-intro"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to HERO"
      onClick={() => {
        markSeen();
        setPhase("done");
      }}
    >
      <div className="fade-intro__glow" aria-hidden />
      <div className="fade-intro__mark">
        <SpeedHeroLogo size={132} />
      </div>
      <SpeedHeroWordmark className="fade-intro__copy" />
      <p className="fade-intro__hint">Tap to continue</p>
    </div>
  );
}
