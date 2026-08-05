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

/** Day / light — white surfaces, dark ink. */
export const lightPalette: AppPalette = {
  bg: "#FFFFFF",
  card: "#F7F4EF",
  elevated: "#F1EBE2",
  border: "#E5E0D8",
  text: "#1F2430",
  muted: "#5C6370",
  soft: "#8A9099",
  accent: "#E4572E",
  accentSoft: "#C2410C",
  warn: "#B45309",
  highlight: "#B8860B",
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
  };
}
