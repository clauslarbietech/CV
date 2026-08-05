import { useCallback, useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ChapterPickerModal from "../components/bible/ChapterPickerModal";
import StorylinePickerModal from "../components/bible/StorylinePickerModal";
import { getGenesisChapter } from "../data/genesisChapters";
import { getBook } from "../data/library";
import {
  getWebtoonEpisode,
  listWebtoonEpisodes,
  type WebtoonEpisode,
} from "../data/webtoonEpisodes";
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
  const [storylineOpen, setStorylineOpen] = useState(false);
  const [chapterOpen, setChapterOpen] = useState(false);

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

  const openEpisode = (episode: WebtoonEpisode) => {
    navigation.navigate("WebtoonEpisode", {
      bookId: episode.bookId,
      chapterNumber: episode.chapterNumber,
      storylineId: episode.storylineId,
    });
  };

  const openChapter = (chapterNumber: number) => {
    if (!book) {
      return;
    }
    const webtoon = getWebtoonEpisode(book.id, chapterNumber);
    if (webtoon) {
      navigation.navigate("WebtoonEpisode", {
        bookId: book.id,
        chapterNumber,
        storylineId: webtoon.storylineId,
      });
      return;
    }
    navigation.navigate("ChapterPlayer", {
      bookId: book.id,
      chapterNumber,
    });
  };

  if (!book) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-night-bg">
        <Text className="text-base text-terracotta-dark">Book not found.</Text>
      </SafeAreaView>
    );
  }

  const downloadedCount = book.chapters.filter(
    (chapter) => progressMap[String(chapter.number)]?.downloaded
  ).length;
  const isGenesis = book.id === "genesis";
  const featured = illustrated[0];
  const featuredMeta = featured
    ? getGenesisChapter(featured.chapterNumber)
    : undefined;

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-12 pt-2">
          <View className="mb-4 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              className="py-1"
            >
              <Text className="text-sm font-semibold text-ochre-soft">← Home</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="rounded-full bg-night-elevated px-3 py-1.5"
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
              <Text className="text-xs font-bold text-night-text">⋯</Text>
            </Pressable>
          </View>

          <View className="mb-5 flex-row items-center">
            <Image
              source={book.cover}
              style={{ width: 96, height: 96, borderRadius: 16 }}
            />
            <View className="ml-4 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                {book.testament === "OT" ? "Old Testament" : "New Testament"} · Free
              </Text>
              <Text className="text-3xl font-bold text-night-text">{book.name}</Text>
              <Text className="mt-2 text-xs font-semibold text-night-soft">
                {book.chapters.length} chapters · {downloadedCount} downloaded
              </Text>
            </View>
          </View>

          {/* Compact pickers — same pattern as Bible version / chapter chips */}
          <View className="mb-5 flex-row flex-wrap gap-2">
            {illustrated.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose illustrated storyline"
                className="flex-row items-center rounded-full bg-night-elevated px-3.5 py-2.5"
                onPress={() => setStorylineOpen(true)}
              >
                <MaterialIcons name="auto-stories" size={18} color="#F0D78C" />
                <Text className="ml-1.5 text-sm font-bold text-night-text">
                  Storylines
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={20}
                  color="#F2F2F7"
                />
              </Pressable>
            ) : null}

            {isGenesis ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose Genesis chapter"
                className="flex-row items-center rounded-full bg-night-elevated px-3.5 py-2.5"
                onPress={() => setChapterOpen(true)}
              >
                <MaterialIcons name="menu-book" size={18} color="#F0D78C" />
                <Text className="ml-1.5 text-sm font-bold text-night-text">
                  Chapters 1–{book.chapters.length}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={20}
                  color="#F2F2F7"
                />
              </Pressable>
            ) : null}
          </View>

          {featured ? (
            <Pressable
              accessibilityRole="button"
              className="mb-3 overflow-hidden rounded-2xl border border-night-border bg-night-card px-4 py-4 active:bg-night-elevated"
              onPress={() => openEpisode(featured)}
            >
              <Text className="text-[10px] font-bold uppercase tracking-[2px] text-terracotta">
                Start here · {featured.episodeLabel}
              </Text>
              <Text className="mt-1 text-lg font-bold text-night-text">
                {featured.title}
              </Text>
              <Text className="mt-1 text-xs text-night-muted" numberOfLines={2}>
                {featuredMeta?.summary ?? featured.subtitle}
              </Text>
              <Text className="mt-3 text-sm font-semibold text-ochre-soft">
                Open storyline →
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      <StorylinePickerModal
        visible={storylineOpen}
        episodes={illustrated}
        onClose={() => setStorylineOpen(false)}
        onSelect={openEpisode}
      />

      {isGenesis ? (
        <ChapterPickerModal
          visible={chapterOpen}
          chapterCount={book.chapters.length}
          onClose={() => setChapterOpen(false)}
          onSelect={openChapter}
        />
      ) : null}
    </SafeAreaView>
  );
}
