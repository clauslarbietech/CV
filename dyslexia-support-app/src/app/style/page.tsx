"use client";

import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { applyAccessibilityPrefs } from "@/lib/hero/accessibility";
import { saveProfile } from "@/lib/hero/store";
import type { AccessibilityPreference, ReadingFont } from "@/lib/hero/types";

const FONTS: { id: ReadingFont; label: string; note: string }[] = [
  { id: "lexend", label: "Lexend", note: "Designed for readability" },
  { id: "opendyslexic", label: "OpenDyslexic", note: "Specialty shapes — mixed evidence alone" },
  { id: "atkinson", label: "Atkinson Hyperlegible", note: "Clear letterforms" },
  { id: "verdana", label: "Verdana", note: "Wide, familiar sans" },
  { id: "system", label: "System", note: "Device default" },
];

/** Research-informed starting point: spacing often helps more than font shape alone */
const RESEARCH_PRESET: AccessibilityPreference = {
  font: "lexend",
  fontSize: 20,
  letterSpacing: 0.08,
  wordSpacing: 0.18,
  lineHeight: 1.85,
  background: "dark",
  lineFocus: true,
  highlightWords: true,
  maskUnfocused: false,
  showSyllables: false,
};

export default function StylePage() {
  const profile = useHeroProfile();
  const prefs = profile.accessibility;

  function update(patch: Partial<AccessibilityPreference>) {
    const next = { ...prefs, ...patch };
    saveProfile({ accessibility: next });
    applyAccessibilityPrefs(next);
  }

  function applyResearchPreset() {
    saveProfile({ accessibility: RESEARCH_PRESET });
    applyAccessibilityPrefs(RESEARCH_PRESET);
  }

  return (
    <div>
      <header className="module-header">
        <h1>Reading Style</h1>
        <p>Font, spacing, contrast, and focus tools—personalize how text looks.</p>
        <ScienceBadge tier="evidence-informed" />
      </header>

      <div className="panel science-rec-panel">
        <p className="science-rec-label">Research note</p>
        <p className="home-practice-detail">
          Studies often find letter and word spacing help more than specialty “dyslexia fonts” alone. Start with spacing and size, then try fonts and keep what feels clearest for you.
        </p>
        <button type="button" className="btn btn-accent module-cta" onClick={applyResearchPreset}>
          Apply spacing-first preset
        </button>
      </div>

      <div className="panel space-y-4">
        <label className="field">
          <span>Font</span>
          <select className="control" value={prefs.font} onChange={(e) => update({ font: e.target.value as ReadingFont })}>
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label} — {f.note}
              </option>
            ))}
          </select>
        </label>

        <Slider label="Size" value={prefs.fontSize} min={14} max={28} step={1} onChange={(v) => update({ fontSize: v })} suffix="px" />
        <Slider label="Letter spacing" value={prefs.letterSpacing} min={0} max={0.2} step={0.01} onChange={(v) => update({ letterSpacing: v })} suffix="em" />
        <Slider label="Word spacing" value={prefs.wordSpacing} min={0} max={0.4} step={0.02} onChange={(v) => update({ wordSpacing: v })} suffix="em" />
        <Slider label="Line height" value={prefs.lineHeight} min={1.3} max={2.2} step={0.05} onChange={(v) => update({ lineHeight: v })} suffix="" />

        <Toggle label="Line focus" checked={prefs.lineFocus} onChange={(v) => update({ lineFocus: v })} />
        <Toggle label="Highlight words (Listen/Reader)" checked={prefs.highlightWords} onChange={(v) => update({ highlightWords: v })} />
        <Toggle label="Mask unfocused text" checked={prefs.maskUnfocused} onChange={(v) => update({ maskUnfocused: v })} />
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
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="field">
      <span>
        {label} — {value}
        {suffix}
      </span>
      <input className="w-full accent-[var(--accent)]" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
