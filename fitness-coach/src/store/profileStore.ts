import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { rankFromXp } from '@/constants/xp';
import { displayRank } from '@/constants/displayLabels';
import {
  BodyFrameSize,
  CoachPersonality,
  ExperienceLevel,
  FitnessGoal,
  ProgressPhotoEntry,
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
  setPrimaryGoal: (goal: FitnessGoal) => void;
  setBodyVision: (args: {
    currentFrame: BodyFrameSize;
    goalFrame: BodyFrameSize;
    currentPhotoUri?: string | null;
    linkedProgramId?: string;
    currentWeightKg?: number;
    goalWeightKg?: number;
  }) => void;
  addProgressPhoto: (args: {
    uri: string;
    weightKg?: number;
    note?: string;
  }) => ProgressPhotoEntry | null;
  removeProgressPhoto: (id: string) => void;
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
    primaryGoal: args.primaryGoal ?? 'general_fitness',
    experienceLevel: args.experienceLevel ?? 'beginner',
    workoutLocation: 'home',
    equipment: ['none'],
    trainingDaysPerWeek: 6,
    preferredDurationMin: args.preferredDurationMin ?? 30,
    dietaryPreference: 'none',
    foodAllergies: [],
    physicalLimitations: [],
    injuries: [],
    coachPersonality: 'calm_coach',
    notificationEnabled: true,
    onboardingCompleted: true,
    xp: 0,
    rank: 'Starter',
    createdAt: now,
    updatedAt: now,
  };
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
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
      setPrimaryGoal: (goal) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  primaryGoal: goal,
                  updatedAt: new Date().toISOString(),
                },
              }
            : state,
        ),
      setBodyVision: ({
        currentFrame,
        goalFrame,
        currentPhotoUri,
        linkedProgramId,
        currentWeightKg,
        goalWeightKg,
      }) =>
        set((state) => {
          if (!state.profile) return state;
          const now = new Date().toISOString();
          const prev = state.profile.bodyVision;
          const startWeightKg =
            prev?.startWeightKg ??
            currentWeightKg ??
            state.profile.currentWeightKg;

          let photoTimeline = prev?.photoTimeline ?? [];
          if (currentPhotoUri) {
            const already = photoTimeline.some((p) => p.uri === currentPhotoUri);
            if (!already) {
              photoTimeline = [
                {
                  id: `photo-${Date.now()}`,
                  uri: currentPhotoUri,
                  capturedAt: now,
                  weightKg: currentWeightKg ?? state.profile.currentWeightKg,
                  note: 'Starting check-in',
                },
                ...photoTimeline,
              ].slice(0, 24);
            }
          }

          return {
            profile: {
              ...state.profile,
              currentWeightKg: currentWeightKg ?? state.profile.currentWeightKg,
              goalWeightKg: goalWeightKg ?? state.profile.goalWeightKg,
              bodyVision: {
                currentFrame,
                goalFrame,
                currentPhotoUri: currentPhotoUri ?? null,
                startWeightKg,
                photoTimeline,
                linkedProgramId,
                updatedAt: now,
              },
              updatedAt: now,
            },
          };
        }),
      addProgressPhoto: ({ uri, weightKg, note }) => {
        const profile = get().profile;
        if (!profile?.bodyVision) return null;
        const now = new Date().toISOString();
        const entry: ProgressPhotoEntry = {
          id: `photo-${Date.now()}`,
          uri,
          capturedAt: now,
          weightKg: weightKg ?? profile.currentWeightKg,
          note,
        };
        set({
          profile: {
            ...profile,
            currentWeightKg: weightKg ?? profile.currentWeightKg,
            bodyVision: {
              ...profile.bodyVision,
              currentPhotoUri: uri,
              photoTimeline: [entry, ...(profile.bodyVision.photoTimeline ?? [])].slice(
                0,
                24,
              ),
              updatedAt: now,
            },
            updatedAt: now,
          },
        });
        return entry;
      },
      removeProgressPhoto: (id) =>
        set((state) => {
          if (!state.profile?.bodyVision) return state;
          const timeline = (state.profile.bodyVision.photoTimeline ?? []).filter(
            (p) => p.id !== id,
          );
          const latest = timeline[0];
          return {
            profile: {
              ...state.profile,
              bodyVision: {
                ...state.profile.bodyVision,
                photoTimeline: timeline,
                currentPhotoUri: latest?.uri ?? null,
                updatedAt: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            },
          };
        }),
      addXp: (amount) =>
        set((state) => {
          if (!state.profile) return state;
          const xp = state.profile.xp + amount;
          return {
            profile: {
              ...state.profile,
              xp,
              rank: displayRank(rankFromXp(xp)),
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
