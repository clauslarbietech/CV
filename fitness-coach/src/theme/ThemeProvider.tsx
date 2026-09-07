import { createContext, useContext, useMemo, type ReactNode } from 'react';

import {
  ThemeColors,
  ThemeMode,
  colorsForMode,
  nightColors,
} from '@/theme/colors';
import { useThemeStore } from '@/store/themeStore';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDay: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'night',
  colors: nightColors,
  isDay: false,
  setMode: () => undefined,
  toggleMode: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const toggleMode = useThemeStore((s) => s.toggleMode);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: colorsForMode(mode),
      isDay: mode === 'day',
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
