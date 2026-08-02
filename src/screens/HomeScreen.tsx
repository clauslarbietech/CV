import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BOOKS, FEATURED_BOOK_ID, JOURNEYS, getBook } from "../data/library";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(168, width * 0.42);
  const featured = getBook(FEATURED_BOOK_ID);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-10 pt-3">
          <View className="mb-6 flex-row items-center justify-between">
            <View className="rounded-md bg-teal-ink px-3 py-1.5">
              <Text className="text-sm font-bold text-white">
                anime audio bible
              </Text>
            </View>
            <Text className="text-xs font-semibold text-terracotta">
              Free forever
            </Text>
          </View>

          <Text className="mb-2 text-4xl font-bold leading-tight text-teal-ink">
            Press play.{"\n"}
            <Text className="bg-teal-deep text-white"> Meet the Bible.</Text>
          </Text>
          <Text className="mb-5 max-w-xl text-base leading-6 text-parchment-ink/75">
            Every chapter with anime comic visuals, synchronized narration, and
            a short audio guide — ten minutes a day.
          </Text>

          <Pressable
            accessibilityRole="button"
            className="mb-8 self-start rounded-full bg-terracotta px-6 py-3 active:bg-terracotta-dark"
            onPress={() =>
              navigation.navigate("ChapterPlayer", {
                bookId: "genesis",
                chapterNumber: 1,
              })
            }
          >
            <Text className="text-base font-bold text-white">Listen now →</Text>
          </Pressable>

          {featured ? (
            <Pressable
              accessibilityRole="button"
              className="mb-8 flex-row items-center rounded-2xl border border-teal-deep/10 bg-parchment px-4 py-4"
              onPress={() =>
                navigation.navigate("Book", { bookId: featured.id })
              }
            >
              <Image
                source={featured.cover}
                style={{ width: 64, height: 64, borderRadius: 12 }}
              />
              <View className="ml-3 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                  New launch
                </Text>
                <Text className="text-lg font-bold text-teal-ink">
                  {featured.name}
                </Text>
                <Text className="text-sm text-parchment-ink/70" numberOfLines={2}>
                  Anime comics + narration for every chapter
                </Text>
              </View>
              <Text className="ml-2 text-sm font-bold text-terracotta">
                Open
              </Text>
            </Pressable>
          ) : null}

          <View className="mb-3 flex-row items-end justify-between">
            <View>
              <Text className="text-2xl font-bold text-teal-ink">
                Pick your Plan
              </Text>
              <Text className="mt-1 text-sm text-teal-deep">
                Journeys through Scripture
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-8"
            contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
          >
            {JOURNEYS.map((journey) => (
              <Pressable
                key={journey.id}
                accessibilityRole="button"
                style={{ width: cardWidth }}
                className="overflow-hidden rounded-2xl border border-teal-deep/10 bg-white"
                onPress={() =>
                  navigation.navigate("Book", { bookId: journey.bookIds[0] })
                }
              >
                <Image
                  source={journey.cover}
                  style={{ width: cardWidth, height: cardWidth }}
                  resizeMode="cover"
                />
                <View className="px-3 py-3">
                  <Text className="text-xs font-semibold text-teal-deep">
                    Journey {journey.number} | {journey.title}
                  </Text>
                  <Text
                    className="mt-1 text-sm font-bold text-teal-ink"
                    numberOfLines={2}
                  >
                    {journey.booksLabel}
                  </Text>
                  <Text className="mt-2 text-xs text-parchment-ink/60">
                    {journey.days} days
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Text className="mb-3 text-2xl font-bold text-teal-ink">
            Old Testament
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          >
            {BOOKS.filter((book) => book.testament === "OT").map((book) => (
              <Pressable
                key={book.id}
                accessibilityRole="button"
                style={{ width: cardWidth }}
                className="overflow-hidden rounded-2xl border border-teal-deep/10"
                onPress={() => navigation.navigate("Book", { bookId: book.id })}
              >
                <View className="relative">
                  <Image
                    source={book.cover}
                    style={{ width: cardWidth, height: cardWidth }}
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-2 left-2 rounded bg-teal-ink/85 px-2 py-1">
                    <Text className="text-lg font-bold text-white">
                      {book.abbreviation}
                    </Text>
                  </View>
                </View>
                <View className="bg-white px-3 py-3">
                  <Text className="text-base font-bold text-teal-ink">
                    {book.name}
                  </Text>
                  <Text className="mt-1 text-xs text-parchment-ink/60">
                    {book.days} days · anime + audio
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <View className="mt-8 rounded-2xl bg-parchment px-4 py-5">
            <Text className="mb-3 text-lg font-bold text-teal-ink">
              How it works
            </Text>
            {[
              "01  Pick a journey or Bible book",
              "02  Open a chapter — comics + narration play together",
              "03  Come back tomorrow for the next chapter",
            ].map((step) => (
              <Text
                key={step}
                className="mb-2 text-sm leading-5 text-parchment-ink/80"
              >
                {step}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
