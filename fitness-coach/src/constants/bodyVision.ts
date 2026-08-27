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

/** Relative torso width used by dedicated frame graphics. */
export const BODY_FRAME_TORSO: Record<BodyFrameSize, number> = {
  small: 0.78,
  mid: 0.86,
  medium: 0.93,
  large: 1,
  xl: 1.08,
  xxl: 1.16,
  plus: 1.26,
};

export function frameScale(size: BodyFrameSize): number {
  return BODY_FRAME_SCALE[size];
}

export function frameTorso(size: BodyFrameSize): number {
  return BODY_FRAME_TORSO[size];
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

export function interpolateBodyTorso(
  current: BodyFrameSize,
  goal: BodyFrameSize,
  progress: number,
): number {
  const t = Math.max(0, Math.min(1, progress));
  const from = frameTorso(current);
  const to = frameTorso(goal);
  return from + (to - from) * t;
}

/**
 * Weight progress toward goal (0–1). Works for loss and gain.
 * Returns null when weights are missing or already at goal.
 */
export function weightProgress(
  startKg: number | undefined,
  currentKg: number | undefined,
  goalKg: number | undefined,
): number | null {
  if (
    startKg == null ||
    currentKg == null ||
    goalKg == null ||
    !Number.isFinite(startKg) ||
    !Number.isFinite(currentKg) ||
    !Number.isFinite(goalKg)
  ) {
    return null;
  }
  const span = goalKg - startKg;
  if (Math.abs(span) < 0.25) return 1;
  const moved = currentKg - startKg;
  return Math.max(0, Math.min(1, moved / span));
}

/**
 * Blend program completion with weight change when both exist.
 * Program alone if no weight goal; weight alone if program is 0 and weight moves.
 */
export function journeyProgress(args: {
  programProgress: number;
  startWeightKg?: number;
  currentWeightKg?: number;
  goalWeightKg?: number;
}): { progress: number; weightShare: number | null; source: string } {
  const program = Math.max(0, Math.min(1, args.programProgress));
  const weight = weightProgress(
    args.startWeightKg,
    args.currentWeightKg,
    args.goalWeightKg,
  );

  if (weight == null) {
    return {
      progress: program,
      weightShare: null,
      source: 'program days',
    };
  }

  // 55% program consistency + 45% scale movement — keeps streak valuable.
  const blended = program * 0.55 + weight * 0.45;
  return {
    progress: blended,
    weightShare: weight,
    source: 'program + weight',
  };
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

/** Closest frame label for an interpolated torso factor. */
export function nearestFrameFromTorso(torso: number): BodyFrameSize {
  let best: BodyFrameSize = 'large';
  let bestDist = Infinity;
  for (const size of BODY_FRAME_SIZES) {
    const dist = Math.abs(BODY_FRAME_TORSO[size] - torso);
    if (dist < bestDist) {
      bestDist = dist;
      best = size;
    }
  }
  return best;
}
