import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { rankFromXp } from '@/constants/xp';
import {
  CoachPersonality,
  ExperienceLevel,
  FitnessGoal,
  Sex,
  UserProfile,
} from '@/types';

interface ProfileState {
  profile: UserProfile | null;
  /** @deprecated prefer completeOnboarding */
  quickStart: (args: {
    userId: string;
    firstName: string;
    email?: string;
  }) => void;
  completeOnboarding: (args: {
    userId: string;
    firstName: string;
    sex?: Sex;
    primaryGoal?: FitnessGoal;
    experienceLevel?: ExperienceLevel;
    preferredDurationMin?: number;
    email?: string;
  }) => void;
  setCoachPersonality: (personality: CoachPersonality) => void;
  setSex: (sex: Sex) => void;
  addXp: (amount: number) => void;
  updateWeight: (kg: number) => void;
  resetOnboarding: () => void;
}

function buildProfile(args: {
  userId: string;
  firstName: string;
  sex?: Sex;
  primaryGoal?: FitnessGoal;
  experienceLevel?: ExperienceLevel;
  preferredDurationMin?: number;
  email?: string;
}): UserProfile {
  const now = new Date().toISOString();
  const name = args.firstName.trim() || 'Athlete';
  return {
    id: args.userId,
    firstName: name,
    email: args.email,
    sex: args.sex,
    primaryGoal: args.primaryGoal ?? 'lose_fat',
    experienceLevel: args.experienceLevel ?? 'beginner',
    workoutLocation: 'home',
    equipment: ['none'],
    trainingDaysPerWeek: 6,
    preferredDurationMin: args.preferredDurationMin ?? 30,
    dietaryPreference: 'none',
    foodAllergies: [],
    physicalLimitations: [],
    injuries: [],
    coachPersonality: 'drill_sergeant',
    notificationEnabled: true,
    onboardingCompleted: true,
    xp: 0,
    rank: 'Recruit',
    createdAt: now,
    updatedAt: now,
  };
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      quickStart: ({ userId, firstName, email }) => {
        set({
          profile: buildProfile({ userId, firstName, email }),
        });
      },
      completeOnboarding: (args) => {
        set({ profile: buildProfile(args) });
      },
      setCoachPersonality: (personality) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  coachPersonality: personality,
                  updatedAt: new Date().toISOString(),
                },
              }
            : state,
        ),
      setSex: (sex) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  sex,
                  updatedAt: new Date().toISOString(),
                },
              }
            : state,
        ),
      addXp: (amount) =>
        set((state) => {
          if (!state.profile) return state;
          const xp = state.profile.xp + amount;
          return {
            profile: {
              ...state.profile,
              xp,
              rank: rankFromXp(xp),
              updatedAt: new Date().toISOString(),
            },
          };
        }),
      updateWeight: (kg) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  currentWeightKg: kg,
                  updatedAt: new Date().toISOString(),
                },
              }
            : state,
        ),
      resetOnboarding: () => set({ profile: null }),
    }),
    {
      name: 'fitlife-profile',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
