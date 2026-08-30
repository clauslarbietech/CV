import {
  DifficultyTier,
  ExerciseDefinition,
  ProgramDay,
  WorkoutProgram,
} from '@/types';

export function resolveExercise(
  exercise: ExerciseDefinition,
  tier: DifficultyTier,
): ExerciseDefinition {
  const overlay = exercise[tier] ?? {};
  return {
    ...exercise,
    reps: overlay.reps ?? exercise.reps,
    durationSec: overlay.durationSec ?? exercise.durationSec,
  };
}

export function formatExerciseTarget(
  exercise: ExerciseDefinition,
  tier: DifficultyTier,
): string {
  const resolved = resolveExercise(exercise, tier);
  if (resolved.durationSec) {
    const mins = Math.floor(resolved.durationSec / 60);
    const secs = resolved.durationSec % 60;
    if (mins > 0 && secs === 0) return `${mins} min`;
    if (mins > 0) return `${mins}:${secs.toString().padStart(2, '0')}`;
    return `${resolved.durationSec}-second`;
  }
  if (resolved.reps != null) {
    const base = String(resolved.reps);
    return resolved.perSide ? `${base} per side` : base;
  }
  return '';
}

export function getProgramDay(
  program: WorkoutProgram,
  day: number,
): ProgramDay | undefined {
  return program.days.find((d) => d.day === day);
}

export function estimateCaloriesForDay(day: ProgramDay): number {
  const mid =
    (day.estimatedMinutes.min + day.estimatedMinutes.max) / 2;
  return Math.round(mid * 7.5);
}
