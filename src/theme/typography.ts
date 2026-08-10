import { Platform, Text, TextInput } from "react-native";

/**
 * Through the Word–matched UI typeface: Poppins (geometric sans).
 * Loaded via @expo-google-fonts/poppins in App.tsx.
 */
export const APP_FONT = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
} as const;

/** CSS stack for web (Google Fonts stylesheet + system fallbacks). */
export const APP_FONT_WEB =
  '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

type TextLike = typeof Text & {
  defaultProps?: { style?: object | object[] | null };
};

/**
 * Apply Poppins as the default Text / TextInput face app-wide
 * so NativeWind weight classes still read as the same family on web,
 * and named faces resolve on native.
 */
export function applyAppFonts() {
  const TextComp = Text as TextLike;
  const inputComp = TextInput as TextLike;

  const baseStyle =
    Platform.OS === "web"
      ? { fontFamily: APP_FONT_WEB }
      : { fontFamily: APP_FONT.regular };

  textComp.defaultProps = {
    ...(textComp.defaultProps ?? {}),
    style: [baseStyle, textComp.defaultProps?.style].flat().filter(Boolean),
  };
  inputComp.defaultProps = {
    ...(inputComp.defaultProps ?? {}),
    style: [baseStyle, inputComp.defaultProps?.style].flat().filter(Boolean),
  };
}

export function fontStyle(
  weight: keyof typeof APP_FONT = "regular"
): { fontFamily: string; fontWeight?: "400" | "500" | "600" | "700" } {
  if (Platform.OS === "web") {
    const map = {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    } as const;
    return { fontFamily: APP_FONT_WEB, fontWeight: map[weight] };
  }
  return { fontFamily: APP_FONT[weight] };
}
