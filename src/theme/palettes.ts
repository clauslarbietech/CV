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
  /** Brand accent for Pix / taglines (always orange family). */
  brand: string;
  /** Lighter orange for secondary brand marks on dark surfaces. */
  brandSoft: string;
};

/** Night / dark charcoal (default) — orange brand accents. */
export const darkPalette: AppPalette = {
  bg: "#121212",
  card: "#1C1C1E",
  elevated: "#2C2C2E",
  border: "#3A3A3C",
  text: "#F2F2F7",
  muted: "#C7C7CC",
  soft: "#AEAEB2",
  accent: "#E4572E",
  accentSoft: "#FF8A5B",
  warn: "#FFB086",
  highlight: "#FF8A5B",
  brand: "#E4572E",
  brandSoft: "#FF8A5B",
};

/**
 * Day / light — white surfaces, orange brand (TTW-style), dark gray body text.
 * Subtext uses charcoal grays for WCAG AA on white.
 */
export const lightPalette: AppPalette = {
  bg: "#FFFFFF",
  card: "#F8F8F8",
  elevated: "#F0F0F0",
  border: "#D1D1D6",
  text: "#1C1C1E",
  muted: "#3A3A3C",
  soft: "#48484A",
  accent: "#E4572E",
  accentSoft: "#F07A4A",
  warn: "#C2410C",
  highlight: "#F07A4A",
  brand: "#E4572E",
  brandSoft: "#F07A4A",
};

export function paletteFor(nightMode: boolean): AppPalette {
  return nightMode ? darkPalette : lightPalette;
}

/** CSS custom properties consumed by Tailwind `night.*` / brand tokens via NativeWind `vars()`. */
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
    "--app-brand": colors.brand,
    "--app-brand-soft": colors.brandSoft,
  };
}
