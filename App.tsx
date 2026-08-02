import "./global.css";

import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ReaderScreen from "./src/screens/ReaderScreen";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <ReaderScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
