/**
 * Per-workout fuel lists keyed by session length.
 * Short sessions burn less glycogen → keep carbs/fat lighter; emphasize protein + hydration.
 * Longer sessions need more carbs around training for energy and recovery.
 *
 * Grounded in common sports-nutrition timing guidance (HPRC / ISSN-style practice):
 * short easy work doesn’t need heavy pre-fuel; hard/long work benefits from carbs + protein.
 */

export type WorkoutFuelBucket = 'short' | 'standard' | 'long';

export type WorkoutFuelItem = {
  label: string;
  why: string;
};

export type WorkoutFuelPlan = {
  bucket: WorkoutFuelBucket;
  label: string;
  durationHint: string;
  principle: string;
  carbLevel: 'Low' | 'Moderate' | 'Higher';
  fatLevel: 'Low' | 'Moderate';
  proteinFocus: string;
  before: WorkoutFuelItem[];
  after: WorkoutFuelItem[];
  avoid: string[];
  hydration: string;
};

export const WORKOUT_FUEL_PLANS: Record<WorkoutFuelBucket, WorkoutFuelPlan> = {
  short: {
    bucket: 'short',
    label: 'Short session fuel',
    durationHint: 'About 15 min or less (express / quick blocks)',
    principle:
      'Keep carbs and fat light. Protein and water are enough.',
    carbLevel: 'Low',
    fatLevel: 'Low',
    proteinFocus: '15–25 g protein after (or a light snack before if hungry)',
    before: [
      {
        label: 'Water or black coffee / tea',
        why: 'Hydrate without adding calories you won’t burn.',
      },
      {
        label: 'Optional: Greek yogurt (plain) or a few egg whites',
        why: 'Light protein if you’re hungry — skip heavy breads and fried food.',
      },
      {
        label: 'Optional: half a banana only if energy is flat',
        why: 'Tiny carb top-up; not a full carb meal for a short session.',
      },
    ],
    after: [
      {
        label: 'Protein shake or Greek yogurt + berries (small)',
        why: 'Supports muscle without a big carb dump after light work.',
      },
      {
        label: 'Turkey / chicken roll-ups or cottage cheese',
        why: 'Lean protein, low fat, easy to digest.',
      },
      {
        label: 'Water + pinch of salt if you sweat',
        why: 'Replace fluid; no need for a sports drink on short work.',
      },
    ],
    avoid: [
      'Large pasta / rice plates right before',
      'Fried / creamy / high-fat snacks',
      'Sugary energy drinks “for a 10-minute workout”',
    ],
    hydration: '8–12 oz water before; sip during; another 8–12 oz after.',
  },
  standard: {
    bucket: 'standard',
    label: 'Standard session fuel',
    durationHint: 'About 16–30 min (most home days)',
    principle:
      'Balanced carbs and protein; keep fat moderate.',
    carbLevel: 'Moderate',
    fatLevel: 'Moderate',
    proteinFocus: '20–30 g protein within ~2 hours after',
    before: [
      {
        label: 'Banana + small yogurt, or toast with thin peanut butter',
        why: 'Moderate carbs for energy; fat stays light.',
      },
      {
        label: 'Oatmeal with berries (1–2 hrs out)',
        why: 'Steady carbs without a heavy gut.',
      },
      {
        label: 'Water — start hydrated',
        why: 'Performance drops fast when you’re behind on fluids.',
      },
    ],
    after: [
      {
        label: 'Chicken / fish / tofu + rice or potatoes',
        why: 'Protein + carbs to refill what you used.',
      },
      {
        label: 'Eggs + fruit, or shake + apple',
        why: 'Quick plate when you’re short on time.',
      },
      {
        label: 'Chocolate milk or yogurt parfait (optional)',
        why: 'Convenient carb + protein combo after training.',
      },
    ],
    avoid: [
      'Huge greasy takeout right before training',
      'Skipping protein after the session',
    ],
    hydration: '12–16 oz before; sip during; 16 oz after (more if sweaty).',
  },
  long: {
    bucket: 'long',
    label: 'Longer session fuel',
    durationHint: 'Over ~30 min (long train / hard days)',
    principle:
      'More carbs around longer workouts; keep pre-workout fat low.',
    carbLevel: 'Higher',
    fatLevel: 'Low',
    proteinFocus: '25–40 g protein + solid carbs within ~2 hours',
    before: [
      {
        label: 'Rice / oats / potato + lean protein (2–3 hrs out)',
        why: 'Tops up glycogen for a longer effort.',
      },
      {
        label: 'Banana or toast 30–60 min before if needed',
        why: 'Easy carbs without a heavy gut mid-workout.',
      },
      {
        label: 'Electrolyte water if it’s a sweaty day',
        why: 'Longer sessions lose more sodium with sweat.',
      },
    ],
    after: [
      {
        label: 'Full plate: protein + rice/pasta/potato + veggies',
        why: 'Refill carbs and repair muscle after longer work.',
      },
      {
        label: 'Recovery shake + banana or bagel',
        why: 'Fast carbs + protein when appetite is low.',
      },
      {
        label: 'Rehydrate until urine is pale yellow',
        why: 'Fluid debt after long sessions sneaks up on you.',
      },
    ],
    avoid: [
      'Training fasted for long/hard days if you feel weak',
      'Very high-fat meals in the hour before',
      'Only protein with zero carbs after a long session',
    ],
    hydration: '16 oz before; sip often; 16–24 oz after per rough sweat loss.',
  },
};

/** Midpoint minutes → fuel bucket. Express 8/10/15 always short. */
export function workoutFuelBucket(minutes: number): WorkoutFuelBucket {
  if (!Number.isFinite(minutes) || minutes <= 15) return 'short';
  if (minutes <= 30) return 'standard';
  return 'long';
}

export function resolveWorkoutMinutes(args: {
  expressMinutes?: number | null;
  estimated?: { min: number; max: number } | null;
}): number {
  if (args.expressMinutes && args.expressMinutes > 0) {
    return args.expressMinutes;
  }
  if (args.estimated) {
    return (args.estimated.min + args.estimated.max) / 2;
  }
  return 25;
}

export function getWorkoutFuelPlan(args: {
  expressMinutes?: number | null;
  estimated?: { min: number; max: number } | null;
}): WorkoutFuelPlan {
  const mins = resolveWorkoutMinutes(args);
  return WORKOUT_FUEL_PLANS[workoutFuelBucket(mins)];
}
