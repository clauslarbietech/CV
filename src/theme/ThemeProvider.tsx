import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Platform, View } from "react-native";
import { vars } from "nativewind";
import { StatusBar } from "expo-status-bar";
import {
  loadPreferences,
  savePreferences,
} from "../services/userPreferences";
import {
  darkPalette,
  paletteFor,
  themeCssVars,
  type AppPalette,
} from "./palettes";
import { toReaderColors } from "./readerColors";

type ThemeContextValue = {
  ready: boolean;
  nightMode: boolean;
  colors: AppPalette;
  setNightMode: (nightMode: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  ready: false,
  nightMode: true,
  colors: darkPalette,
  setNightMode: () => undefined,
});

export function useTheme() {
  return useContext(ThemeContext);
}

/** Reader / inline style palette that follows night mode. */
export function useReaderColors() {
  const { colors } = useTheme();
  return useMemo(() => toReaderColors(colors), [colors]);
}

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [nightMode, setNightModeState] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void loadPreferences().then((prefs) => {
      if (!cancelled) {
        setNightModeState(prefs.nightMode);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const colors = useMemo(() => paletteFor(nightMode), [nightMode]);

  const setNightMode = useCallback((next: boolean) => {
    setNightModeState(next);
    void savePreferences({ nightMode: next });
  }, []);

  const cssVars = useMemo(() => vars(themeCssVars(colors)), [colors]);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      return;
    }
    const root = document.documentElement;
    const entries = themeCssVars(colors);
    for (const [key, value] of Object.entries(entries)) {
      root.style.setProperty(key, value);
    }
    document.body.style.backgroundColor = colors.bg;
    root.style.backgroundColor = colors.bg;
    root.style.colorScheme = nightMode ? "dark" : "light";
  }, [colors, nightMode]);

  const value = useMemo(
    () => ({ ready, nightMode, colors, setNightMode }),
    [ready, nightMode, colors, setNightMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1, backgroundColor: colors.bg }, cssVars]}>
        <StatusBar style={nightMode ? "light" : "dark"} />
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
