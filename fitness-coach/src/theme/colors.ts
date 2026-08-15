/**
 * FitLife color palettes — night (default) and day.
 * Accent stays volt green in both; day uses a cool sage-tinted light field
 * (not cream/terracotta).
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
  accent: string;
  accentMuted: string;
  accentSoft: string;
  accentGlow: string;
  action: string;
  actionSoft: string;
  warning: string;
  danger: string;
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
  /** Tab bar / chrome */
  tabBar: string;
  statusBarStyle: 'light' | 'dark';
};

export const nightColors: ThemeColors = {
  background: '#000000',
  backgroundElevated: '#0C0C0E',
  surface: '#1C1C1E',
  surfaceHover: '#2C2C2E',
  border: '#2C2C2E',
  borderSubtle: '#1F1F21',
  borderAccent: 'rgba(192, 255, 0, 0.45)',

  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  textInverse: '#000000',

  accent: '#C0FF00',
  accentMuted: '#8FBF00',
  accentSoft: 'rgba(192, 255, 0, 0.14)',
  accentGlow: 'rgba(192, 255, 0, 0.22)',

  action: '#3B82F6',
  actionSoft: 'rgba(59, 130, 246, 0.18)',

  warning: '#FF9F43',
  danger: '#FF4B32',
  info: '#4B91F1',

  militaryAccent: '#C0FF00',
  militarySurface: '#141814',
  militaryBorder: 'rgba(192, 255, 0, 0.35)',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.72)',

  success: '#C0FF00',
  intensity: '#FF4B32',
  protein: '#4B91F1',
  carbs: '#FF9F43',
  fat: '#E07AFF',
  water: '#5BC0EB',
  steps: '#A78BFA',

  cardGreen: '#1FA855',
  cardYellow: '#E6B800',
  cardBlue: '#2E5BFF',

  tabBar: '#0A0A0A',
  statusBarStyle: 'light',
};

export const dayColors: ThemeColors = {
  background: '#E7EDE4',
  backgroundElevated: '#F4F7F1',
  surface: '#FFFFFF',
  surfaceHover: '#E2E9DD',
  border: '#C5D0BE',
  borderSubtle: '#D5DED0',
  borderAccent: 'rgba(90, 130, 0, 0.45)',

  textPrimary: '#0B120A',
  textSecondary: '#4A5546',
  textMuted: '#6E7A68',
  textInverse: '#FFFFFF',

  accent: '#A8D400',
  accentMuted: '#6F9400',
  accentSoft: 'rgba(120, 160, 0, 0.16)',
  accentGlow: 'rgba(120, 160, 0, 0.22)',

  action: '#2563EB',
  actionSoft: 'rgba(37, 99, 235, 0.14)',

  warning: '#D97706',
  danger: '#DC2626',
  info: '#2563EB',

  militaryAccent: '#5F8200',
  militarySurface: '#E4ECD9',
  militaryBorder: 'rgba(95, 130, 0, 0.4)',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(11, 18, 10, 0.45)',

  success: '#5F8200',
  intensity: '#DC2626',
  protein: '#2563EB',
  carbs: '#D97706',
  fat: '#C026D3',
  water: '#0284C7',
  steps: '#7C3AED',

  cardGreen: '#15803D',
  cardYellow: '#CA8A04',
  cardBlue: '#1D4ED8',

  tabBar: '#F4F7F1',
  statusBarStyle: 'dark',
};

/** @deprecated Prefer useTheme().colors — kept as night default for static imports. */
export const colors = nightColors;

export type ColorToken = keyof ThemeColors;

export function colorsForMode(mode: ThemeMode): ThemeColors {
  return mode === 'day' ? dayColors : nightColors;
}
