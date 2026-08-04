import { useCallback, useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  GENESIS_ARCS,
  listGenesisByArc,
} from "../data/genesisChapters";
import { getBook } from "../data/library";
import { getWebtoonEpisode, listWebtoonEpisodes } from "../data/webtoonEpisodes";
import type { RootStackParamList } from "../navigation/types";
import {
  getBookProgress,
  markPlanDownloaded,
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

  const illustrated = useMemo(
    () => (book ? listWebtoonEpisodes(book.id) : []),
    [book]
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
  const isGenesis = book.id === "genesis";

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
                {book.testament === "OT" ? "Old Testament" : "New Testament"} · Free
              </Text>
              <Text className="text-3xl font-bold text-teal-ink">{book.name}</Text>
              <Text className="mt-1 text-sm leading-5 text-parchment-ink/70">
                {book.tagline}
              </Text>
              <Text className="mt-2 text-xs font-semibold text-teal-deep">
                {book.chapters.length} chapters · {downloadedCount} downloaded · ESV
              </Text>
            </View>
          </View>

          <View className="mb-4 rounded-2xl bg-parchment px-4 py-3">
            <Text className="text-sm font-bold text-teal-ink">How to use this book</Text>
            <Text className="mt-1 text-sm leading-5 text-parchment-ink/75">
              1) Tap an illustrated storyline{"\n"}
              2) Tap the speaker to hear scripture + speech{"\n"}
              3) Keep going with chapters 4–50 audio guides
            </Text>
          </View>

          {illustrated.length > 0 ? (
            <>
              <Text className="mb-3 text-lg font-bold text-teal-ink">
                Illustrated storylines · ESV audio
              </Text>
              {illustrated.map((episode) => (
                <Pressable
                  key={episode.id}
                  accessibilityRole="button"
                  className="mb-3 overflow-hidden rounded-2xl border border-terracotta/20 bg-teal-ink px-4 py-3 active:opacity-90"
                  onPress={() =>
                    navigation.navigate("WebtoonEpisode", {
                      bookId: episode.bookId,
                      chapterNumber: episode.chapterNumber,
                      storylineId: episode.storylineId,
                    })
                  }
                >
                  <Text className="text-xs font-bold uppercase tracking-[2px] text-ochre-soft">
                    {episode.episodeLabel} · Ch. {episode.chapterNumber}
                  </Text>
                  <Text className="mt-1 text-base font-bold text-white">
                    {episode.title}
                  </Text>
                  <Text className="mt-1 text-xs text-white/65" numberOfLines={2}>
                    {episode.subtitle} · {episode.panels.length} scenes
                  </Text>
                </Pressable>
              ))}
            </>
          ) : null}

          <Text className="mb-3 mt-4 text-lg font-bold text-teal-ink">
            All chapters · Genesis 1–{book.chapters.length}
          </Text>

          {isGenesis
            ? GENESIS_ARCS.map((arc) => {
                const chapters = listGenesisByArc(arc);
                return (
                  <View key={arc} className="mb-4">
                    <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-terracotta">
                      {arc}
                    </Text>
                    {chapters.map((meta) => {
                      const chapterProgress = progressMap[String(meta.number)];
                      const webtoon = getWebtoonEpisode(book.id, meta.number);
                      return (
                        <Pressable
                          key={meta.number}
                          accessibilityRole="button"
                          className="mb-2 flex-row items-center rounded-xl border border-teal-deep/10 bg-parchment px-3 py-3 active:bg-parchment-warm"
                          onPress={() => {
                            if (webtoon) {
                              navigation.navigate("WebtoonEpisode", {
                                bookId: book.id,
                                chapterNumber: meta.number,
                                storylineId: webtoon.storylineId,
                              });
                            } else {
                              navigation.navigate("ChapterPlayer", {
                                bookId: book.id,
                                chapterNumber: meta.number,
                              });
                            }
                          }}
                        >
                          <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-teal-mist">
                            <Text className="text-xs font-bold text-teal-ink">
                              {meta.number}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-bold text-teal-ink">
                              {meta.title}
                              {chapterProgress?.completed ? " · Done" : ""}
                            </Text>
                            <Text
                              className="mt-0.5 text-xs text-parchment-ink/60"
                              numberOfLines={1}
                            >
                              {webtoon
                                ? "Illustrated webtoon · ESV"
                                : `${meta.keyVerseRef} · ESV audio guide`}
                            </Text>
                          </View>
                          <Text className="text-lg text-terracotta">▶</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                );
              })
            : book.chapters.map((chapter) => {
                const thumb = chapter.panels[0]?.image ?? book.cover;
                const chapterProgress = progressMap[String(chapter.number)];
                return (
                  <Pressable
                    key={chapter.number}
                    accessibilityRole="button"
                    className="mb-3 flex-row overflow-hidden rounded-2xl border border-teal-deep/10 bg-parchment"
                    onPress={() =>
                      navigation.navigate("ChapterPlayer", {
                        bookId: book.id,
                        chapterNumber: chapter.number,
                      })
                    }
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
                      </Text>
                      <Text className="text-base font-bold text-teal-ink">
                        {chapter.title}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
