import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import BrandWordmark from "../components/brand/BrandWordmark";
import { BRAND } from "../content/brand";
import { useTheme } from "../theme/ThemeProvider";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "More">,
  NativeStackScreenProps<RootStackParamList>
>;

type MenuLinkRoute = "Settings" | "About" | "Favorites" | "Profile";

const PRIMARY_LINKS: {
  id: string;
  label: string;
  hint: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: MenuLinkRoute;
}[] = [
  {
    id: "settings",
    label: "Settings",
    hint: "Night mode and accessibility",
    icon: "settings",
    route: "Settings",
  },
  {
    id: "about",
    label: "About · mission & why it's free",
    hint: "Our story and why The Picture Bible is free",
    icon: "info-outline",
    route: "About",
  },
];

const SECONDARY_LINKS: {
  id: string;
  label: string;
  hint: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: MenuLinkRoute;
}[] = [
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
];

export default function MoreScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const renderLink = (item: (typeof PRIMARY_LINKS)[number]) => (
    <Pressable
      key={item.id}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      className="mb-3 flex-row items-center rounded-2xl px-4 py-4"
      style={{ backgroundColor: colors.card }}
      onPress={() => navigation.navigate(item.route)}
    >
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.elevated }}
      >
        <MaterialIcons name={item.icon} size={22} color={colors.accent} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold" style={{ color: colors.text }}>
          {item.label}
        </Text>
        <Text className="text-xs font-medium" style={{ color: colors.muted }}>
          {item.hint}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.soft} />
    </Pressable>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="mb-2 flex-row items-center">
          <MaterialIcons name="menu" size={24} color={colors.accent} />
          <Text
            className="ml-2 text-xl font-bold"
            style={{ color: colors.text }}
          >
            Menu
          </Text>
        </View>
        <BrandWordmark size="sm" centered={false} />
        <Text
          className="mb-6 mt-1 text-sm font-semibold"
          style={{ color: colors.brand }}
        >
          {BRAND.tagline}
        </Text>

        <Text
          className="mb-2 text-xs font-bold uppercase tracking-wider"
          style={{ color: colors.soft }}
        >
          Settings & About
        </Text>
        {PRIMARY_LINKS.map(renderLink)}

        <Text
          className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider"
          style={{ color: colors.soft }}
        >
          Your library
        </Text>
        {SECONDARY_LINKS.map(renderLink)}
      </ScrollView>
    </SafeAreaView>
  );
}
