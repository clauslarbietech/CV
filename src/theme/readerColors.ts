/**
 * Bible-reader usability palette (dark default).
 * Prefer `useReaderColors()` from ThemeProvider so light mode works.
 *
 * Tuned for WCAG AA contrast on dark surfaces (kids + parents).
 */
import { darkPalette, type AppPalette } from "./palettes";

/** Static dark tokens — prefer useReaderColors() for theme-aware UI. */
export const readerColors = {
  bg: darkPalette.bg,
  surface: darkPalette.card,
  elevated: darkPalette.elevated,
  border: darkPalette.border,
  text: darkPalette.text,
  secondary: darkPalette.muted,
  faint: darkPalette.soft,
  accent: darkPalette.accent,
  accentSoft: darkPalette.accentSoft,
  warn: darkPalette.warn,
  highlight: darkPalette.highlight,
} as const;

export type ReaderColorSet = {
  bg: string;
  surface: string;
  elevated: string;
  border: string;
  text: string;
  secondary: string;
  faint: string;
  accent: string;
  accentSoft: string;
  warn: string;
  highlight: string;
};

/** Map AppPalette → the shape bible components expect. */
export function toReaderColors(colors: AppPalette): ReaderColorSet {
  return {
    bg: colors.bg,
    surface: colors.card,
    elevated: colors.elevated,
    border: colors.border,
    text: colors.text,
    secondary: colors.muted,
    faint: colors.soft,
    accent: colors.accent,
    accentSoft: colors.accentSoft,
    warn: colors.warn,
    highlight: colors.highlight,
  };
}
