/**
 * Bible-reader usability palette.
 * Tuned for WCAG AA contrast on dark surfaces (kids + parents).
 *
 * Kept / improved:
 * - Body text near white on charcoal (≈15:1)
 * - Secondary labels ≥ #AEAEB2 on #121212 (≈5:1)
 * - Terracotta accent only for active/CTA (not body text)
 *
 * Avoided:
 * - Pure #000 eye-strain + crushed shadows → #121212
 * - white/35 copyright (fails AA) → reader.faint
 * - Warm cream / purple AI defaults
 */
export const readerColors = {
  bg: "#121212",
  surface: "#1C1C1E",
  elevated: "#2C2C2E",
  border: "#3A3A3C",
  text: "#F2F2F7",
  secondary: "#AEAEB2",
  faint: "#8E8E93",
  accent: "#E4572E",
  accentSoft: "#FF8A5B",
  warn: "#FFB086",
  highlight: "#F0D78C",
} as const;
