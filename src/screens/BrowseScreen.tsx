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
import BrandWordmark from "../components/brand/BrandWordmark";
import { BRAND } from "../content/brand";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import { inviteToJourney } from "../services/journeyInvite";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function BrowseScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const journeyCard = Math.min(148, width * 0.38);
  const bookCard = Math.min(160, width * 0.42);

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-8 pt-2">
          <View className="mb-6 items-center">
            <BrandWordmark size="lg" />
            <Text className="mt-2 text-center text-sm font-semibold text-ochre-soft">
              {BRAND.tagline}
            </Text>
            <Text className="mt-2 text-center text-sm text-night-muted">
              {BRAND.homeSubtitle}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="About PixBible — mission, story, and why it is free"
              className="mt-3 flex-row items-center rounded-full border border-night-border bg-night-card px-4 py-2"
              onPress={() => navigation.navigate("About")}
            >
              <MaterialIcons name="info-outline" size={16} color="#F0D78C" />
              <Text className="ml-2 text-xs font-semibold text-ochre-soft">
                About · mission & why it's free
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityHint="Opens the full Genesis chapter list"
              className="mt-3 flex-row items-center"
              onPress={() =>
                navigation.navigate("Book", {
                  bookId: "genesis",
                  chapterNumber: 1,
                })
              }
            >
              <Text className="text-sm font-semibold text-ochre-soft">
                Browse all Genesis chapters
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#F0D78C" />
            </Pressable>
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
              <View key={journey.id} style={{ width: journeyCard }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${journey.title} at chapter ${journey.startChapter}`}
                  onPress={() => {
                    navigation.navigate("JourneyDetail", {
                      journeyId: journey.id,
                    });
                  }}
                >
                  <View className="overflow-hidden rounded-2xl bg-night-card">
                    <Image
                      source={journey.cover}
                      style={{ width: journeyCard, height: journeyCard }}
                      resizeMode="cover"
                    />
                    {index === 0 ? (
                      <View className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-terracotta">
                        <MaterialIcons name="check" size={16} color="#FFFFFF" />
                      </View>
                    ) : null}
                    <View className="absolute bottom-2 left-2 flex-row items-center rounded-full bg-black/55 px-2 py-1">
                      <MaterialIcons name="groups" size={12} color="#F0D78C" />
                      <Text className="ml-1 text-[10px] font-bold text-ochre-soft">
                        Together
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="mt-2 text-sm font-semibold text-night-text"
                    numberOfLines={2}
                  >
                    {journey.title} Together
                  </Text>
                  <Text
                    className="text-[11px] text-night-muted"
                    numberOfLines={1}
                  >
                    {journey.booksLabel}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Invite others to ${journey.title}`}
                  className="mt-2 flex-row items-center self-start rounded-full bg-terracotta/20 px-2.5 py-1.5"
                  onPress={() => {
                    void inviteToJourney({
                      journeyTitle: journey.title,
                      booksLabel: journey.booksLabel,
                      bookId: journey.bookIds[0],
                      chapterNumber: journey.startChapter,
                    });
                  }}
                >
                  <MaterialIcons name="person-add" size={14} color="#E4572E" />
                  <Text className="ml-1 text-[11px] font-bold text-terracotta">
                    Invite
                  </Text>
                </Pressable>
              </View>
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
              className="overflow-hidden rounded-2xl bg-night-elevated"
              onPress={() =>
                navigation.navigate("Book", {
                  bookId: "genesis",
                  chapterNumber: 1,
                })
              }
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
              className="items-center justify-center overflow-hidden rounded-2xl bg-night-card"
            >
              <MaterialIcons name="schedule" size={28} color="#8E8E93" />
              <Text className="mt-2 text-center text-base font-bold text-night-muted">
                New Testament
              </Text>
              <Text className="mt-1 text-xs text-night-soft">Coming later</Text>
            </View>
          </ScrollView>

          <SectionHeader title="Featured book" />
          <Pressable
            accessibilityRole="button"
            className="mb-6 flex-row overflow-hidden rounded-2xl border border-night-border bg-night-card"
            onPress={() =>
              navigation.navigate("Book", {
                bookId: "genesis",
                chapterNumber: 1,
              })
            }
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
              <Text className="text-lg font-bold text-night-text">Genesis</Text>
              <Text className="mt-1 text-xs text-night-muted" numberOfLines={2}>
                50 chapters · comics, ESV audio, and storylines
              </Text>
            </View>
            <View className="justify-center pr-3">
              <MaterialIcons name="chevron-right" size={28} color="#E4572E" />
            </View>
          </Pressable>

          <SectionHeader
            title="Continue the story"
            onSeeAll={() =>
              navigation.navigate("Book", {
                bookId: "genesis",
                chapterNumber: 1,
              })
            }
          />
          <View className="mb-2 gap-2">
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
            <QuickStoryCard
              title="Noah & the Flood"
              subtitle="Genesis 6–9 · ark and rainbow"
              icon="water"
              onPress={() =>
                navigation.navigate("WebtoonEpisode", {
                  bookId: "genesis",
                  chapterNumber: 6,
                  storylineId: "noah-ark",
                })
              }
            />
            <QuickStoryCard
              title="Abraham’s Call"
              subtitle="Genesis 12 · go to the land"
              icon="nights-stay"
              onPress={() =>
                navigation.navigate("WebtoonEpisode", {
                  bookId: "genesis",
                  chapterNumber: 12,
                  storylineId: "call-of-abraham",
                })
              }
            />
            <QuickStoryCard
              title="Joseph’s Coat"
              subtitle="Genesis 37 · toward Egypt"
              icon="style"
              onPress={() =>
                navigation.navigate("WebtoonEpisode", {
                  bookId: "genesis",
                  chapterNumber: 37,
                  storylineId: "joseph-coat",
                })
              }
            />
          </View>
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
      className="flex-row items-center rounded-2xl border border-night-border bg-night-card px-3 py-3 active:bg-night-elevated"
    >
      <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-night-elevated">
        <MaterialIcons name={icon} size={22} color="#F0D78C" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-night-text">{title}</Text>
        <Text className="mt-0.5 text-xs text-night-muted">{subtitle}</Text>
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
      <Text className="text-lg font-bold text-night-text">{title}</Text>
      {onSeeAll ? (
        <Pressable
          accessibilityRole="button"
          onPress={onSeeAll}
          className="rounded-full bg-night-elevated px-3 py-1"
        >
          <Text className="text-xs font-semibold text-night-muted">See all</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
