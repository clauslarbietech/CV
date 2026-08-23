/**
 * FitLife color palettes — night (default) and day.
 * Tuned for WCAG 2.1 AA contrast (4.5:1 text, 3:1 UI).
 *
 * Button rule:
 * - accent / military fills → use onAccent (black) for labels
 * - action / danger fills → use onAction / onDanger (white) for labels
 * - accent-colored text on surfaces → use accentText (not raw accent in day mode)
 */

export type ThemeMode = 'day' | 'night';

export type ThemeColors = {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderSubtle: string;
  borderAccent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  /** Bright volt fill (buttons, badges, neon highlights). Pair with onAccent. */
  accent: string;
  /** AA text/icon color derived from accent for use on bg/surface. */
  accentText: string;
  /** Label color on accent-filled controls (≥4.5:1). */
  onAccent: string;
  accentMuted: string;
  accentSoft: string;
  accentGlow: string;
  /** Primary action blue fill. Pair with onAction. */
  action: string;
  /** AA blue text on bg/surface. */
  actionText: string;
  /** Label color on action-filled controls (≥4.5:1). */
  onAction: string;
  actionSoft: string;
  warning: string;
  danger: string;
  onDanger: string;
  info: string;
  militaryAccent: string;
  militarySurface: string;
  militaryBorder: string;
  white: string;
  black: string;
  overlay: string;
  success: string;
  intensity: string;
  protein: string;
  carbs: string;
  fat: string;
  water: string;
  steps: string;
  cardGreen: string;
  cardYellow: string;
  cardBlue: string;
  tabBar: string;
  statusBarStyle: 'light' | 'dark';
};

export const nightColors: ThemeColors = {
  background: '#000000',
  backgroundElevated: '#0C0C0E',
  surface: '#1C1C1E',
  surfaceHover: '#2C2C2E',
  border: '#3A3A3C',
  borderSubtle: '#2C2C2E',
  borderAccent: 'rgba(192, 255, 0, 0.55)',

  textPrimary: '#FFFFFF',
  textSecondary: '#C7C7CC',
  /** ≥4.5:1 on black */
  textMuted: '#A1A1A6',
  textInverse: '#000000',

  accent: '#C0FF00',
  accentText: '#C0FF00',
  onAccent: '#000000',
  accentMuted: '#A8E000',
  accentSoft: 'rgba(192, 255, 0, 0.16)',
  accentGlow: 'rgba(192, 255, 0, 0.22)',

  /** Darkened so white labels clear 4.5:1 (was #3B82F6 @ ~3.7:1) */
  action: '#1D4ED8',
  actionText: '#93C5FD',
  onAction: '#FFFFFF',
  actionSoft: 'rgba(29, 78, 216, 0.22)',

  warning: '#FFB020',
  danger: '#B91C1C',
  onDanger: '#FFFFFF',
  info: '#60A5FA',

  militaryAccent: '#C0FF00',
  militarySurface: '#141814',
  militaryBorder: 'rgba(192, 255, 0, 0.4)',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.72)',

  success: '#C0FF00',
  intensity: '#F87171',
  protein: '#93C5FD',
  carbs: '#FFB020',
  fat: '#E879F9',
  water: '#67E8F9',
  steps: '#C4B5FD',

  cardGreen: '#22C55E',
  cardYellow: '#EAB308',
  cardBlue: '#1D4ED8',

  tabBar: '#0A0A0A',
  statusBarStyle: 'light',
};

export const dayColors: ThemeColors = {
  /** True white light mode — not sage/gray wash */
  background: '#FFFFFF',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceHover: '#F5F5F5',
  border: '#D4D4D4',
  borderSubtle: '#E8E8E8',
  borderAccent: 'rgba(63, 90, 0, 0.45)',

  textPrimary: '#0B120A',
  textSecondary: '#3A4338',
  /** ≥4.5:1 on white */
  textMuted: '#4F5A4C',
  textInverse: '#FFFFFF',

  /** Bright fill still OK with black labels */
  accent: '#C0FF00',
  /** Dark green for text/links on light surfaces (≥4.5:1) */
  accentText: '#3F5A00',
  onAccent: '#000000',
  accentMuted: '#4F7000',
  accentSoft: 'rgba(63, 90, 0, 0.12)',
  accentGlow: 'rgba(63, 90, 0, 0.18)',

  action: '#1D4ED8',
  actionText: '#1D4ED8',
  onAction: '#FFFFFF',
  actionSoft: 'rgba(29, 78, 216, 0.12)',

  warning: '#B45309',
  danger: '#B91C1C',
  onDanger: '#FFFFFF',
  info: '#1D4ED8',

  militaryAccent: '#3F5A00',
  militarySurface: '#FFFFFF',
  militaryBorder: 'rgba(63, 90, 0, 0.45)',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(11, 18, 10, 0.45)',

  success: '#3F5A00',
  intensity: '#B91C1C',
  protein: '#1D4ED8',
  carbs: '#B45309',
  fat: '#A21CAF',
  water: '#0E7490',
  steps: '#6D28D9',

  cardGreen: '#15803D',
  cardYellow: '#A16207',
  cardBlue: '#1D4ED8',

  tabBar: '#FFFFFF',
  statusBarStyle: 'dark',
};

/** @deprecated Prefer useTheme().colors — kept as night default for static imports. */
export const colors = nightColors;

export type ColorToken = keyof ThemeColors;

export function colorsForMode(mode: ThemeMode): ThemeColors {
  return mode === 'day' ? dayColors : nightColors;
}
