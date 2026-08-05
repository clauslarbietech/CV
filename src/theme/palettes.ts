/** Shared light / dark surface tokens for night-mode toggle. */

export type AppPalette = {
  bg: string;
  card: string;
  elevated: string;
  border: string;
  text: string;
  muted: string;
  soft: string;
  accent: string;
  accentSoft: string;
  warn: string;
  highlight: string;
};

/** Night / dark charcoal (default). */
export const darkPalette: AppPalette = {
  bg: "#121212",
  card: "#1C1C1E",
  elevated: "#2C2C2E",
  border: "#3A3A3C",
  text: "#F2F2F7",
  muted: "#AEAEB2",
  soft: "#8E8E93",
  accent: "#E4572E",
  accentSoft: "#FF8A5B",
  warn: "#FFB086",
  highlight: "#F0D78C",
};

/** Day / light — white surfaces, dark ink (WCAG AA body text on bg). */
export const lightPalette: AppPalette = {
  bg: "#FFFFFF",
  card: "#F7F4EF",
  elevated: "#F1EBE2",
  border: "#C9C4BC",
  text: "#1F2430",
  muted: "#4B5563",
  soft: "#4B5563",
  accent: "#B8380E",
  accentSoft: "#9A3412",
  warn: "#92400E",
  highlight: "#854D0E",
};

export function paletteFor(nightMode: boolean): AppPalette {
  return nightMode ? darkPalette : lightPalette;
}

/** CSS custom properties consumed by Tailwind `night.*` tokens via NativeWind `vars()`. */
export function themeCssVars(colors: AppPalette): Record<`--${string}`, string> {
  return {
    "--app-bg": colors.bg,
    "--app-card": colors.card,
    "--app-elevated": colors.elevated,
    "--app-border": colors.border,
    "--app-text": colors.text,
    "--app-muted": colors.muted,
    "--app-soft": colors.soft,
    "--app-accent": colors.accent,
    "--app-accent-soft": colors.accentSoft,
    "--app-warn": colors.warn,
    "--app-highlight": colors.highlight,
  };
}
