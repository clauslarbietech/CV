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
  type UserPreferences,
} from "../services/userPreferences";
import { LARGE_TEXT_SCALE, withHighContrast } from "./a11y";
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
  largerText: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  /** Multiply base font sizes (Settings → Larger text). */
  textScale: number;
  colors: AppPalette;
  setNightMode: (nightMode: boolean) => void;
  setLargerText: (largerText: boolean) => void;
  setReduceMotion: (reduceMotion: boolean) => void;
  setHighContrast: (highContrast: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  ready: false,
  nightMode: true,
  largerText: false,
  reduceMotion: false,
  highContrast: false,
  textScale: 1,
  colors: darkPalette,
  setNightMode: () => undefined,
  setLargerText: () => undefined,
  setReduceMotion: () => undefined,
  setHighContrast: () => undefined,
});

export function useTheme() {
  return useContext(ThemeContext);
}

/** Reader / inline style palette that follows night mode and contrast prefs. */
export function useReaderColors() {
  const { colors } = useTheme();
  return useMemo(() => toReaderColors(colors), [colors]);
}

type Props = {
  children: ReactNode;
};

function resolveColors(nightMode: boolean, highContrast: boolean): AppPalette {
  const base = paletteFor(nightMode);
  return highContrast ? withHighContrast(base, nightMode) : base;
}

export function ThemeProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [nightMode, setNightModeState] = useState(true);
  const [largerText, setLargerTextState] = useState(false);
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [highContrast, setHighContrastState] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadPreferences().then((prefs) => {
      if (!cancelled) {
        setNightModeState(prefs.nightMode);
        setLargerTextState(prefs.largerText);
        setReduceMotionState(prefs.reduceMotion);
        setHighContrastState(prefs.highContrast);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const colors = useMemo(
    () => resolveColors(nightMode, highContrast),
    [nightMode, highContrast]
  );

  const textScale = largerText ? LARGE_TEXT_SCALE : 1;

  const persist = useCallback((patch: Partial<UserPreferences>) => {
    void savePreferences(patch);
  }, []);

  const setNightMode = useCallback(
    (next: boolean) => {
      setNightModeState(next);
      persist({ nightMode: next });
    },
    [persist]
  );

  const setLargerText = useCallback(
    (next: boolean) => {
      setLargerTextState(next);
      persist({ largerText: next });
    },
    [persist]
  );

  const setReduceMotion = useCallback(
    (next: boolean) => {
      setReduceMotionState(next);
      persist({ reduceMotion: next });
    },
    [persist]
  );

  const setHighContrast = useCallback(
    (next: boolean) => {
      setHighContrastState(next);
      persist({ highContrast: next });
    },
    [persist]
  );

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
    root.classList.toggle("reduce-motion", reduceMotion);
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("large-text", largerText);
  }, [colors, nightMode, reduceMotion, highContrast, largerText]);

  const value = useMemo(
    () => ({
      ready,
      nightMode,
      largerText,
      reduceMotion,
      highContrast,
      textScale,
      colors,
      setNightMode,
      setLargerText,
      setReduceMotion,
      setHighContrast,
    }),
    [
      ready,
      nightMode,
      largerText,
      reduceMotion,
      highContrast,
      textScale,
      colors,
      setNightMode,
      setLargerText,
      setReduceMotion,
      setHighContrast,
    ]
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
