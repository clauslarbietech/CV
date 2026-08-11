import "./global.css";

import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CoverAnimationScreen from "./src/components/brand/CoverAnimationScreen";
import RootNavigator from "./src/navigation/RootNavigator";
import { BRAND_COLORS } from "./src/content/brand";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";
import { applyAppFonts } from "./src/theme/typography";

function ensureWebPoppinsStylesheet() {
  if (Platform.OS !== "web" || typeof document === "undefined") {
    return;
  }
  const id = "pixbible-poppins-font";
  if (document.getElementById(id)) {
    return;
  }
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

function AppShell() {
  const { colors } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        {/* Mobile-first draft: phone frame on web; native fills the device. */}
        <View
          style={
            Platform.OS === "web"
              ? {
                  flex: 1,
                  maxWidth: 430,
                  width: "100%",
                  alignSelf: "center",
                  backgroundColor: colors.bg,
                  overflow: "hidden",
                }
              : { flex: 1, backgroundColor: colors.bg }
          }
        >
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppGate() {
  const [coverDone, setCoverDone] = useState(false);
  const { ready } = useTheme();

  if (!coverDone) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CoverAnimationScreen onComplete={() => setCoverDone(true)} />
      </GestureHandlerRootView>
    );
  }

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BRAND_COLORS.navy,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  return <AppShell />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    ensureWebPoppinsStylesheet();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      applyAppFonts();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: BRAND_COLORS.navy,
        }}
      />
    );
  }

  return (
    <ThemeProvider>
      <AppGate />
    </ThemeProvider>
  );
}
