import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AnimationDemoScreen from "../screens/AnimationDemoScreen";
import BookScreen from "../screens/BookScreen";
import BrowseScreen from "../screens/BrowseScreen";
import ChapterPlayerScreen from "../screens/ChapterPlayerScreen";
import GroupsScreen from "../screens/GroupsScreen";
import MoreScreen from "../screens/MoreScreen";
import MyPlansScreen from "../screens/MyPlansScreen";
import WebtoonEpisodeScreen from "../screens/WebtoonEpisodeScreen";
import type { MainTabParamList, RootStackParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<
  keyof MainTabParamList,
  keyof typeof MaterialIcons.glyphMap
> = {
  Browse: "explore",
  MyPlans: "menu-book",
  Groups: "groups",
  More: "more-horiz",
};

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Browse"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#E4572E",
        tabBarInactiveTintColor: "#9AA0A6",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EEF0F3",
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
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
      <Tab.Screen
        name="MyPlans"
        component={MyPlansScreen}
        options={{ title: "My Plans" }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{ title: "Groups" }}
      />
      <Tab.Screen name="Browse" component={BrowseScreen} />
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
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Book" component={BookScreen} />
        <Stack.Screen name="ChapterPlayer" component={ChapterPlayerScreen} />
        <Stack.Screen name="WebtoonEpisode" component={WebtoonEpisodeScreen} />
        <Stack.Screen name="AnimationDemo" component={AnimationDemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
