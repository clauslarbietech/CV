import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BOOKS, JOURNEYS } from "../data/library";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Browse">,
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
          <View className="mb-5 items-center">
            <Text className="text-xl font-bold lowercase text-terracotta">
              anime audio bible
            </Text>
            <Text className="mt-1 text-xs text-parchment-ink/55">
              Free forever · comics + narration
            </Text>
            <Pressable
              accessibilityRole="button"
              className="mt-3 rounded-full bg-terracotta px-4 py-2"
              onPress={() =>
                navigation.navigate("WebtoonEpisode", {
                  bookId: "genesis",
                  chapterNumber: 3,
                })
              }
            >
              <Text className="text-xs font-bold text-white">
                Read Genesis 3 webtoon episode →
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="mt-2 rounded-full bg-teal-ink px-4 py-2"
              onPress={() => navigation.navigate("AnimationDemo")}
            >
              <Text className="text-xs font-bold text-white">
                Watch Fall animation demo →
              </Text>
            </Pressable>
          </View>

          <SectionHeader
            title="Bible Journeys"
            onSeeAll={() => navigation.navigate("MyPlans")}
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
                      <Text className="text-xs font-bold text-teal-ink">✓</Text>
                    </View>
                  ) : (
                    <View className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5">
                      <Text className="text-[10px] font-bold text-white">0%</Text>
                    </View>
                  )}
                </View>
                <Text className="mt-2 text-sm font-semibold text-parchment-ink">
                  {journey.number} | {journey.title}
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
              </View>
            </Pressable>
            <View
              style={{ width: bookCard }}
              className="items-center justify-center overflow-hidden rounded-2xl bg-terracotta"
            >
              <Text className="text-center text-xl font-bold text-white">
                New{"\n"}Testament
              </Text>
              <Text className="mt-2 text-xs text-white/80">Coming soon</Text>
            </View>
          </ScrollView>

          <SectionHeader title="New and Updated" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {BOOKS.map((book) => (
              <Pressable
                key={book.id}
                accessibilityRole="button"
                style={{ width: journeyCard }}
                onPress={() => navigation.navigate("Book", { bookId: book.id })}
              >
                <View className="overflow-hidden rounded-2xl">
                  <Image
                    source={book.cover}
                    style={{ width: journeyCard, height: journeyCard }}
                    resizeMode="cover"
                  />
                  <View className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5">
                    <Text className="text-[10px] font-bold text-white">New</Text>
                  </View>
                </View>
                <Text className="mt-2 text-sm font-semibold text-parchment-ink">
                  {book.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
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
      <Text className="text-xl font-bold text-parchment-ink">{title}</Text>
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
