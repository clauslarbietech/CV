"use client";

import { useState } from "react";

type Face = "lexend" | "opendyslexic" | "system";

const sample =
  "Reading gets easier when letters stop crowding each other. Try this paragraph with different fonts, sizes, and spacing until your eyes feel calm and your brain can catch the sounds.";

export function FontLab() {
  const [face, setFace] = useState<Face>("lexend");
  const [size, setSize] = useState(20);
  const [letterSpacing, setLetterSpacing] = useState(0.06);
  const [wordSpacing, setWordSpacing] = useState(0.2);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [theme, setTheme] = useState<"night" | "soft" | "day">("night");

  const faceClass = face === "opendyslexic" ? "reading-opendyslexic" : "";

  const surface =
    theme === "day"
      ? { background: "#f4f4f5", color: "#111" }
      : theme === "soft"
        ? { background: "#1a2030", color: "#e8eefc" }
        : { background: "#0b0b0d", color: "#fff" };

  return (
    <div className="grid gap-4">
      <div className="panel space-y-5">
        <label className="block">
          <span className="mb-2 block font-semibold">Font family</span>
          <select className="control" value={face} onChange={(e) => setFace(e.target.value as Face)}>
            <option value="lexend">Lexend</option>
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
                ["night", "Dark"],
                ["soft", "Soft"],
                ["day", "Bright"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className="btn btn-ghost min-h-10 px-4 text-sm"
                aria-pressed={theme === id}
                onClick={() => setTheme(id)}
                style={
                  theme === id
                    ? { borderColor: "rgba(255,122,61,0.5)", background: "rgba(255,122,61,0.16)" }
                    : undefined
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="panel" style={surface}>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] opacity-70">Live preview</p>
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
        <span className="text-sm font-medium text-[var(--ink-muted)]">
          {value}
          {suffix}
        </span>
      </span>
      <input
        className="w-full accent-[var(--accent)]"
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
