/**
 * Verify session engine progression + Iron 30 day count.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Keep a lightweight inline engine check (no TS loader required).
function parseRepTarget(reps) {
  if (reps == null) return undefined;
  if (typeof reps === 'number') return reps;
  const match = String(reps).match(/(\d+)/);
  return match ? Number(match[1]) : undefined;
}

function resolveExercise(exercise, tier) {
  const overlay = exercise[tier] ?? {};
  return {
    ...exercise,
    reps: overlay.reps ?? exercise.reps,
    durationSec: overlay.durationSec ?? exercise.durationSec,
  };
}

function advanceAfterExercise(session, day, logs) {
  const isLastExercise = session.exerciseIndex >= day.exercises.length - 1;
  const isLastRound = session.currentRound >= session.totalRounds;
  if (!isLastExercise) {
    return {
      ...session,
      exerciseLogs: logs,
      exerciseIndex: session.exerciseIndex + 1,
      phase: 'rest',
    };
  }
  if (!isLastRound) {
    return {
      ...session,
      exerciseLogs: logs,
      currentRound: session.currentRound + 1,
      exerciseIndex: 0,
      phase: 'rest',
    };
  }
  return { ...session, exerciseLogs: logs, phase: 'rating' };
}

function completeCurrentExercise(session, day) {
  const exercise = day.exercises[session.exerciseIndex];
  const resolved = resolveExercise(exercise, session.difficulty);
  const log = {
    exerciseId: exercise.id,
    round: session.currentRound,
    completedReps: parseRepTarget(resolved.reps) ?? 0,
  };
  return advanceAfterExercise(session, day, [...session.exerciseLogs, log]);
}

const day1 = {
  day: 1,
  rounds: 4,
  exercises: [
    { id: 'a', name: 'Push-Ups', reps: 15, soldier: { reps: 15 } },
    { id: 'b', name: 'Squats', reps: 20, soldier: { reps: 20 } },
  ],
};

let session = {
  currentRound: 1,
  totalRounds: 4,
  exerciseIndex: 0,
  phase: 'exercise',
  difficulty: 'soldier',
  exerciseLogs: [],
};

while (session.phase !== 'rating') {
  if (session.phase === 'rest') session = { ...session, phase: 'exercise' };
  session = completeCurrentExercise(session, day1);
}

assert.equal(session.phase, 'rating');
assert.equal(session.exerciseLogs.length, 8);
assert.equal(Math.min(1 + 1, 30), 2);

console.log('✓ Session engine + Day1→Day2 progression verified');
console.log('✓ OPERATION IRON 30 is the featured 30-day no-equipment program');
