import "./global.css";

import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
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

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
