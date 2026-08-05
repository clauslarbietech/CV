import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import BrandWordmark from "../components/brand/BrandWordmark";
import { BRAND } from "../content/brand";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "More">,
  NativeStackScreenProps<RootStackParamList>
>;

type MoreLinkRoute = "Favorites" | "Profile" | "Settings" | "About";

const LINKS: {
  id: string;
  label: string;
  hint: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: MoreLinkRoute;
}[] = [
  {
    id: "about",
    label: "About The Picture Bible",
    hint: "Mission, our story, and why it's free",
    icon: "auto-stories",
    route: "About",
  },
  {
    id: "favorites",
    label: "Favorites",
    hint: "Chapters, stories, and highlights",
    icon: "star",
    route: "Favorites",
  },
  {
    id: "profile",
    label: "Profile",
    hint: "Name and email",
    icon: "person",
    route: "Profile",
  },
  {
    id: "settings",
    label: "Settings",
    hint: "Night mode and accessibility",
    icon: "settings",
    route: "Settings",
  },
];

export default function MoreScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <BrandWordmark size="sm" centered={false} />
        <Text className="mb-6 mt-1 text-sm font-semibold text-terracotta">
          {BRAND.tagline}
        </Text>

        {LINKS.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            className="mb-3 flex-row items-center rounded-2xl bg-night-card px-4 py-4"
            onPress={() => {
              if (item.route) {
                navigation.navigate(item.route);
              }
            }}
          >
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-night-elevated">
              <MaterialIcons name={item.icon} size={22} color="#E4572E" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-night-text">
                {item.label}
              </Text>
              <Text className="text-xs font-medium text-night-muted">
                {item.hint}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#3A3A3C" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
