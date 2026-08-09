import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { OPERATION_IRON_14 } from '@/constants/programs';
import { XP_REWARDS } from '@/constants/xp';
import {
  DailyProgress,
  DifficultyTier,
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

interface ProgramState {
  enrollment: UserProgramEnrollment | null;
  sessions: WorkoutSessionLog[];
  daily: DailyProgress;
  streaks: StreakState;
  enrollInIron14: (difficulty?: DifficultyTier) => void;
  setDifficulty: (tier: DifficultyTier) => void;
  completeWorkout: (day: number, durationSec: number, rating?: number) => void;
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
        });
      },
      setDifficulty: (tier) =>
        set((state) =>
          state.enrollment
            ? { enrollment: { ...state.enrollment, difficulty: tier } }
            : state,
        ),
      completeWorkout: (day, durationSec, rating) => {
        const { enrollment, sessions, streaks, daily } = get();
        if (!enrollment) return;

        const session: WorkoutSessionLog = {
          id: `session-${Date.now()}`,
          programId: enrollment.programId,
          day,
          startedAt: new Date(Date.now() - durationSec * 1000).toISOString(),
          completedAt: new Date().toISOString(),
          durationSec,
          difficultyRating: rating,
        };

        const completedDayIds = enrollment.completedDayIds.includes(day)
          ? enrollment.completedDayIds
          : [...enrollment.completedDayIds, day].sort((a, b) => a - b);

        const nextDay = Math.min(
          day + 1,
          OPERATION_IRON_14.durationDays,
        );

        const workoutStreak = streaks.workoutStreak + 1;
        const isChallengeComplete =
          completedDayIds.length >= OPERATION_IRON_14.durationDays;

        useProfileStore.getState().addXp(XP_REWARDS.workoutCompleted);
        if (isChallengeComplete) {
          useProfileStore.getState().addXp(XP_REWARDS.challengeCompleted);
        }

        set({
          sessions: [session, ...sessions],
          enrollment: {
            ...enrollment,
            completedDayIds,
            currentDay: isChallengeComplete ? enrollment.currentDay : nextDay,
            completedAt: isChallengeComplete
              ? new Date().toISOString()
              : undefined,
          },
          daily: { ...daily, date: todayKey(), workoutCompleted: true },
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
