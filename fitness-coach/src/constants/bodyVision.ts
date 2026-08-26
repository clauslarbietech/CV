import { BodyFrameSize } from '@/types';

export const BODY_FRAME_SIZES: BodyFrameSize[] = [
  'small',
  'mid',
  'medium',
  'large',
  'xl',
  'xxl',
  'plus',
];

export const BODY_FRAME_LABELS: Record<BodyFrameSize, string> = {
  small: 'Small',
  mid: 'Mid',
  medium: 'Medium',
  large: 'Large',
  xl: 'XL',
  xxl: '2XL',
  plus: 'Plus',
};

/** Visual scale for silhouette preview (baseline = large). */
export const BODY_FRAME_SCALE: Record<BodyFrameSize, number> = {
  small: 0.72,
  mid: 0.82,
  medium: 0.9,
  large: 1,
  xl: 1.08,
  xxl: 1.16,
  plus: 1.24,
};

export function frameScale(size: BodyFrameSize): number {
  return BODY_FRAME_SCALE[size];
}

export function interpolateBodyScale(
  current: BodyFrameSize,
  goal: BodyFrameSize,
  progress: number,
): number {
  const t = Math.max(0, Math.min(1, progress));
  const from = frameScale(current);
  const to = frameScale(goal);
  return from + (to - from) * t;
}

export function defaultGoalFrame(
  current: BodyFrameSize,
  primaryGoal?: string,
): BodyFrameSize {
  const idx = BODY_FRAME_SIZES.indexOf(current);
  if (primaryGoal === 'build_muscle' || primaryGoal === 'strength') {
    return BODY_FRAME_SIZES[Math.min(BODY_FRAME_SIZES.length - 1, idx + 1)];
  }
  if (primaryGoal === 'lose_fat') {
    return BODY_FRAME_SIZES[Math.max(0, idx - 1)];
  }
  return current;
}
