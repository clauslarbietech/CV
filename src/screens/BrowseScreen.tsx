import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BOOKS, JOURNEYS } from "../data/library";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function BrowseScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const journeyCard = Math.min(148, width * 0.38);
  const bookCard = Math.min(160, width * 0.42);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-8 pt-2">
          <View className="mb-6 items-center">
            <Text className="text-2xl font-bold lowercase text-terracotta">
              anime audio bible
            </Text>
            <Text className="mt-1 text-center text-sm text-parchment-ink/60">
              Free Bible stories with comics + audio — made for families
            </Text>

            {/* One clear primary start action */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Bible reader at Genesis Day 1"
              className="mt-5 w-full max-w-sm flex-row items-center justify-center rounded-full bg-terracotta px-5 py-3.5"
              onPress={() => navigation.navigate("Bible")}
            >
              <MaterialIcons name="menu-book" size={22} color="#FFFFFF" />
              <Text className="ml-1 text-sm font-bold text-white">
                Open Bible · comics + scripture
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityHint="Opens the full Genesis chapter list"
              className="mt-3 flex-row items-center"
              onPress={() => navigation.navigate("Book", { bookId: "genesis" })}
            >
              <Text className="text-sm font-semibold text-teal-deep">
                Browse all Genesis chapters
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#1E3A6E" />
            </Pressable>
          </View>

          <SectionHeader
            title="Continue the story"
            onSeeAll={() => navigation.navigate("Book", { bookId: "genesis" })}
          />
          <View className="mb-6 gap-2">
            <QuickStoryCard
              title="Day 1 · Let There Be Light"
              subtitle="Creation begins · listen along"
              icon="wb-sunny"
              onPress={() =>
                navigation.navigate("WebtoonEpisode", {
                  bookId: "genesis",
                  chapterNumber: 1,
                  storylineId: "day-1",
                })
              }
            />
            <QuickStoryCard
              title="Eve from Adam’s side"
              subtitle="Garden story · hear every word"
              icon="park"
              onPress={() =>
                navigation.navigate("WebtoonEpisode", {
                  bookId: "genesis",
                  chapterNumber: 2,
                  storylineId: "eve-from-rib",
                })
              }
            />
            <QuickStoryCard
              title="The Fall"
              subtitle="Genesis 3 · trust breaks"
              icon="spa"
              onPress={() =>
                navigation.navigate("WebtoonEpisode", {
                  bookId: "genesis",
                  chapterNumber: 3,
                  storylineId: "the-fall",
                })
              }
            />
          </View>

          <SectionHeader
            title="Bible Journeys"
            onSeeAll={() => navigation.navigate("Plans")}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
            className="mb-6"
          >
            {JOURNEYS.map((journey, index) => (
              <Pressable
                key={journey.id}
                accessibilityRole="button"
                style={{ width: journeyCard }}
                onPress={() =>
                  navigation.navigate("Book", { bookId: journey.bookIds[0] })
                }
              >
                <View className="overflow-hidden rounded-2xl bg-parchment">
                  <Image
                    source={journey.cover}
                    style={{ width: journeyCard, height: journeyCard }}
                    resizeMode="cover"
                  />
                  {index === 0 ? (
                    <View className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-white">
                      <MaterialIcons name="check" size={16} color="#15233F" />
                    </View>
                  ) : null}
                </View>
                <Text
                  className="mt-2 text-sm font-semibold text-parchment-ink"
                  numberOfLines={2}
                >
                  {journey.title}
                </Text>
                <Text className="text-[11px] text-parchment-ink/55" numberOfLines={1}>
                  {journey.booksLabel}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <SectionHeader title="Bible Books" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
            className="mb-6"
          >
            <Pressable
              accessibilityRole="button"
              style={{ width: bookCard }}
              className="overflow-hidden rounded-2xl bg-teal-deep"
              onPress={() => navigation.navigate("Book", { bookId: "genesis" })}
            >
              <Image
                source={BOOKS[0].cover}
                style={{ width: bookCard, height: bookCard, opacity: 0.35 }}
                resizeMode="cover"
              />
              <View className="absolute inset-0 items-center justify-center px-3">
                <Text className="text-center text-xl font-bold text-white">
                  Old{"\n"}Testament
                </Text>
                <Text className="mt-1 text-center text-[11px] text-white/75">
                  Genesis ready
                </Text>
              </View>
            </Pressable>
            <View
              style={{ width: bookCard }}
              className="items-center justify-center overflow-hidden rounded-2xl bg-parchment"
            >
              <MaterialIcons name="schedule" size={28} color="#9AA0A6" />
              <Text className="mt-2 text-center text-base font-bold text-parchment-ink/55">
                New Testament
              </Text>
              <Text className="mt-1 text-xs text-parchment-ink/40">Coming later</Text>
            </View>
          </ScrollView>

          <SectionHeader title="Featured book" />
          <Pressable
            accessibilityRole="button"
            className="mb-2 flex-row overflow-hidden rounded-2xl border border-teal-deep/10 bg-parchment"
            onPress={() => navigation.navigate("Book", { bookId: "genesis" })}
          >
            <Image
              source={BOOKS[0].cover}
              style={{ width: 96, height: 96 }}
              resizeMode="cover"
            />
            <View className="flex-1 justify-center px-3 py-2">
              <Text className="text-xs font-bold uppercase tracking-wide text-terracotta">
                Start the Bible here
              </Text>
              <Text className="text-lg font-bold text-teal-ink">Genesis</Text>
              <Text className="mt-1 text-xs text-parchment-ink/65" numberOfLines={2}>
                50 chapters · comics, ESV audio, and storylines
              </Text>
            </View>
            <View className="justify-center pr-3">
              <MaterialIcons name="chevron-right" size={28} color="#E4572E" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickStoryCard({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center rounded-2xl border border-teal-deep/10 bg-parchment px-3 py-3 active:bg-parchment-warm"
    >
      <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-teal-mist">
        <MaterialIcons name={icon} size={22} color="#1E3A6E" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-teal-ink">{title}</Text>
        <Text className="mt-0.5 text-xs text-parchment-ink/60">{subtitle}</Text>
      </View>
      <MaterialIcons name="volume-up" size={22} color="#E4572E" />
    </Pressable>
  );
}

function SectionHeader({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="text-lg font-bold text-parchment-ink">{title}</Text>
      {onSeeAll ? (
        <Pressable
          accessibilityRole="button"
          onPress={onSeeAll}
          className="rounded-full bg-parchment px-3 py-1"
        >
          <Text className="text-xs font-semibold text-parchment-ink/70">
            See all
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
