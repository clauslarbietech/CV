"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { markIntroSeen, shouldPlayFullIntro, shouldSkipIntroEntirely } from "@/lib/hero/store";
import { playAmbientPulse, playHeroSonic } from "@/lib/hero/sonic";

type Phase = "black" | "letters" | "resolve" | "hold" | "world" | "done";
type IntroPlan = "skip" | "brief" | "full";

const LETTER_FLASHES = [
  ["📖", "✨", "Aa"],
  ["〰️", "🔊", "Ee"],
  ["Я", "⭐", "🎯"],
  ["🎮", "📷", "Oo"],
];

function resolveIntroPlan(): IntroPlan {
  if (shouldSkipIntroEntirely()) return "skip";
  if (!shouldPlayFullIntro()) return "brief";
  return "full";
}

function initialPhase(plan: IntroPlan): Phase {
  if (plan === "skip") return "done";
  if (plan === "brief") return "resolve";
  return "black";
}

export function CinematicIntro() {
  const router = useRouter();
  const profile = useHeroProfile();
  const { experience, mode, displayName } = profile;
  const plan = resolveIntroPlan();
  const [phase, setPhase] = useState<Phase>(() => initialPhase(resolveIntroPlan()));
  const [activeLetter, setActiveLetter] = useState(-1);
  const [skipped, setSkipped] = useState(false);

  const finish = useCallback(() => {
    markIntroSeen();
    router.replace("/home");
  }, [router]);

  const skip = useCallback(() => {
    if (!experience.introSeenOnce && phase !== "hold" && phase !== "world") return;
    setSkipped(true);
    markIntroSeen();
    router.replace("/home");
  }, [experience.introSeenOnce, phase, router]);

  useEffect(() => {
    if (plan === "skip") {
      finish();
    }
  }, [plan, finish]);

  useEffect(() => {
    if (plan !== "full") return;

    playAmbientPulse(experience.soundOff);

    const timings = [
      window.setTimeout(() => setPhase("letters"), 400),
      window.setTimeout(() => setActiveLetter(0), 600),
      window.setTimeout(() => setActiveLetter(1), 1100),
      window.setTimeout(() => setActiveLetter(2), 1600),
      window.setTimeout(() => setActiveLetter(3), 2100),
      window.setTimeout(() => {
        setPhase("resolve");
        playHeroSonic(mode, experience.soundOff);
      }, 2600),
      window.setTimeout(() => setPhase("hold"), 3200),
      window.setTimeout(() => setPhase("world"), 3700),
    ];

    return () => timings.forEach(clearTimeout);
  }, [experience.soundOff, mode, plan]);

  useEffect(() => {
    if (plan !== "brief") return;

    playHeroSonic(mode, experience.soundOff);
    const hold = window.setTimeout(() => setPhase("hold"), 500);
    const world = window.setTimeout(() => setPhase("world"), 900);
    return () => {
      clearTimeout(hold);
      clearTimeout(world);
    };
  }, [experience.soundOff, mode, plan]);

  useEffect(() => {
    if (phase !== "world") return;
    const t = window.setTimeout(finish, mode === "kids" ? 2200 : 1800);
    return () => clearTimeout(t);
  }, [phase, finish, mode]);

  if (plan === "skip" || phase === "done") {
    return null;
  }

  return (
    <div
      className={`cinematic-intro ${mode === "kids" ? "cinematic-kids" : "cinematic-adult"}`}
      role="presentation"
      tabIndex={-1}
      onClick={() => {
        if (experience.introSeenOnce || phase === "world" || phase === "hold") skip();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && (experience.introSeenOnce || phase === "hold" || phase === "world")) skip();
      }}
    >
      {(phase === "black" || phase === "letters" || phase === "resolve" || phase === "hold") && !skipped ? (
        <div className="cinematic-stage">
          {phase === "letters" || phase === "resolve" || phase === "hold" ? (
            <div className="cinematic-letters" data-phase={phase}>
              {(["H", "E", "Я", "O"] as const).map((letter, i) => (
                <span
                  key={letter}
                  className="cinematic-letter"
                  data-active={activeLetter >= i || phase !== "letters"}
                  data-letter={letter}
                >
                  <span className="cinematic-letter-face">{letter}</span>
                  <span className="cinematic-flashes" aria-hidden>
                    {LETTER_FLASHES[i].map((f) => (
                      <span key={f}>{f}</span>
                    ))}
                  </span>
                </span>
              ))}
            </div>
          ) : null}

          {(phase === "resolve" || phase === "hold") && (
            <div className="cinematic-logo-block">
              <p className="cinematic-logo">
                H<span className="hero-logo-r">E</span>ЯO
              </p>
              <p className="cinematic-tagline">Different minds. Powerful futures.</p>
            </div>
          )}

          {experience.introSeenOnce || phase === "hold" ? (
            <button type="button" className="cinematic-skip" onClick={(e) => { e.stopPropagation(); skip(); }}>
              Skip
            </button>
          ) : null}
        </div>
      ) : null}

      {phase === "world" && !skipped ? (
        <div className={`world-transition world-${mode}`}>
          {mode === "kids" ? (
            <>
              <div className="world-burst" aria-hidden />
              <span className="world-mascot" aria-hidden>
                🦸
              </span>
              <p className="world-line">{displayName}, your next adventure is ready!</p>
            </>
          ) : (
            <>
              <div className="world-particles" aria-hidden />
              <p className="world-line">Welcome back, {displayName}.</p>
              <p className="world-sub">Continue your journey →</p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
