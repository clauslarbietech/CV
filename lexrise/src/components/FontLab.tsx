"use client";

import { useEffect, useState } from "react";

type Face = "lexend" | "opendyslexic" | "system";

const sample =
  "Reading gets easier when letters stop crowding each other. Try this paragraph with different fonts, sizes, and spacing until your eyes feel calm and your brain can catch the sounds.";

export function FontLab() {
  const [face, setFace] = useState<Face>("lexend");
  const [size, setSize] = useState(20);
  const [letterSpacing, setLetterSpacing] = useState(0.06);
  const [wordSpacing, setWordSpacing] = useState(0.2);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState<"day" | "soft" | "night">("day");

  useEffect(() => {
    document.documentElement.style.setProperty("--letter-spacing", `${letterSpacing}em`);
    document.documentElement.style.setProperty("--word-spacing", `${wordSpacing}em`);
    document.documentElement.style.setProperty("--line-height", String(lineHeight));
    document.documentElement.style.setProperty("--reading-size", `${size}px`);
  }, [letterSpacing, wordSpacing, lineHeight, size]);

  const faceClass =
    face === "opendyslexic" ? "reading-opendyslexic" : face === "system" ? "font-sans" : "reading-surface";

  const surface =
    theme === "night"
      ? { background: "#102226", color: "#e7f4f2" }
      : theme === "soft"
        ? { background: "#dceee9", color: "#1a3034" }
        : { background: "#f7fbfa", color: "#142428" };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
      <div className="panel space-y-5">
        <label className="block">
          <span className="mb-2 block font-semibold">Font family</span>
          <select
            className="control w-full rounded-xl border-2 border-[var(--line)] bg-white px-3 py-3"
            value={face}
            onChange={(e) => setFace(e.target.value as Face)}
          >
            <option value="lexend">Lexend (designed for reading)</option>
            <option value="opendyslexic">OpenDyslexic</option>
            <option value="system">System sans</option>
          </select>
        </label>

        <Slider label="Size" value={size} min={16} max={28} step={1} onChange={setSize} suffix="px" />
        <Slider
          label="Letter spacing"
          value={letterSpacing}
          min={0}
          max={0.2}
          step={0.01}
          onChange={setLetterSpacing}
          suffix="em"
        />
        <Slider
          label="Word spacing"
          value={wordSpacing}
          min={0}
          max={0.5}
          step={0.02}
          onChange={setWordSpacing}
          suffix="em"
        />
        <Slider
          label="Line height"
          value={lineHeight}
          min={1.3}
          max={2.2}
          step={0.05}
          onChange={setLineHeight}
          suffix=""
        />

        <fieldset>
          <legend className="mb-2 font-semibold">Background</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["day", "Bright"],
                ["soft", "Soft teal"],
                ["night", "Low glare"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className="btn btn-secondary min-h-10 px-4 text-sm"
                aria-pressed={theme === id}
                onClick={() => setTheme(id)}
                style={theme === id ? { borderColor: "var(--teal)", background: "rgba(42,157,154,0.12)" } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="text-sm text-[var(--ink-soft)]">
          Tip from research: if OpenDyslexic feels harder, try Lexend with wider spacing. Keep the setup that makes
          reading feel steadier for you.
        </p>
      </div>

      <div className="panel" style={surface}>
        <p className={`text-sm font-semibold uppercase tracking-[0.12em] opacity-70`}>Live preview</p>
        <p
          className={`mt-4 ${faceClass}`}
          style={{
            fontSize: `${size}px`,
            letterSpacing: `${letterSpacing}em`,
            wordSpacing: `${wordSpacing}em`,
            lineHeight,
          }}
        >
          {sample}
        </p>
        <p
          className={`mt-6 ${faceClass}`}
          style={{
            fontSize: `${size}px`,
            letterSpacing: `${letterSpacing}em`,
            wordSpacing: `${wordSpacing}em`,
            lineHeight,
          }}
        >
          b d p q · ship · when · map · thin · chat
        </p>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 font-semibold">
        <span>{label}</span>
        <span className="text-sm font-medium text-[var(--ink-soft)]">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className="control w-full accent-[var(--teal)]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
