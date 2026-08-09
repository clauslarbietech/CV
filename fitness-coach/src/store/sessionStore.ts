import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  completeCurrentExercise,
  createActiveSession,
  endRest,
  skipCurrentExercise,
  startMission,
  tickElapsed,
  tickHold,
  tickRest,
} from '@/features/workouts/sessionEngine';
import { ActiveWorkoutSession, DifficultyTier, ProgramDay } from '@/types';

interface SessionState {
  active: ActiveWorkoutSession | null;
  begin: (args: {
    programId: string;
    day: ProgramDay;
    difficulty: DifficultyTier;
  }) => void;
  resumeOrBegin: (args: {
    programId: string;
    day: ProgramDay;
    difficulty: DifficultyTier;
  }) => void;
  launch: (day: ProgramDay) => void;
  completeExercise: (day: ProgramDay, opts?: { modified?: boolean; completedReps?: number }) => void;
  skipExercise: (day: ProgramDay) => void;
  finishRest: (day: ProgramDay) => void;
  setRating: (rating: number) => void;
  markComplete: () => void;
  clear: () => void;
  tick: (day: ProgramDay) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      active: null,
      begin: ({ programId, day, difficulty }) => {
        set({ active: createActiveSession({ programId, day, difficulty }) });
      },
      resumeOrBegin: ({ programId, day, difficulty }) => {
        const current = get().active;
        if (
          current &&
          current.programId === programId &&
          current.day === day.day &&
          current.phase !== 'complete'
        ) {
          return;
        }
        set({ active: createActiveSession({ programId, day, difficulty }) });
      },
      launch: (day) => {
        const active = get().active;
        if (!active) return;
        set({ active: startMission(active, day) });
      },
      completeExercise: (day, opts) => {
        const active = get().active;
        if (!active) return;
        set({ active: completeCurrentExercise(active, day, opts) });
      },
      skipExercise: (day) => {
        const active = get().active;
        if (!active) return;
        set({ active: skipCurrentExercise(active, day) });
      },
      finishRest: (day) => {
        const active = get().active;
        if (!active) return;
        set({ active: endRest(active, day) });
      },
      setRating: (rating) => {
        const active = get().active;
        if (!active) return;
        set({ active: { ...active, difficultyRating: rating } });
      },
      markComplete: () => {
        const active = get().active;
        if (!active) return;
        set({ active: { ...active, phase: 'complete' } });
      },
      clear: () => set({ active: null }),
      tick: (day) => {
        const active = get().active;
        if (!active) return;

        let next = tickElapsed(active);

        if (next.phase === 'rest') {
          next = tickRest(next);
          if (next.restRemainingSec === 0) {
            next = endRest(next, day);
          }
        }

        if (next.phase === 'hold') {
          next = tickHold(next);
          if (next.holdRemainingSec === 0) {
            next = completeCurrentExercise(next, day);
          }
        }

        set({ active: next });
      },
    }),
    {
      name: 'fitlife-active-session',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
