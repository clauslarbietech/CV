import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppTabBar from "../components/navigation/AppTabBar";
import { BRAND } from "../content/brand";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-terracotta">
      {children}
    </Text>
  );
}

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
          <Text className="text-xl font-bold text-night-text">
            About PixBible
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6 items-center rounded-2xl border border-night-border bg-night-card px-5 py-6">
            <View className="mb-4 items-center justify-center rounded-full bg-night-elevated p-3">
              <Image
                source={require("../../assets/brand/pixbible-logo-mark.png")}
                style={{ width: 88, height: 88 }}
                resizeMode="contain"
                accessibilityLabel="PixBible logo"
              />
            </View>
            <View className="items-center">
              <Text
                className="text-[28px] font-bold italic text-ochre"
                accessibilityLabel={BRAND.name}
              >
                {BRAND.namePix}
              </Text>
              <Text className="-mt-1 text-[28px] font-bold tracking-[3px] text-night-text">
                {BRAND.nameBible}
              </Text>
            </View>
            <Text className="mt-3 text-center text-base font-semibold text-ochre-soft">
              {BRAND.tagline}
            </Text>
            <Text className="mt-4 text-center text-[15px] leading-6 text-night-text">
              {BRAND.description}
            </Text>
          </View>

          <View className="mb-6 rounded-2xl border border-terracotta/30 bg-terracotta/10 px-4 py-4">
            <View className="mb-2 flex-row items-center">
              <MaterialIcons name="volunteer-activism" size={20} color="#E4572E" />
              <Text className="ml-2 text-sm font-bold text-terracotta">
                {BRAND.freeTitle}
              </Text>
            </View>
            <Text className="text-base font-bold leading-6 text-night-text">
              {BRAND.freeHeadline}
            </Text>
            <Text className="mt-2 text-[15px] leading-6 text-night-muted">
              {BRAND.freeBody}
            </Text>
          </View>

          <SectionTitle>Mission</SectionTitle>
          <Text className="mb-1 text-sm font-semibold text-night-text">
            {BRAND.mission}
          </Text>
          <Text className="mb-6 text-[15px] leading-6 text-night-muted">
            {BRAND.missionDetail}
          </Text>

          <SectionTitle>{BRAND.backstoryTitle}</SectionTitle>
          <Text className="mb-6 text-[15px] leading-6 text-night-muted">
            {BRAND.backstory}
          </Text>

          <SectionTitle>{BRAND.whyTitle}</SectionTitle>
          <Text className="mb-6 text-[15px] leading-6 text-night-muted">
            {BRAND.whyBody}
          </Text>

          <SectionTitle>What we stand for</SectionTitle>
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
              {BRAND.scriptureFirstTitle}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-night-muted">
              {BRAND.scriptureFirstBody}
            </Text>
          </View>
        </ScrollView>

        <AppTabBar activeTab="More" />
      </View>
    </SafeAreaView>
  );
}
