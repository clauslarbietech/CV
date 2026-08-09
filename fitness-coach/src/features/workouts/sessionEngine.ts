import {
  ActiveWorkoutSession,
  DifficultyTier,
  ExerciseDefinition,
  ExerciseSetLog,
  ProgramDay,
  SessionPhase,
} from '@/types';
import { resolveExercise } from '@/utils/workout';

export function parseRepTarget(reps?: number | string): number | undefined {
  if (reps == null) return undefined;
  if (typeof reps === 'number') return reps;
  const match = reps.match(/(\d+)/);
  return match ? Number(match[1]) : undefined;
}

export function getRestSeconds(day: ProgramDay): number {
  if (!day.restSec) return 60;
  return Math.round((day.restSec.min + day.restSec.max) / 2);
}

export function createActiveSession(args: {
  programId: string;
  day: ProgramDay;
  difficulty: DifficultyTier;
  expressMinutes?: 8 | 10 | 15;
}): ActiveWorkoutSession {
  const { day } = args;
  const totalRounds = Math.max(1, day.rounds ?? 1);

  return {
    id: `session-${Date.now()}`,
    programId: args.programId,
    day: day.day,
    difficulty: args.difficulty,
    expressMinutes: args.expressMinutes,
    startedAt: new Date().toISOString(),
    elapsedSec: 0,
    currentRound: 1,
    totalRounds,
    exerciseIndex: 0,
    phase: 'briefing',
    restRemainingSec: 0,
    holdRemainingSec: 0,
    exerciseLogs: [],
  };
}

export function currentExercise(
  day: ProgramDay,
  session: ActiveWorkoutSession,
): ExerciseDefinition | undefined {
  return day.exercises[session.exerciseIndex];
}

export function resolvedCurrentExercise(
  day: ProgramDay,
  session: ActiveWorkoutSession,
): ExerciseDefinition | undefined {
  const exercise = currentExercise(day, session);
  if (!exercise) return undefined;
  return resolveExercise(exercise, session.difficulty);
}

function buildLog(
  exercise: ExerciseDefinition,
  session: ActiveWorkoutSession,
  opts: {
    skipped?: boolean;
    modified?: boolean;
    completedReps?: number;
    completedDurationSec?: number;
  },
): ExerciseSetLog {
  const resolved = resolveExercise(exercise, session.difficulty);
  return {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    round: session.currentRound,
    targetReps: parseRepTarget(resolved.reps),
    completedReps: opts.skipped ? 0 : opts.completedReps,
    targetDurationSec: resolved.durationSec,
    completedDurationSec: opts.skipped ? 0 : opts.completedDurationSec,
    skipped: opts.skipped,
    modified: opts.modified,
    completedAt: new Date().toISOString(),
  };
}

export function startMission(session: ActiveWorkoutSession, day: ProgramDay): ActiveWorkoutSession {
  if (day.isRecovery || day.exercises.length === 0) {
    return { ...session, phase: 'rating' };
  }

  const first = resolveExercise(day.exercises[0], session.difficulty);
  if (first.durationSec && !first.reps) {
    return {
      ...session,
      phase: 'hold',
      holdRemainingSec: first.durationSec,
    };
  }

  return { ...session, phase: 'exercise' };
}

function advanceAfterExercise(
  session: ActiveWorkoutSession,
  day: ProgramDay,
  logs: ExerciseSetLog[],
): ActiveWorkoutSession {
  const isLastExercise = session.exerciseIndex >= day.exercises.length - 1;
  const isLastRound = session.currentRound >= session.totalRounds;

  if (!isLastExercise) {
    return {
      ...session,
      exerciseLogs: logs,
      exerciseIndex: session.exerciseIndex + 1,
      phase: 'rest',
      restRemainingSec: getRestSeconds(day),
    };
  }

  if (!isLastRound) {
    return {
      ...session,
      exerciseLogs: logs,
      currentRound: session.currentRound + 1,
      exerciseIndex: 0,
      phase: 'rest',
      restRemainingSec: getRestSeconds(day),
    };
  }

  return {
    ...session,
    exerciseLogs: logs,
    phase: 'rating',
    restRemainingSec: 0,
    holdRemainingSec: 0,
  };
}

export function completeCurrentExercise(
  session: ActiveWorkoutSession,
  day: ProgramDay,
  opts?: { modified?: boolean; completedReps?: number },
): ActiveWorkoutSession {
  const exercise = currentExercise(day, session);
  if (!exercise) return { ...session, phase: 'rating' };

  const resolved = resolveExercise(exercise, session.difficulty);
  const log = buildLog(exercise, session, {
    modified: opts?.modified,
    completedReps: opts?.completedReps ?? parseRepTarget(resolved.reps),
    completedDurationSec: resolved.durationSec,
  });

  return advanceAfterExercise(session, day, [...session.exerciseLogs, log]);
}

export function skipCurrentExercise(
  session: ActiveWorkoutSession,
  day: ProgramDay,
): ActiveWorkoutSession {
  const exercise = currentExercise(day, session);
  if (!exercise) return { ...session, phase: 'rating' };

  const log = buildLog(exercise, session, { skipped: true });
  return advanceAfterExercise(session, day, [...session.exerciseLogs, log]);
}

export function endRest(
  session: ActiveWorkoutSession,
  day: ProgramDay,
): ActiveWorkoutSession {
  const next = day.exercises[session.exerciseIndex];
  if (!next) return { ...session, phase: 'rating', restRemainingSec: 0 };

  const resolved = resolveExercise(next, session.difficulty);
  if (resolved.durationSec && parseRepTarget(resolved.reps) == null) {
    return {
      ...session,
      phase: 'hold',
      restRemainingSec: 0,
      holdRemainingSec: resolved.durationSec,
    };
  }

  return {
    ...session,
    phase: 'exercise',
    restRemainingSec: 0,
  };
}

export function tickRest(session: ActiveWorkoutSession): ActiveWorkoutSession {
  if (session.phase !== 'rest') return session;
  const next = Math.max(0, session.restRemainingSec - 1);
  return { ...session, restRemainingSec: next };
}

export function tickHold(session: ActiveWorkoutSession): ActiveWorkoutSession {
  if (session.phase !== 'hold') return session;
  const next = Math.max(0, session.holdRemainingSec - 1);
  return { ...session, holdRemainingSec: next };
}

export function tickElapsed(session: ActiveWorkoutSession): ActiveWorkoutSession {
  if (session.phase === 'briefing' || session.phase === 'complete') return session;
  return { ...session, elapsedSec: session.elapsedSec + 1 };
}

export function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function phaseLabel(phase: SessionPhase): string {
  switch (phase) {
    case 'briefing':
      return 'Mission Briefing';
    case 'exercise':
      return 'Work';
    case 'hold':
      return 'Hold';
    case 'rest':
      return 'Rest';
    case 'rating':
      return 'Rate Mission';
    case 'complete':
      return 'Complete';
  }
}
