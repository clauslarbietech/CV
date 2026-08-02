import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookScreen from "../screens/BookScreen";
import ChapterPlayerScreen from "../screens/ChapterPlayerScreen";
import HomeScreen from "../screens/HomeScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Book" component={BookScreen} />
        <Stack.Screen name="ChapterPlayer" component={ChapterPlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
