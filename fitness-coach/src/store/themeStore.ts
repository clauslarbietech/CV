import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ThemeMode, colorsForMode } from '@/theme/colors';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'night',
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === 'day' ? 'night' : 'day' }),
    }),
    {
      name: 'fitlife-theme',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useThemeColors() {
  const mode = useThemeStore((s) => s.mode);
  return colorsForMode(mode);
}

export function useIsDayMode() {
  return useThemeStore((s) => s.mode === 'day');
}
