export const colors = {
  background: '#0A0B0D',
  backgroundElevated: '#121418',
  surface: '#1A1D24',
  surfaceHover: '#22262F',
  border: '#2A2F3A',
  borderSubtle: '#1F242E',

  textPrimary: '#F4F5F7',
  textSecondary: '#A8B0BD',
  textMuted: '#6B7380',
  textInverse: '#0A0B0D',

  accent: '#3DFF8A',
  accentMuted: '#1FA855',
  accentSoft: 'rgba(61, 255, 138, 0.12)',

  warning: '#FF9F43',
  danger: '#FF5C5C',
  info: '#4DA3FF',

  militaryAccent: '#C4A35A',
  militarySurface: '#141812',
  militaryBorder: '#2E3428',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',

  success: '#3DFF8A',
  protein: '#4DA3FF',
  carbs: '#FF9F43',
  fat: '#E07AFF',
  water: '#5BC0EB',
  steps: '#A78BFA',
} as const;

export type ColorToken = keyof typeof colors;
