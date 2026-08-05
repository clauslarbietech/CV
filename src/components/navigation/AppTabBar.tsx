import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomMenuInset } from "../../hooks/useBottomMenuInset";
import type { MainTabParamList, RootStackParamList } from "../../navigation/types";
import { useTheme } from "../../theme/ThemeProvider";

type TabName = keyof MainTabParamList;

const TABS: {
  name: TabName;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { name: "Home", label: "Home", icon: "home" },
  { name: "Bible", label: "Bible", icon: "menu-book" },
  { name: "Plans", label: "Plans", icon: "checklist" },
  { name: "More", label: "More", icon: "person-outline" },
];

type Props = {
  /** Highlight which tab feels “current” when on a nested stack page. */
  activeTab?: TabName;
};

/**
 * Same bottom menu as MainTabs — shown on Book / Chapter / Webtoon
 * so users can always jump Home, Bible, Plans, or More.
 */
export default function AppTabBar({ activeTab }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const bottomInset = useBottomMenuInset();
  const { colors } = useTheme();

  return (
    <View
      className="flex-row border-t border-night-border bg-night-bg pt-1.5"
      style={{
        paddingBottom: bottomInset,
        backgroundColor: colors.bg,
        borderTopColor: colors.border,
      }}
    >
      {TABS.map((tab) => {
        const focused = activeTab === tab.name;
        const color = focused ? colors.accent : colors.soft;
        return (
          <Pressable
            key={tab.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            className="flex-1 items-center py-1"
            onPress={() =>
              navigation.navigate("MainTabs", { screen: tab.name })
            }
          >
            <MaterialIcons
              name={tab.icon}
              size={focused ? 26 : 24}
              color={color}
            />
            <Text
              className="mt-0.5 text-[11px] font-semibold"
              style={{ color }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
