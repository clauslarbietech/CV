import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { buildProvisionalDna } from '@/features/dna/provisionalDna';
import type {
  ChildrenFutureId,
  IntentionId,
  OnboardingAnswers,
  PriorityId,
  ProvisionalDna,
} from '@/types';

type MatchState = {
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  ageConfirmed: boolean;
  confirmAge: () => void;
  onboardingStep: number;
  answers: OnboardingAnswers;
  dna: ProvisionalDna | null;
  dnaSaved: boolean;
  enteredApp: boolean;
  connectedIds: string[];
  setStep: (step: number) => void;
  toggleIntention: (id: IntentionId) => void;
  setChildrenFuture: (id: ChildrenFutureId) => void;
  togglePriority: (id: PriorityId) => void;
  completeOnboarding: () => void;
  saveDna: () => void;
  enterApp: () => void;
  connectProfile: (id: string) => void;
  resetGuest: () => void;
};

const emptyAnswers: OnboardingAnswers = {
  intentions: [],
  childrenFuture: null,
  priorities: [],
};

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      ageConfirmed: false,
      confirmAge: () => set({ ageConfirmed: true }),
      onboardingStep: 0,
      answers: emptyAnswers,
      dna: null,
      dnaSaved: false,
      enteredApp: false,
      connectedIds: [],
      setStep: (step) => set({ onboardingStep: step }),
      toggleIntention: (id) => {
        const current = get().answers.intentions;
        const intentions = current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id];
        set({ answers: { ...get().answers, intentions } });
      },
      setChildrenFuture: (id) =>
        set({ answers: { ...get().answers, childrenFuture: id } }),
      togglePriority: (id) => {
        const current = get().answers.priorities;
        if (current.includes(id)) {
          set({
            answers: {
              ...get().answers,
              priorities: current.filter((x) => x !== id),
            },
          });
          return;
        }
        if (current.length >= 3) return;
        set({
          answers: { ...get().answers, priorities: [...current, id] },
        });
      },
      completeOnboarding: () => {
        const dna = buildProvisionalDna(get().answers);
        set({ dna, onboardingStep: 4 });
      },
      saveDna: () => set({ dnaSaved: true }),
      enterApp: () => set({ enteredApp: true }),
      connectProfile: (id) => {
        const ids = get().connectedIds;
        if (ids.includes(id)) return;
        set({ connectedIds: [...ids, id] });
      },
      resetGuest: () =>
        set({
          ageConfirmed: false,
          onboardingStep: 0,
          answers: emptyAnswers,
          dna: null,
          dnaSaved: false,
          enteredApp: false,
          connectedIds: [],
        }),
    }),
    {
      name: 'relatii-match-guest',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ageConfirmed: state.ageConfirmed,
        onboardingStep: state.onboardingStep,
        answers: state.answers,
        dna: state.dna,
        dnaSaved: state.dnaSaved,
        enteredApp: state.enteredApp,
        connectedIds: state.connectedIds,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
