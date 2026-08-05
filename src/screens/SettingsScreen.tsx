import { useCallback, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppTabBar from "../components/navigation/AppTabBar";
import type { RootStackParamList } from "../navigation/types";
import {
  loadPreferences,
  savePreferences,
  type UserPreferences,
} from "../services/userPreferences";
import { useTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

function SettingRow({
  label,
  hint,
  value,
  onChange,
  trackOff,
  thumb,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (next: boolean) => void;
  trackOff: string;
  thumb: string;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-2xl border border-night-border bg-night-card px-4 py-3">
      <View className="flex-1 pr-3">
        <Text className="text-base font-bold text-night-text">{label}</Text>
        <Text className="mt-0.5 text-xs text-night-muted">{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: trackOff, true: "#E4572E" }}
        thumbColor={thumb}
      />
    </View>
  );
}

export default function SettingsScreen({ navigation }: Props) {
  const { nightMode, setNightMode, colors } = useTheme();
  const [prefs, setPrefs] = useState<UserPreferences>({
    nightMode: true,
    largerText: false,
    reduceMotion: false,
    highContrast: false,
  });

  useFocusEffect(
    useCallback(() => {
      void loadPreferences().then(setPrefs);
    }, [])
  );

  const update = (patch: Partial<UserPreferences>) => {
    if (typeof patch.nightMode === "boolean") {
      setNightMode(patch.nightMode);
      setPrefs((prev) => ({ ...prev, nightMode: patch.nightMode! }));
      return;
    }
    void savePreferences(patch).then(setPrefs);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-night-bg"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: colors.bg }}
    >
      <View className="flex-1">
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
          >
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text className="text-xl font-bold text-night-text">Settings</Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-terracotta">
            Display
          </Text>
          <SettingRow
            label="Night mode"
            hint="On = dark charcoal screens. Off = white background and light surfaces."
            value={nightMode}
            onChange={(next) => update({ nightMode: next })}
            trackOff={colors.border}
            thumb={colors.text}
          />

          <Text className="mb-2 mt-4 text-xs font-bold uppercase tracking-[2px] text-terracotta">
            Accessibility
          </Text>
          <SettingRow
            label="Larger text"
            hint="Prefer bigger type in readers when available."
            value={prefs.largerText}
            onChange={(largerText) => update({ largerText })}
            trackOff={colors.border}
            thumb={colors.text}
          />
          <SettingRow
            label="Reduce motion"
            hint="Ease Ken-Burns and decorative animation."
            value={prefs.reduceMotion}
            onChange={(reduceMotion) => update({ reduceMotion })}
            trackOff={colors.border}
            thumb={colors.text}
          />
          <SettingRow
            label="High contrast"
            hint="Stronger borders and text contrast."
            value={prefs.highContrast}
            onChange={(highContrast) => update({ highContrast })}
            trackOff={colors.border}
            thumb={colors.text}
          />

          <Pressable
            accessibilityRole="button"
            className="mt-4 flex-row items-center rounded-2xl border border-night-border bg-night-card px-4 py-4"
            onPress={() => navigation.navigate("Profile")}
          >
            <MaterialIcons name="person" size={22} color={colors.highlight} />
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-night-text">Profile</Text>
              <Text className="text-xs text-night-muted">
                Name and email for your portfolio
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.soft} />
          </Pressable>
        </ScrollView>

        <AppTabBar activeTab="More" />
      </View>
    </SafeAreaView>
  );
}
