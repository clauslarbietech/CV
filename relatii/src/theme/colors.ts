/**
 * Relatii design tokens — from Cursor Development Master Brief §3.
 * Day: warm ivory. Night: deep aubergine. Primary: coral → magenta.
 */

export type ThemeMode = 'day' | 'night';
export type ThemePreference = 'system' | ThemeMode;

export type ThemeColors = {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceSoft: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  /** Coral fill for primary CTAs */
  primary: string;
  primaryEnd: string;
  onPrimary: string;
  primarySoft: string;
  /** Electric violet — DNA accents */
  dna: string;
  dnaSoft: string;
  onDna: string;
  /** Mint — positive alignment */
  success: string;
  successSoft: string;
  warning: string;
  danger: string;
  onDanger: string;
  overlay: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  chipBg: string;
  chipText: string;
  tabBar: string;
  statusBarStyle: 'light' | 'dark';
  heroGlow: string;
};

export const nightColors: ThemeColors = {
  background: '#17101D',
  backgroundElevated: '#1F1628',
  surface: '#2A1F36',
  surfaceSoft: 'rgba(255, 249, 245, 0.06)',
  border: 'rgba(234, 223, 232, 0.18)',
  borderSubtle: 'rgba(234, 223, 232, 0.1)',
  textPrimary: '#FFF9F5',
  textSecondary: 'rgba(255, 249, 245, 0.78)',
  textMuted: 'rgba(255, 249, 245, 0.58)',
  textInverse: '#17101D',
  primary: '#FF5F6D',
  primaryEnd: '#F13C78',
  onPrimary: '#FFFFFF',
  primarySoft: 'rgba(241, 60, 120, 0.22)',
  dna: '#8D6BFF',
  dnaSoft: 'rgba(141, 107, 255, 0.22)',
  onDna: '#FFFFFF',
  success: '#78D6B0',
  successSoft: 'rgba(120, 214, 176, 0.18)',
  warning: '#F5C26B',
  danger: '#E85A6B',
  onDanger: '#FFFFFF',
  overlay: 'rgba(23, 16, 29, 0.72)',
  gradientStart: '#2A1538',
  gradientMid: '#17101D',
  gradientEnd: '#3A1230',
  chipBg: 'rgba(141, 107, 255, 0.18)',
  chipText: '#E8DEFF',
  tabBar: '#120C16',
  statusBarStyle: 'light',
  heroGlow: 'rgba(241, 60, 120, 0.35)',
};

export const dayColors: ThemeColors = {
  background: '#FFF9F5',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSoft: 'rgba(23, 16, 29, 0.04)',
  border: '#EADFE8',
  borderSubtle: 'rgba(23, 16, 29, 0.06)',
  textPrimary: '#17101D',
  textSecondary: 'rgba(23, 16, 29, 0.72)',
  textMuted: 'rgba(23, 16, 29, 0.55)',
  textInverse: '#FFF9F5',
  primary: '#F13C78',
  primaryEnd: '#FF5F6D',
  onPrimary: '#FFFFFF',
  primarySoft: 'rgba(241, 60, 120, 0.12)',
  dna: '#6B4FE0',
  dnaSoft: 'rgba(107, 79, 224, 0.12)',
  onDna: '#FFFFFF',
  success: '#2F9E78',
  successSoft: 'rgba(47, 158, 120, 0.12)',
  warning: '#B7791F',
  danger: '#C53030',
  onDanger: '#FFFFFF',
  overlay: 'rgba(23, 16, 29, 0.4)',
  gradientStart: '#FFF9F5',
  gradientMid: '#FFE8F0',
  gradientEnd: '#F3ECFF',
  chipBg: 'rgba(107, 79, 224, 0.1)',
  chipText: '#4A36A8',
  tabBar: '#FFFFFF',
  statusBarStyle: 'dark',
  heroGlow: 'rgba(255, 95, 109, 0.2)',
};

export const colors = nightColors;

export function colorsForMode(mode: ThemeMode): ThemeColors {
  return mode === 'day' ? dayColors : nightColors;
}
