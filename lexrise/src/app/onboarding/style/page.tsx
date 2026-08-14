"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeOnboarding } from "@/lib/hero/store";
import { DEFAULT_ACCESSIBILITY, type ReadingFont } from "@/lib/hero/types";

const FONTS: { id: ReadingFont; label: string }[] = [
  { id: "lexend", label: "Lexend" },
  { id: "opendyslexic", label: "OpenDyslexic" },
  { id: "atkinson", label: "Atkinson Hyperlegible" },
  { id: "verdana", label: "Verdana" },
  { id: "system", label: "System" },
];

const SAMPLE = "Reading gets easier when letters have room to breathe.";

export default function StyleOnboardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [font, setFont] = useState<ReadingFont>("lexend");
  const [size, setSize] = useState(DEFAULT_ACCESSIBILITY.fontSize);
  const [spacing, setSpacing] = useState(DEFAULT_ACCESSIBILITY.letterSpacing);

  function finish() {
    completeOnboarding({
      displayName: name.trim() || "Reader",
      accessibility: {
        ...DEFAULT_ACCESSIBILITY,
        font,
        fontSize: size,
        letterSpacing: spacing,
      },
    });
    router.push("/home");
  }

  return (
    <div className="onboard-screen">
      <p className="onboard-step">Step 3 of 3</p>
      <h1 className="onboard-title">Reading style</h1>
      <p className="onboard-lead">Set fonts and spacing now. Change anytime in Reading Style.</p>

      <label className="field">
        <span>Your name</span>
        <input className="control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex or Jordan" />
      </label>

      <label className="field">
        <span>Font</span>
        <select className="control" value={font} onChange={(e) => setFont(e.target.value as ReadingFont)}>
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Size — {size}px</span>
        <input className="w-full accent-[var(--accent)]" type="range" min={14} max={28} value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </label>

      <label className="field">
        <span>Letter spacing — {spacing.toFixed(2)}em</span>
        <input
          className="w-full accent-[var(--accent)]"
          type="range"
          min={0}
          max={0.2}
          step={0.01}
          value={spacing}
          onChange={(e) => setSpacing(Number(e.target.value))}
        />
      </label>

      <div className="style-preview panel" style={{ fontFamily: font === "opendyslexic" ? "OpenDyslexic" : undefined, fontSize: size, letterSpacing: `${spacing}em` }}>
        {SAMPLE}
      </div>

      <button type="button" className="btn btn-white onboard-continue" onClick={finish}>
        Enter HERO
      </button>
    </div>
  );
}
