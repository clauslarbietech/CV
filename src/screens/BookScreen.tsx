import { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getBook } from "../data/library";
import type { RootStackParamList } from "../navigation/types";
import {
  getBookProgress,
  markPlanDownloaded,
  updateChapterProgress,
  type BookProgressMap,
} from "../services/listeningProgress";

type Props = NativeStackScreenProps<RootStackParamList, "Book">;

export default function BookScreen({ navigation, route }: Props) {
  const book = getBook(route.params.bookId);
  const [progressMap, setProgressMap] = useState<BookProgressMap>({});

  const refresh = useCallback(async () => {
    if (!book) {
      return;
    }
    setProgressMap(await getBookProgress(book.id));
  }, [book]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  if (!book) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-terracotta-dark">Book not found.</Text>
      </SafeAreaView>
    );
  }

  const downloadedCount = book.chapters.filter(
    (chapter) => progressMap[String(chapter.number)]?.downloaded
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-12 pt-2">
          <View className="mb-4 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              className="py-1"
            >
              <Text className="text-sm font-semibold text-teal-deep">← Home</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="rounded-full bg-teal-mist px-3 py-1.5"
              onPress={() => {
                Alert.alert(
                  "Plan options",
                  "Download this plan for offline listening (Through the Word style).",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Download plan",
                      onPress: () => {
                        void markPlanDownloaded(
                          book.id,
                          book.chapters.map((chapter) => chapter.number)
                        ).then(refresh);
                      },
                    },
                  ]
                );
              }}
            >
              <Text className="text-xs font-bold text-teal-ink">⋯</Text>
            </Pressable>
          </View>

          <View className="mb-6 flex-row items-center">
            <Image
              source={book.cover}
              style={{ width: 96, height: 96, borderRadius: 16 }}
            />
            <View className="ml-4 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                {book.testament === "OT" ? "Old Testament" : "New Testament"}
              </Text>
              <Text className="text-3xl font-bold text-teal-ink">{book.name}</Text>
              <Text className="mt-1 text-sm leading-5 text-parchment-ink/70">
                {book.tagline}
              </Text>
              <Text className="mt-2 text-xs font-semibold text-teal-deep">
                {book.chapters.length} guides · {downloadedCount} downloaded
              </Text>
            </View>
          </View>

          <View className="mb-4 rounded-2xl bg-parchment px-4 py-3">
            <Text className="text-sm font-bold text-teal-ink">How to listen</Text>
            <Text className="mt-1 text-sm leading-5 text-parchment-ink/75">
              Open a chapter → tap play → follow anime panels + scripture while
              the guide narrates. Come back tomorrow for the next chapter.
            </Text>
          </View>

          <Text className="mb-3 text-lg font-bold text-teal-ink">
            Chapters · comics & narration
          </Text>

          {book.chapters.map((chapter) => {
            const thumb = chapter.panels[0]?.image ?? book.cover;
            const chapterProgress = progressMap[String(chapter.number)];
            return (
              <Pressable
                key={chapter.number}
                accessibilityRole="button"
                className="mb-3 flex-row overflow-hidden rounded-2xl border border-teal-deep/10 bg-parchment active:bg-parchment-warm"
                onPress={() =>
                  navigation.navigate("ChapterPlayer", {
                    bookId: book.id,
                    chapterNumber: chapter.number,
                  })
                }
                onLongPress={() => {
                  Alert.alert(
                    `${book.name} ${chapter.number}`,
                    "Mark progress like Through the Word (press & hold).",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: chapterProgress?.completed
                          ? "Mark incomplete"
                          : "Mark complete",
                        onPress: () => {
                          void updateChapterProgress(book.id, chapter.number, {
                            completed: !chapterProgress?.completed,
                          }).then(refresh);
                        },
                      },
                      {
                        text: chapterProgress?.favorite
                          ? "Unfavorite"
                          : "Favorite",
                        onPress: () => {
                          void updateChapterProgress(book.id, chapter.number, {
                            favorite: !chapterProgress?.favorite,
                          }).then(refresh);
                        },
                      },
                    ]
                  );
                }}
              >
                <Image
                  source={thumb}
                  style={{ width: 88, height: 88 }}
                  resizeMode="cover"
                />
                <View className="flex-1 justify-center px-3 py-2">
                  <Text className="text-xs font-semibold text-terracotta">
                    Chapter {chapter.number}
                    {chapterProgress?.completed ? " · Done" : ""}
                    {chapterProgress?.favorite ? " · ★" : ""}
                    {chapterProgress?.downloaded ? " · Offline" : ""}
                  </Text>
                  <Text className="text-base font-bold text-teal-ink">
                    {chapter.title}
                  </Text>
                  <Text
                    className="mt-1 text-xs text-parchment-ink/65"
                    numberOfLines={2}
                  >
                    {chapter.guide.title} · {chapter.panels.length} anime panels
                  </Text>
                </View>
                <View className="justify-center pr-3">
                  <Text className="text-xl text-terracotta">▶</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
