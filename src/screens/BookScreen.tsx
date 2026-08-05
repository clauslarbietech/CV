import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import BibleSearchModal from "../components/bible/BibleSearchModal";
import ChapterPickerModal from "../components/bible/ChapterPickerModal";
import StorylinePickerModal from "../components/bible/StorylinePickerModal";
import AppTabBar from "../components/navigation/AppTabBar";
import { CATALOG_BOOKS, libraryBookIdFor } from "../data/bibleCatalog";
import { listGenesisArcCards } from "../data/genesisArcs";
import type { GenesisArc } from "../data/genesisChapters";
import { getBook, JOURNEYS } from "../data/library";
import {
  listWebtoonEpisodes,
  type WebtoonEpisode,
} from "../data/webtoonEpisodes";
import type { RootStackParamList } from "../navigation/types";
import {
  getBookProgress,
  type BookProgressMap,
} from "../services/listeningProgress";
import { inviteToJourney } from "../services/journeyInvite";
import { openBibleChapter } from "../services/openBibleChapter";

type Props = NativeStackScreenProps<RootStackParamList, "Book">;

export default function BookScreen({ navigation, route }: Props) {
  const { width } = useWindowDimensions();
  const book = getBook(route.params.bookId);
  const initialChapter = route.params.chapterNumber ?? 1;
  const [progressMap, setProgressMap] = useState<BookProgressMap>({});
  const [storylineOpen, setStorylineOpen] = useState(false);
  const [chapterOpen, setChapterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pickerArc, setPickerArc] = useState<GenesisArc | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);

  const cardWidth = Math.min(width - 32, 520);
  const cardHeight = Math.round(cardWidth * 0.56);

  useEffect(() => {
    if (route.params.chapterNumber) {
      setSelectedChapter(route.params.chapterNumber);
    }
  }, [route.params.chapterNumber]);

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

  const arcCards = useMemo(() => listGenesisArcCards(), []);

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
    openBibleChapter(navigation, book.id, chapterNumber, { autoPlay: true });
  };

  /** Prefer the chapter the user elected when it falls inside this arc. */
  const chapterForArc = (startChapter: number, endChapter: number) => {
    if (selectedChapter >= startChapter && selectedChapter <= endChapter) {
      return selectedChapter;
    }
    return startChapter;
  };

  const openArc = (
    arc: GenesisArc,
    startChapter: number,
    endChapter: number
  ) => {
    const electedInArc =
      selectedChapter >= startChapter && selectedChapter <= endChapter;
    const chapter = electedInArc ? selectedChapter : startChapter;
    setPickerArc(arc);
    setSelectedChapter(chapter);
    if (electedInArc) {
      openChapter(selectedChapter);
      return;
    }
    setChapterOpen(true);
  };

  const playArc = (startChapter: number, endChapter: number) => {
    setPickerArc(null);
    openChapter(chapterForArc(startChapter, endChapter));
  };

  if (!book) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-night-bg">
        <Text className="text-base text-terracotta-dark">Book not found.</Text>
      </SafeAreaView>
    );
  }

  const isGenesis = book.id === "genesis";

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="pb-12 pt-2">
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
                    onPress={() => {
                      setPickerArc(null);
                      setChapterOpen(true);
                    }}
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

              <View className="flex-row items-center gap-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Invite others to this journey"
                  className="h-9 w-9 items-center justify-center rounded-full bg-terracotta/25"
                  onPress={() => {
                    const journey =
                      JOURNEYS.find((item) => item.bookIds.includes(book.id)) ??
                      JOURNEYS[0];
                    void inviteToJourney({
                      journeyTitle: journey?.title ?? book.name,
                      booksLabel: journey?.booksLabel ?? book.tagline,
                      bookId: book.id,
                      chapterNumber: selectedChapter,
                    });
                  }}
                >
                  <MaterialIcons name="person-add" size={18} color="#E4572E" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Search scripture"
                  className="h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
                  onPress={() => setSearchOpen(true)}
                >
                  <MaterialIcons name="search" size={20} color="#AEAEB2" />
                </Pressable>
              </View>
            </View>

            {isGenesis ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 8,
                  paddingHorizontal: 16,
                  paddingBottom: 14,
                }}
              >
                {book.chapters.map((chapter) => {
                  const selected = chapter.number === selectedChapter;
                  const done = progressMap[String(chapter.number)]?.completed;
                  return (
                    <Pressable
                      key={chapter.number}
                      accessibilityRole="button"
                      accessibilityLabel={
                        selected
                          ? `Open chapter ${chapter.number}`
                          : `Select chapter ${chapter.number}`
                      }
                      onPress={() => {
                        if (selected) {
                          openChapter(chapter.number);
                        } else {
                          setSelectedChapter(chapter.number);
                        }
                      }}
                      className={`h-10 min-w-[40px] items-center justify-center rounded-full px-2.5 ${
                        selected ? "bg-terracotta" : "bg-night-elevated"
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          selected ? "text-white" : "text-night-text"
                        }`}
                      >
                        {chapter.number}
                        {done && !selected ? "·" : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}

            <View className="px-4">
              <Text className="mb-3 text-lg font-bold text-night-text">
                {book.name}
              </Text>

              {isGenesis
                ? arcCards.map((card) => (
                    <Pressable
                      key={card.arc}
                      accessibilityRole="button"
                      accessibilityLabel={`${card.arc}. Chapters ${card.startChapter} to ${card.endChapter}`}
                      onPress={() =>
                        openArc(card.arc, card.startChapter, card.endChapter)
                      }
                      className="mb-3 overflow-hidden rounded-2xl bg-night-card"
                      style={{ width: cardWidth, alignSelf: "center" }}
                    >
                      <View style={{ width: cardWidth, height: cardHeight }}>
                        <Image
                          source={card.image}
                          style={{ width: cardWidth, height: cardHeight }}
                          resizeMode="cover"
                        />
                        <View
                          pointerEvents="none"
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.28)",
                          }}
                        />
                        <Text
                          className="absolute left-3 top-3 text-lg font-bold text-white"
                          style={{
                            textShadowColor: "rgba(0,0,0,0.6)",
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 4,
                          }}
                        >
                          {card.arc}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Play ${card.arc} from chapter ${chapterForArc(card.startChapter, card.endChapter)}`}
                          hitSlop={8}
                          onPress={() =>
                            playArc(card.startChapter, card.endChapter)
                          }
                          className="absolute bottom-3 right-3 h-12 w-12 items-center justify-center rounded-full bg-terracotta"
                        >
                          <MaterialIcons
                            name="play-arrow"
                            size={28}
                            color="#FFFFFF"
                          />
                        </Pressable>
                        <Text className="absolute bottom-3 left-3 text-xs font-semibold text-white/85">
                          Ch. {card.startChapter}–{card.endChapter}
                        </Text>
                      </View>
                    </Pressable>
                  ))
                : null}
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
            initialArc={pickerArc}
            onClose={() => {
              setChapterOpen(false);
              setPickerArc(null);
            }}
            onSelect={(number) => {
              setPickerArc(null);
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
              openChapter(chapter);
              return;
            }
            navigation.navigate("MainTabs");
          }}
        />

        <AppTabBar activeTab="Home" />
      </View>
    </SafeAreaView>
  );
}
