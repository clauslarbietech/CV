import "./global.css";

import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#111827" }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {/* Mobile-first draft: phone frame on web; native fills the device. */}
        <View
          style={
            Platform.OS === "web"
              ? {
                  flex: 1,
                  maxWidth: 430,
                  width: "100%",
                  alignSelf: "center",
                  backgroundColor: "#FFFFFF",
                  overflow: "hidden",
                }
              : { flex: 1, backgroundColor: "#FFFFFF" }
          }
        >
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
