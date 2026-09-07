import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  type MedCategory,
  inferMedCategory,
} from '@/constants/medCategories';
import { todayKey } from '@/utils/format';

export type MedItem = {
  id: string;
  name: string;
  category: MedCategory;
  dose?: string;
  timeLabel?: string;
  takenOn: string[]; // YYYY-MM-DD dates marked taken
};

interface NotesState {
  meds: MedItem[];
  workNotes: string;
  personalNotes: string;
  addMed: (
    name: string,
    category: MedCategory,
    dose?: string,
    timeLabel?: string,
  ) => void;
  removeMed: (id: string) => void;
  toggleMedTaken: (id: string, date?: string) => void;
  isMedTakenToday: (id: string, date?: string) => boolean;
  setWorkNotes: (value: string) => void;
  setPersonalNotes: (value: string) => void;
}

type LegacyMedItem = Omit<MedItem, 'category'> & { category?: MedCategory };

function normalizeMed(med: LegacyMedItem): MedItem {
  return {
    ...med,
    category: med.category ?? inferMedCategory(med.name, med.timeLabel),
  };
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      meds: [
        {
          id: 'med-default-1',
          name: 'Morning Rx',
          category: 'morning',
          dose: 'As prescribed',
          timeLabel: 'Morning',
          takenOn: [],
        },
        {
          id: 'med-default-2',
          name: 'Evening Rx',
          category: 'evening',
          dose: 'As prescribed',
          timeLabel: 'Evening',
          takenOn: [],
        },
      ],
      workNotes: '',
      personalNotes: '',
      addMed: (name, category, dose, timeLabel) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => ({
          meds: [
            ...state.meds,
            {
              id: `med-${Date.now()}`,
              name: trimmed,
              category,
              dose: dose?.trim() || undefined,
              timeLabel: timeLabel?.trim() || undefined,
              takenOn: [],
            },
          ],
        }));
      },
      removeMed: (id) =>
        set((state) => ({ meds: state.meds.filter((m) => m.id !== id) })),
      toggleMedTaken: (id, date = todayKey()) =>
        set((state) => ({
          meds: state.meds.map((med) => {
            if (med.id !== id) return med;
            const taken = med.takenOn.includes(date);
            return {
              ...med,
              takenOn: taken
                ? med.takenOn.filter((d) => d !== date)
                : [...med.takenOn, date],
            };
          }),
        })),
      isMedTakenToday: (id, date = todayKey()) => {
        const med = get().meds.find((m) => m.id === id);
        return Boolean(med?.takenOn.includes(date));
      },
      setWorkNotes: (value) => set({ workNotes: value }),
      setPersonalNotes: (value) => set({ personalNotes: value }),
    }),
    {
      name: 'fitlife-notes-meds',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted, version) => {
        const state = persisted as {
          meds?: LegacyMedItem[];
          workNotes?: string;
          personalNotes?: string;
        };
        if (!state?.meds) return persisted as NotesState;
        if (version === 0) {
          return {
            ...state,
            meds: state.meds.map(normalizeMed),
          };
        }
        return {
          ...state,
          meds: state.meds.map(normalizeMed),
        };
      },
    },
  ),
);
