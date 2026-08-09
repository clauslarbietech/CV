import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { OPERATION_IRON_14 } from '@/constants/programs';
import { XP_REWARDS } from '@/constants/xp';
import {
  DailyProgress,
  DifficultyTier,
  ExerciseSetLog,
  StreakState,
  UserProgramEnrollment,
  WorkoutSessionLog,
} from '@/types';
import { todayKey } from '@/utils/format';
import { useProfileStore } from './profileStore';

function emptyDaily(date = todayKey()): DailyProgress {
  return {
    date,
    workoutCompleted: false,
    steps: 6420,
    stepsTarget: 8000,
    proteinG: 92,
    proteinTarget: 150,
    calories: 1420,
    calorieTarget: 2000,
    waterMl: 1200,
    waterTarget: 3000,
    checkInCompleted: false,
    supplementsCompleted: false,
    medicationsLogged: false,
  };
}

interface CompleteWorkoutInput {
  day: number;
  durationSec: number;
  rating?: number;
  exerciseLogs?: ExerciseSetLog[];
  roundsCompleted?: number;
  sessionId?: string;
  startedAt?: string;
}

interface ProgramState {
  enrollment: UserProgramEnrollment | null;
  sessions: WorkoutSessionLog[];
  daily: DailyProgress;
  streaks: StreakState;
  enrollInIron14: (difficulty?: DifficultyTier) => void;
  setDifficulty: (tier: DifficultyTier) => void;
  completeWorkout: (input: CompleteWorkoutInput) => WorkoutSessionLog | null;
  isDayCompleted: (day: number) => boolean;
  completeCheckIn: () => void;
  updateDailyMetrics: (patch: Partial<DailyProgress>) => void;
}

export const useProgramStore = create<ProgramState>()(
  persist(
    (set, get) => ({
      enrollment: null,
      sessions: [],
      daily: emptyDaily(),
      streaks: {
        workoutStreak: 0,
        activityStreak: 0,
        nutritionStreak: 0,
        longestWorkoutStreak: 0,
      },
      enrollInIron14: (difficulty = 'soldier') => {
        set({
          enrollment: {
            programId: OPERATION_IRON_14.id,
            currentDay: 1,
            difficulty,
            startedAt: new Date().toISOString(),
            completedDayIds: [],
          },
          daily: emptyDaily(),
        });
      },
      setDifficulty: (tier) =>
        set((state) =>
          state.enrollment
            ? { enrollment: { ...state.enrollment, difficulty: tier } }
            : state,
        ),
      isDayCompleted: (day) =>
        Boolean(get().enrollment?.completedDayIds.includes(day)),
      completeWorkout: (input) => {
        const { enrollment, sessions, streaks, daily } = get();
        if (!enrollment) return null;

        // Idempotent: if day already completed, keep progression.
        if (enrollment.completedDayIds.includes(input.day)) {
          const existing = sessions.find(
            (s) => s.day === input.day && s.status === 'completed',
          );
          return existing ?? null;
        }

        const session: WorkoutSessionLog = {
          id: input.sessionId ?? `session-${Date.now()}`,
          programId: enrollment.programId,
          day: input.day,
          startedAt:
            input.startedAt ??
            new Date(Date.now() - input.durationSec * 1000).toISOString(),
          completedAt: new Date().toISOString(),
          durationSec: input.durationSec,
          difficultyRating: input.rating,
          exerciseLogs: input.exerciseLogs ?? [],
          roundsCompleted: input.roundsCompleted ?? 0,
          status: 'completed',
        };

        const completedDayIds = [...enrollment.completedDayIds, input.day].sort(
          (a, b) => a - b,
        );

        const isChallengeComplete =
          completedDayIds.length >= OPERATION_IRON_14.durationDays;

        // Unlock next day automatically (Day 1 → Day 2 … → Day 14).
        const nextDay = isChallengeComplete
          ? enrollment.currentDay
          : Math.min(input.day + 1, OPERATION_IRON_14.durationDays);

        const workoutStreak = streaks.workoutStreak + 1;

        useProfileStore.getState().addXp(XP_REWARDS.workoutCompleted);
        if (isChallengeComplete) {
          useProfileStore.getState().addXp(XP_REWARDS.challengeCompleted);
        }

        set({
          sessions: [session, ...sessions],
          enrollment: {
            ...enrollment,
            completedDayIds,
            currentDay: nextDay,
            completedAt: isChallengeComplete
              ? new Date().toISOString()
              : undefined,
          },
          daily: {
            ...daily,
            date: todayKey(),
            // Mission for the completed day is done; next day is unlocked.
            workoutCompleted: true,
          },
          streaks: {
            ...streaks,
            workoutStreak,
            activityStreak: streaks.activityStreak + 1,
            longestWorkoutStreak: Math.max(
              streaks.longestWorkoutStreak,
              workoutStreak,
            ),
          },
        });

        return session;
      },
      completeCheckIn: () => {
        useProfileStore.getState().addXp(XP_REWARDS.dailyCheckIn);
        set((state) => ({
          daily: { ...state.daily, checkInCompleted: true },
        }));
      },
      updateDailyMetrics: (patch) =>
        set((state) => ({
          daily: { ...state.daily, ...patch, date: todayKey() },
        })),
    }),
    {
      name: 'fitlife-program',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
