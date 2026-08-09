import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { rankFromXp } from '@/constants/xp';
import { CoachPersonality, UserProfile } from '@/types';

interface ProfileState {
  profile: UserProfile | null;
  quickStart: (args: { userId: string; firstName: string; email?: string }) => void;
  setCoachPersonality: (personality: CoachPersonality) => void;
  addXp: (amount: number) => void;
  updateWeight: (kg: number) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      quickStart: ({ userId, firstName, email }) => {
        const now = new Date().toISOString();
        const name = firstName.trim() || 'Athlete';
        set({
          profile: {
            id: userId,
            firstName: name,
            email,
            primaryGoal: 'lose_fat',
            experienceLevel: 'beginner',
            workoutLocation: 'home',
            equipment: ['none'],
            trainingDaysPerWeek: 6,
            preferredDurationMin: 30,
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
          },
        });
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
    }),
    {
      name: 'fitlife-profile',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
