/**
 * SmartGym-inspired theme:
 * true black + neon volt green + charcoal surfaces + electric blue actions.
 */
export const colors = {
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

  /** Neon volt / lime — primary brand accent */
  accent: '#C0FF00',
  accentMuted: '#8FBF00',
  accentSoft: 'rgba(192, 255, 0, 0.14)',
  accentGlow: 'rgba(192, 255, 0, 0.22)',

  /** Electric blue — secondary actions / log set */
  action: '#3B82F6',
  actionSoft: 'rgba(59, 130, 246, 0.18)',

  warning: '#FF9F43',
  danger: '#FF4B32',
  info: '#4B91F1',

  /** Iron 14 uses neon green, not camouflage gold */
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
} as const;

export type ColorToken = keyof typeof colors;
