import { colors } from './colors';
import { radii, spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  radii,
  typography,
} as const;

export { colors, radii, spacing, typography };
