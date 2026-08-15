import "./global.css";

import { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashIntro from "./src/components/intro/SplashIntro";
import ReaderScreen from "./src/screens/ReaderScreen";

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={introDone ? "dark" : "light"} />
        {introDone ? (
          <ReaderScreen />
        ) : (
          <SplashIntro onDone={finishIntro} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
