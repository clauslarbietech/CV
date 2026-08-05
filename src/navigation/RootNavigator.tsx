import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AboutScreen from "../screens/AboutScreen";
import AnimationDemoScreen from "../screens/AnimationDemoScreen";
import BibleReaderScreen from "../screens/BibleReaderScreen";
import BookScreen from "../screens/BookScreen";
import BrowseScreen from "../screens/BrowseScreen";
import ChapterPlayerScreen from "../screens/ChapterPlayerScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import { useBottomMenuInset } from "../hooks/useBottomMenuInset";
import { MIN_TOUCH_TARGET } from "../theme/a11y";
import JourneyDetailScreen from "../screens/JourneyDetailScreen";
import MoreScreen from "../screens/MoreScreen";
import MyPlansScreen from "../screens/MyPlansScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WebtoonEpisodeScreen from "../screens/WebtoonEpisodeScreen";
import { useTheme } from "../theme/ThemeProvider";
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

const TAB_CONTENT_HEIGHT = 56;

function MainTabs() {
  const bottomInset = useBottomMenuInset();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Bible"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.soft,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarItemStyle: { minHeight: MIN_TOUCH_TARGET },
        // We apply bottom inset ourselves (incl. mobile browser chrome on web).
        safeAreaInsets: { bottom: 0 },
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
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
  const { colors, nightMode } = useTheme();

  const navTheme = {
    ...DefaultTheme,
    dark: nightMode,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.accent,
      background: colors.bg,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Book" component={BookScreen} />
        <Stack.Screen name="JourneyDetail" component={JourneyDetailScreen} />
        <Stack.Screen name="ChapterPlayer" component={ChapterPlayerScreen} />
        <Stack.Screen name="WebtoonEpisode" component={WebtoonEpisodeScreen} />
        <Stack.Screen name="AnimationDemo" component={AnimationDemoScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
