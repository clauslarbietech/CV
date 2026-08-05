import { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import BibleSearchModal from "../components/bible/BibleSearchModal";
import ChapterPickerModal from "../components/bible/ChapterPickerModal";
import StorylinePickerModal from "../components/bible/StorylinePickerModal";
import { CATALOG_BOOKS, libraryBookIdFor } from "../data/bibleCatalog";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const chapterStripRef = useRef<ScrollView>(null);

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
    setSelectedChapter(chapterNumber);
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
  const featured =
    illustrated.find((item) => item.chapterNumber === selectedChapter) ??
    illustrated[0];
  const featuredMeta = featured
    ? getGenesisChapter(featured.chapterNumber)
    : getGenesisChapter(selectedChapter);
  const selectedMeta = getGenesisChapter(selectedChapter);

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pb-12 pt-2">
          {/* Top chrome — same pattern as Bible: chapter chip + search */}
          <View className="mb-3 flex-row items-center justify-between px-4">
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              className="h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
            >
              <MaterialIcons name="arrow-back" size={20} color="#F2F2F7" />
            </Pressable>

            <View className="flex-1 flex-row items-center justify-center gap-2 px-2">
              {isGenesis ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${book.name} chapter ${selectedChapter}`}
                  className="flex-row items-center rounded-full bg-night-elevated px-3 py-2"
                  onPress={() => setChapterOpen(true)}
                >
                  <Text className="text-sm font-bold text-night-text">
                    {book.name} {selectedChapter}
                  </Text>
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={20}
                    color="#F2F2F7"
                  />
                </Pressable>
              ) : (
                <Text className="text-sm font-bold text-night-text">
                  {book.name}
                </Text>
              )}

              {illustrated.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Choose illustrated storyline"
                  className="flex-row items-center rounded-full bg-night-elevated px-3 py-2"
                  onPress={() => setStorylineOpen(true)}
                >
                  <Text className="text-sm font-bold text-night-text">
                    Storylines
                  </Text>
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={20}
                    color="#F2F2F7"
                  />
                </Pressable>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Search scripture"
              className="h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
              onPress={() => setSearchOpen(true)}
            >
              <MaterialIcons name="search" size={20} color="#AEAEB2" />
            </Pressable>
          </View>

          {/* Chapter number carousel */}
          {isGenesis ? (
            <ScrollView
              ref={chapterStripRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 8,
                paddingHorizontal: 16,
                paddingBottom: 12,
              }}
            >
              {book.chapters.map((chapter) => {
                const selected = chapter.number === selectedChapter;
                const done = progressMap[String(chapter.number)]?.completed;
                return (
                  <Pressable
                    key={chapter.number}
                    accessibilityRole="button"
                    accessibilityLabel={`Chapter ${chapter.number}`}
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setSelectedChapter(chapter.number);
                      openChapter(chapter.number);
                    }}
                    className={`h-11 min-w-[44px] items-center justify-center rounded-full px-3 ${
                      selected ? "bg-terracotta" : "bg-night-elevated"
                    }`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        selected ? "text-white" : "text-night-text"
                      }`}
                    >
                      {chapter.number}
                      {done && !selected ? " ✓" : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}

          <View className="px-5">
            <View className="mb-4 flex-row items-center">
              <Image
                source={book.cover}
                style={{ width: 72, height: 72, borderRadius: 14 }}
              />
              <View className="ml-3 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                  {book.testament === "OT" ? "Old Testament" : "New Testament"} · Free
                </Text>
                <Text className="text-2xl font-bold text-night-text">
                  {book.name}
                </Text>
                <Text className="mt-1 text-xs font-semibold text-night-soft">
                  {selectedMeta
                    ? `Ch. ${selectedChapter} · ${selectedMeta.title}`
                    : `${book.chapters.length} chapters · ${downloadedCount} downloaded`}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                className="h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
                onPress={() => {
                  Alert.alert(
                    "Plan options",
                    "Download this plan for offline listening.",
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
                <MaterialIcons name="more-horiz" size={20} color="#F2F2F7" />
              </Pressable>
            </View>

            {featured ? (
              <Pressable
                accessibilityRole="button"
                className="mb-3 overflow-hidden rounded-2xl border border-night-border bg-night-card active:bg-night-elevated"
                onPress={() => openEpisode(featured)}
              >
                {featured.panels[0] ? (
                  <Image
                    source={featured.panels[0].image}
                    style={{ width: "100%", height: 180 }}
                    resizeMode="cover"
                  />
                ) : null}
                <View className="px-4 py-3">
                  <Text className="text-[10px] font-bold uppercase tracking-[2px] text-terracotta">
                    {featured.episodeLabel} · Ch. {featured.chapterNumber}
                  </Text>
                  <Text className="mt-1 text-lg font-bold text-night-text">
                    {featured.title}
                  </Text>
                  <Text className="mt-1 text-xs text-night-muted" numberOfLines={2}>
                    {featuredMeta?.summary ?? featured.subtitle}
                  </Text>
                </View>
              </Pressable>
            ) : selectedMeta ? (
              <Pressable
                accessibilityRole="button"
                className="mb-3 rounded-2xl border border-night-border bg-night-card px-4 py-4"
                onPress={() => openChapter(selectedChapter)}
              >
                <Text className="text-[10px] font-bold uppercase tracking-[2px] text-terracotta">
                  Chapter {selectedChapter}
                </Text>
                <Text className="mt-1 text-lg font-bold text-night-text">
                  {selectedMeta.title}
                </Text>
                <Text className="mt-1 text-xs text-night-muted" numberOfLines={2}>
                  {selectedMeta.summary}
                </Text>
                <Text className="mt-3 text-sm font-semibold text-ochre-soft">
                  Open chapter →
                </Text>
              </Pressable>
            ) : null}
          </View>
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
          selectedChapter={selectedChapter}
          onClose={() => setChapterOpen(false)}
          onSelect={(number) => {
            setSelectedChapter(number);
            openChapter(number);
          }}
        />
      ) : null}

      <BibleSearchModal
        visible={searchOpen}
        books={CATALOG_BOOKS}
        onClose={() => setSearchOpen(false)}
        onJump={(bookUsfm, chapter) => {
          const libraryId = libraryBookIdFor(bookUsfm);
          if (libraryId === book.id) {
            setSelectedChapter(chapter);
            openChapter(chapter);
            return;
          }
          navigation.navigate("MainTabs");
        }}
      />
    </SafeAreaView>
  );
}
