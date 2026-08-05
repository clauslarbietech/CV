import "./global.css";

import { useState } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CoverAnimationScreen from "./src/components/brand/CoverAnimationScreen";
import RootNavigator from "./src/navigation/RootNavigator";
import { BRAND_COLORS } from "./src/content/brand";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

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
  return (
    <ThemeProvider>
      <AppGate />
    </ThemeProvider>
  );
}
