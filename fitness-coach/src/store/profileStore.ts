import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { rankFromXp } from '@/constants/xp';
import {
  CoachPersonality,
  OnboardingDraft,
  UserProfile,
} from '@/types';
import { splitCsv } from '@/utils/format';

const defaultDraft: OnboardingDraft = {
  firstName: '',
  age: '',
  sex: '',
  heightCm: '',
  currentWeightKg: '',
  goalWeightKg: '',
  primaryGoal: '',
  experienceLevel: '',
  activityLevel: '',
  workoutLocation: '',
  equipment: [],
  trainingDaysPerWeek: 4,
  preferredDurationMin: 30,
  dietaryPreference: 'none',
  foodAllergies: '',
  physicalLimitations: '',
  injuries: '',
  coachPersonality: 'motivator',
  notificationEnabled: true,
};

interface ProfileState {
  profile: UserProfile | null;
  draft: OnboardingDraft;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  resetDraft: () => void;
  completeOnboarding: (userId: string, email?: string) => void;
  setCoachPersonality: (personality: CoachPersonality) => void;
  addXp: (amount: number) => void;
  updateWeight: (kg: number) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      draft: defaultDraft,
      updateDraft: (patch) =>
        set((state) => ({ draft: { ...state.draft, ...patch } })),
      resetDraft: () => set({ draft: defaultDraft }),
      completeOnboarding: (userId, email) => {
        const { draft } = get();
        const now = new Date().toISOString();
        const profile: UserProfile = {
          id: userId,
          firstName: draft.firstName.trim() || 'Athlete',
          email,
          age: draft.age ? Number(draft.age) : undefined,
          sex: draft.sex || undefined,
          heightCm: draft.heightCm ? Number(draft.heightCm) : undefined,
          currentWeightKg: draft.currentWeightKg
            ? Number(draft.currentWeightKg)
            : undefined,
          goalWeightKg: draft.goalWeightKg
            ? Number(draft.goalWeightKg)
            : undefined,
          primaryGoal: draft.primaryGoal || undefined,
          experienceLevel: draft.experienceLevel || undefined,
          activityLevel: draft.activityLevel || undefined,
          workoutLocation: draft.workoutLocation || undefined,
          equipment: draft.equipment,
          trainingDaysPerWeek: draft.trainingDaysPerWeek,
          preferredDurationMin: draft.preferredDurationMin,
          dietaryPreference: draft.dietaryPreference,
          foodAllergies: splitCsv(draft.foodAllergies),
          physicalLimitations: splitCsv(draft.physicalLimitations),
          injuries: splitCsv(draft.injuries),
          coachPersonality: draft.coachPersonality,
          notificationEnabled: draft.notificationEnabled,
          onboardingCompleted: true,
          xp: 0,
          rank: 'Recruit',
          createdAt: now,
          updatedAt: now,
        };
        set({ profile });
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
