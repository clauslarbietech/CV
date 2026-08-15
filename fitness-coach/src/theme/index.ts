import { colors, type ThemeColors } from './colors';
import { radii, spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  radii,
  typography,
} as const;

export { colors, radii, spacing, typography };
export type { ThemeColors, ThemeMode, ColorToken } from './colors';
export { dayColors, nightColors, colorsForMode } from './colors';
export { ThemeProvider, useTheme } from './ThemeProvider';
