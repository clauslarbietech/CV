import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AnimationDemoScreen from "../screens/AnimationDemoScreen";
import BibleReaderScreen from "../screens/BibleReaderScreen";
import BookScreen from "../screens/BookScreen";
import BrowseScreen from "../screens/BrowseScreen";
import ChapterPlayerScreen from "../screens/ChapterPlayerScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import { useBottomMenuInset } from "../hooks/useBottomMenuInset";
import MoreScreen from "../screens/MoreScreen";
import MyPlansScreen from "../screens/MyPlansScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WebtoonEpisodeScreen from "../screens/WebtoonEpisodeScreen";
import type { MainTabParamList, RootStackParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<
  keyof MainTabParamList,
  keyof typeof MaterialIcons.glyphMap
> = {
  Home: "home",
  Bible: "menu-book",
  Plans: "checklist",
  More: "person-outline",
};

const TAB_CONTENT_HEIGHT = 52;

function MainTabs() {
  const bottomInset = useBottomMenuInset();

  return (
    <Tab.Navigator
      initialRouteName="Bible"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#E4572E",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        // We apply bottom inset ourselves (incl. mobile browser chrome on web).
        safeAreaInsets: { bottom: 0 },
        tabBarStyle: {
          backgroundColor: "#121212",
          borderTopColor: "#2C2C2E",
          height: TAB_CONTENT_HEIGHT + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          position: "relative",
          elevation: 0,
        },
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons
            name={TAB_ICONS[route.name]}
            size={focused ? size + 2 : size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={BrowseScreen} />
      <Tab.Screen name="Bible" component={BibleReaderScreen} />
      <Tab.Screen
        name="Plans"
        component={MyPlansScreen}
        options={{ title: "Plans" }}
      />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#121212" },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Book" component={BookScreen} />
        <Stack.Screen name="ChapterPlayer" component={ChapterPlayerScreen} />
        <Stack.Screen name="WebtoonEpisode" component={WebtoonEpisodeScreen} />
        <Stack.Screen name="AnimationDemo" component={AnimationDemoScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
