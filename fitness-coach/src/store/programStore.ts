import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getActiveProgram, OPERATION_IRON_30 } from '@/constants/programs';
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
    energyLevel: null,
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
  enrollInProgram: (
    programId?: string,
    difficulty?: DifficultyTier,
  ) => void;
  /** @deprecated use enrollInProgram — kept for older call sites */
  enrollInIron14: (difficulty?: DifficultyTier) => void;
  /** Reset progress and restart the active (or given) program at Day 1. */
  startOver: (programId?: string, difficulty?: DifficultyTier) => void;
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
      enrollInProgram: (programId = OPERATION_IRON_30.id, difficulty = 'recruit') => {
        set({
          enrollment: {
            programId,
            currentDay: 1,
            difficulty,
            startedAt: new Date().toISOString(),
            completedDayIds: [],
          },
          daily: emptyDaily(),
        });
      },
      enrollInIron14: (difficulty = 'recruit') => {
        get().enrollInProgram('operation-iron-14', difficulty);
      },
      startOver: (programId, difficulty = 'recruit') => {
        const current = get().enrollment;
        const id = programId ?? current?.programId ?? OPERATION_IRON_30.id;
        const tier = difficulty ?? current?.difficulty ?? 'recruit';
        set({
          enrollment: {
            programId: id,
            currentDay: 1,
            difficulty: tier,
            startedAt: new Date().toISOString(),
            completedDayIds: [],
          },
          sessions: get().sessions.filter((s) => s.programId !== id),
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

        const program = getActiveProgram(enrollment.programId);

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
          completedDayIds.length >= program.durationDays;

        const nextDay = isChallengeComplete
          ? enrollment.currentDay
          : Math.min(input.day + 1, program.durationDays);

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
