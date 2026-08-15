import type { AccessibilityPreference, ReadingFont } from "./types";

const FONT_MAP: Record<ReadingFont, string> = {
  lexend: 'var(--font-lexend), "Lexend", system-ui, sans-serif',
  opendyslexic: '"OpenDyslexic", var(--font-lexend), sans-serif',
  atkinson: 'var(--font-atkinson), "Atkinson Hyperlegible", sans-serif',
  verdana: 'Verdana, Geneva, sans-serif',
  system: "-apple-system, BlinkMacSystemFont, sans-serif",
};

const BG_MAP: Record<AccessibilityPreference["background"], { bg: string; fg: string }> = {
  dark: { bg: "#0a0a0c", fg: "#f5f5f7" },
  soft: { bg: "#1a2030", fg: "#e8eefc" },
  cream: { bg: "#faf6ef", fg: "#1a1a1a" },
  "high-contrast": { bg: "#000000", fg: "#ffff00" },
};

export function applyAccessibilityPrefs(prefs: AccessibilityPreference) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const colors = BG_MAP[prefs.background];
  root.style.setProperty("--hero-font", FONT_MAP[prefs.font]);
  root.style.setProperty("--hero-size", `${prefs.fontSize}px`);
  root.style.setProperty("--hero-letter-spacing", `${prefs.letterSpacing}em`);
  root.style.setProperty("--hero-word-spacing", `${prefs.wordSpacing}em`);
  root.style.setProperty("--hero-line-height", String(prefs.lineHeight));
  root.style.setProperty("--hero-bg", colors.bg);
  root.style.setProperty("--hero-fg", colors.fg);
  root.dataset.lineFocus = String(prefs.lineFocus);
  root.dataset.highlightWords = String(prefs.highlightWords);
  root.dataset.maskUnfocused = String(prefs.maskUnfocused);
}

export function readerSurfaceStyle(prefs: AccessibilityPreference) {
  const colors = BG_MAP[prefs.background];
  return {
    fontFamily: FONT_MAP[prefs.font],
    fontSize: `${prefs.fontSize}px`,
    letterSpacing: `${prefs.letterSpacing}em`,
    wordSpacing: `${prefs.wordSpacing}em`,
    lineHeight: prefs.lineHeight,
    background: colors.bg,
    color: colors.fg,
  } as const;
}
