import { BODY_FRAME_SIZES } from '@/constants/bodyVision';
import { BodyFrameSize } from '@/types';

const LB_PER_KG = 2.20462;

export function kgFromLb(lb: number): number {
  return Math.round(lb * 0.453592 * 10) / 10;
}

export function lbFromKg(kg: number): number {
  return Math.round(kg * LB_PER_KG);
}

export function formatWeightDual(kg: number): string {
  return `${kg} kg · ${lbFromKg(kg)} lb`;
}

/** Suggest body frame from current weight (any size athlete). */
export function suggestBodyFrameFromKg(kg: number): BodyFrameSize {
  if (kg >= 130) return 'plus';
  if (kg >= 115) return 'xxl';
  if (kg >= 100) return 'xl';
  if (kg >= 88) return 'large';
  if (kg >= 75) return 'medium';
  if (kg >= 62) return 'mid';
  return 'small';
}

export function suggestGoalWeightKg(
  currentKg: number,
  primaryGoal?: string,
): number | undefined {
  if (!Number.isFinite(currentKg) || currentKg <= 0) return undefined;
  if (primaryGoal === 'build_muscle') {
    // Maintain or slight gain for recomposition at higher weights
    return Math.round((currentKg + 2) * 10) / 10;
  }
  if (primaryGoal === 'lose_fat') {
    return Math.max(50, Math.round((currentKg - 8) * 10) / 10);
  }
  return currentKg;
}

export function weightPlaceholder(primaryGoal?: string): {
  now: string;
  goal: string;
} {
  if (primaryGoal === 'build_muscle') {
    return {
      now: 'e.g. 136 (300 lb)',
      goal: 'e.g. 138 — maintain or gain',
    };
  }
  return {
    now: 'e.g. 82',
    goal: 'e.g. 75',
  };
}

export function isHeavierAthleteKg(kg: number): boolean {
  return kg >= 100;
}

export function frameIndex(size: BodyFrameSize): number {
  return BODY_FRAME_SIZES.indexOf(size);
}
