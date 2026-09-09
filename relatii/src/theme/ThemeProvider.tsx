import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import {
  ThemeColors,
  ThemeMode,
  ThemePreference,
  colorsForMode,
  nightColors,
} from '@/theme/colors';
import { useThemeStore } from '@/store/themeStore';

type ThemeContextValue = {
  preference: ThemePreference;
  mode: ThemeMode;
  colors: ThemeColors;
  isDay: boolean;
  setPreference: (preference: ThemePreference) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  mode: 'night',
  colors: nightColors,
  isDay: false,
  setPreference: () => undefined,
  toggleMode: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const system = useColorScheme();

  const mode: ThemeMode =
    preference === 'system' ? (system === 'light' ? 'day' : 'night') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      mode,
      colors: colorsForMode(mode),
      isDay: mode === 'day',
      setPreference,
      toggleMode: () =>
        setPreference(mode === 'day' ? 'night' : 'day'),
    }),
    [preference, mode, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
