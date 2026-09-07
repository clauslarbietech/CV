import {
  CoachPersonality,
  DailyProgress,
  DifficultyTier,
  StreakState,
  UserProfile,
  UserProgramEnrollment,
} from '@/types';

/**
 * Structured AI context — send summaries, never the full user database.
 * Edge Functions should call this builder server-side before LLM requests.
 */
export interface CoachContext {
  goal: string | null;
  program: {
    id: string;
    name: string;
    day: number;
    difficulty: DifficultyTier;
  } | null;
  recentWorkouts: Array<{ day: number; completedAt?: string }>;
  nutrition: {
    proteinG: number;
    proteinTarget: number;
    calories: number;
    calorieTarget: number;
  };
  checkInCompleted: boolean;
  streaks: StreakState;
  limitations: string[];
  injuries: string[];
  coachPersonality: CoachPersonality;
  freeTierDailyLimit: number;
}

export function buildCoachContext(args: {
  profile: UserProfile;
  enrollment: UserProgramEnrollment | null;
  programName?: string;
  daily: DailyProgress;
  streaks: StreakState;
  recentCompletedDays?: number[];
}): CoachContext {
  const { profile, enrollment, programName, daily, streaks, recentCompletedDays } =
    args;

  return {
    goal: profile.primaryGoal ?? null,
    program: enrollment
      ? {
          id: enrollment.programId,
          name: programName ?? enrollment.programId,
          day: enrollment.currentDay,
          difficulty: enrollment.difficulty,
        }
      : null,
    recentWorkouts: (recentCompletedDays ?? enrollment?.completedDayIds.slice(-5) ?? []).map(
      (day) => ({ day }),
    ),
    nutrition: {
      proteinG: daily.proteinG,
      proteinTarget: daily.proteinTarget,
      calories: daily.calories,
      calorieTarget: daily.calorieTarget,
    },
    checkInCompleted: daily.checkInCompleted,
    streaks,
    limitations: profile.physicalLimitations,
    injuries: profile.injuries,
    coachPersonality: profile.coachPersonality,
    freeTierDailyLimit: 20,
  };
}
