import { ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppTabBar from "../components/navigation/AppTabBar";
import BrandWordmark from "../components/brand/BrandWordmark";
import { BRAND } from "../content/brand";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

export default function AboutScreen({ navigation }: Props) {
  return (
    <SafeAreaView
      className="flex-1 bg-night-bg"
      edges={["top", "left", "right"]}
    >
      <View className="flex-1">
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
          >
            <MaterialIcons name="arrow-back" size={20} color="#F2F2F7" />
          </Pressable>
          <Text className="text-xl font-bold text-night-text">About</Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6 items-center rounded-2xl border border-night-border bg-night-card px-5 py-6">
            <BrandWordmark size="lg" />
            <Text className="mt-3 text-center text-base font-semibold text-ochre-soft">
              {BRAND.tagline}
            </Text>
            <Text className="mt-4 text-center text-[15px] leading-6 text-night-text">
              {BRAND.description}
            </Text>
          </View>

          <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-terracotta">
            Mission
          </Text>
          <Text className="mb-1 text-sm font-semibold text-night-text">
            {BRAND.mission}
          </Text>
          <Text className="mb-6 text-[15px] leading-6 text-night-muted">
            {BRAND.missionDetail}
          </Text>

          <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-terracotta">
            {BRAND.whyTitle}
          </Text>
          <Text className="mb-6 text-[15px] leading-6 text-night-muted">
            {BRAND.whyBody}
          </Text>

          <Text className="mb-3 text-xs font-bold uppercase tracking-[2px] text-terracotta">
            What we stand for
          </Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
            {BRAND.personality.map((trait) => (
              <View
                key={trait}
                className="rounded-full border border-night-border bg-night-elevated px-3 py-1.5"
              >
                <Text className="text-xs font-semibold text-night-text">
                  {trait}
                </Text>
              </View>
            ))}
          </View>

          <View className="rounded-2xl border border-night-border bg-parchment/10 px-4 py-4">
            <Text className="text-xs font-bold uppercase tracking-[1.5px] text-ochre">
              Scripture first
            </Text>
            <Text className="mt-2 text-sm leading-6 text-night-muted">
              Art illustrates the text; the Bible remains the message. Every
              chapter pairs faithful ESV wording with illustrations that help you
              see the story—not replace it.
            </Text>
          </View>
        </ScrollView>

        <AppTabBar activeTab="More" />
      </View>
    </SafeAreaView>
  );
}
