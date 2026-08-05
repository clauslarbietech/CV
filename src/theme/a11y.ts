import type { AppPalette } from "./palettes";

/** WCAG 2.5.5 / iOS HIG minimum; Material recommends 48dp — we enforce 44pt minimum. */
export const MIN_TOUCH_TARGET = 44;

/** Body text baseline (px) — meets mobile readability and 508 legibility guidance. */
export const BODY_TEXT_SIZE = 16;

/** Minimum for captions/metadata when contrast is AA-compliant. */
export const CAPTION_TEXT_SIZE = 12;

export const LARGE_TEXT_SCALE = 1.18;

export function scaledFontSize(base: number, textScale: number): number {
  return Math.round(base * textScale);
}

/** Stronger contrast for Section 508 / WCAG AA in high-contrast mode. */
export function withHighContrast(
  palette: AppPalette,
  nightMode: boolean
): AppPalette {
  if (nightMode) {
    return {
      ...palette,
      text: "#FFFFFF",
      muted: "#D1D1D6",
      soft: "#C7C7CC",
      border: "#8E8E93",
      accent: "#FF7A4D",
      accentSoft: "#FFB088",
      warn: "#FFD4B8",
      highlight: "#FFE9A8",
    };
  }
  return {
    ...palette,
    bg: "#FFFFFF",
    card: "#FFFFFF",
    elevated: "#F0F0F0",
    border: "#1F2430",
    text: "#000000",
    muted: "#3D4450",
    soft: "#3D4450",
    accent: "#9A3412",
    accentSoft: "#9A3412",
    warn: "#92400E",
    highlight: "#854D0E",
  };
}
