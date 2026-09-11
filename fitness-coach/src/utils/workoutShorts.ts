import {
  ExercisePose,
  getExerciseVisual,
} from '@/constants/exercises/exerciseVisuals';
import {
  DifficultyTier,
  ExerciseDefinition,
  ProgramDay,
} from '@/types';
import { resolveExercise } from '@/utils/workout';

export type ShortPanel = {
  id: string;
  name: string;
  pose: ExercisePose;
  /** BetterMe-style set×rep badge, e.g. "3x20" or "2x30s" */
  badge: string;
};

export function formatShortBadge(
  exercise: ExerciseDefinition,
  rounds: number,
): string {
  const r = Math.max(1, rounds);
  if (exercise.durationSec != null) {
    return `${r}x${exercise.durationSec}s`;
  }
  if (exercise.reps != null) {
    const reps =
      typeof exercise.reps === 'number'
        ? exercise.reps
        : String(exercise.reps).replace(/\s+/g, '');
    return `${r}x${reps}`;
  }
  return `${r}x`;
}

/** Build up to 6 panels for a vertical Shorts-style grid. */
export function buildShortPanels(
  day: ProgramDay,
  tier: DifficultyTier,
  max = 6,
): ShortPanel[] {
  const rounds = day.rounds ?? 3;
  const source = day.exercises.map((exercise, index) => {
    const resolved = resolveExercise(exercise, tier);
    const visual = getExerciseVisual(resolved.name);
    return {
      id: resolved.id || `short-${index}`,
      name: resolved.name,
      pose: visual.pose,
      badge: formatShortBadge(resolved, rounds),
    };
  });

  if (source.length === 0) return [];
  if (source.length >= max) return source.slice(0, max);

  const panels = [...source];
  let i = 0;
  while (panels.length < max) {
    const base = source[i % source.length];
    panels.push({
      ...base,
      id: `${base.id}-pad-${panels.length}`,
    });
    i += 1;
  }
  return panels;
}

export function shortsHeadline(opts: {
  minutes?: number;
  slot?: 'morning' | 'evening';
  dayTitle?: string;
}): string {
  const mins = opts.minutes ?? 15;
  const when =
    opts.slot === 'evening'
      ? 'EVERY NIGHT'
      : 'EVERY MORNING';
  return `${when}. ${mins} MINUTES. ${
    opts.dayTitle ? opts.dayTitle.toUpperCase() + '. ' : ''
  }THAT’S ALL IT TAKES TO BUILD THE BODY THEY NOTICE.`;
}

export function shortsSubcopy(programName: string): string {
  return `${programName.replace(/^OPERATION\s+/i, '')} · Shorts preview`;
}
