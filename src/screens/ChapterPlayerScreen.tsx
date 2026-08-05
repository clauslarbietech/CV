import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Speech from "expo-speech";
import AccessibleIconButton from "../components/accessibility/AccessibleIconButton";
import ChapterPickerModal from "../components/bible/ChapterPickerModal";
import VersionPickerModal from "../components/bible/VersionPickerModal";
import SelectableScripture, {
  splitScriptureSegments,
  type AppliedHighlight,
  type ScriptureSegment,
} from "../components/bible/SelectableScripture";
import SelectionActionSheet from "../components/bible/SelectionActionSheet";
import ChapterPremiseComics from "../components/comics/ChapterPremiseComics";
import AppTabBar from "../components/navigation/AppTabBar";
import AudioGuidePlayer from "../components/player/AudioGuidePlayer";
import { getBook, getChapter, JOURNEYS } from "../data/library";
import { getWebtoonEpisode } from "../data/webtoonEpisodes";
import { useAudioGuideSession } from "../hooks/useAudioGuideSession";
import type { RootStackParamList } from "../navigation/types";
import {
  loadSelectedBibleSource,
  saveSelectedBibleSource,
} from "../services/biblePreferences";
import {
  isChapterFavorited,
  listFavorites,
  toggleChapterFavorite,
} from "../services/favoritesService";
import { inviteToJourney } from "../services/journeyInvite";
import {
  getChapterProgress,
  updateChapterProgress,
  type ChapterProgress,
} from "../services/listeningProgress";
import {
  fetchScriptureChapter,
  getDefaultBibleSource,
  normalizeBibleSource,
} from "../services/scriptureService";
import type { BibleSource } from "../types/bibleSource";

type Props = NativeStackScreenProps<RootStackParamList, "ChapterPlayer">;

type PassageState = {
  canonical: string;
  content: string;
};

export default function ChapterPlayerScreen({ navigation, route }: Props) {
  const { bookId, chapterNumber, autoPlay } = route.params;
  const book = getBook(bookId);
  const chapter = getChapter(bookId, chapterNumber);

  const [passage, setPassage] = useState<PassageState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ChapterProgress>({
    completed: false,
    favorite: false,
    downloaded: false,
    lastPositionSeconds: 0,
  });
  const [chapterOpen, setChapterOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [playerMode, setPlayerMode] = useState<"guide" | "bible">("guide");
  const [source, setSource] = useState<BibleSource>(() => getDefaultBibleSource());
  const [didAutoPlay, setDidAutoPlay] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSegment, setSelectedSegment] =
    useState<ScriptureSegment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [appliedHighlights, setAppliedHighlights] = useState<
    AppliedHighlight[]
  >([]);

  const audio = useAudioGuideSession({
    guide: chapter?.guide,
    chapterKey: `${bookId}:${chapterNumber}`,
  });

  const displayPanels = useMemo(
    () => (chapter ? chapter.panels : []),
    [chapter]
  );

  // One ESV audio line per slide — keep image + text locked together.
  const activePanelIndex = useMemo(() => {
    if (!displayPanels.length) {
      return 0;
    }
    return Math.min(
      displayPanels.length - 1,
      Math.max(0, audio.activeLineIndex)
    );
  }, [audio.activeLineIndex, displayPanels.length]);

  const activeNarration = useMemo(() => {
    const panel = displayPanels[activePanelIndex];
    if (panel?.caption) {
      return panel.caption;
    }
    if (!chapter?.guide.script.length) {
      return undefined;
    }
    return (
      chapter.guide.script[audio.activeLineIndex] ?? chapter.guide.script[0]
    );
  }, [activePanelIndex, audio.activeLineIndex, chapter, displayPanels]);

  const prevChapter = book?.chapters.find(
    (item) => item.number === chapterNumber - 1
  );
  const nextChapter = book?.chapters.find(
    (item) => item.number === chapterNumber + 1
  );

  useEffect(() => {
    if (!chapter) {
      return;
    }

    let cancelled = false;

    async function loadPassage() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchScriptureChapter(
          bookId,
          chapterNumber,
          source
        );
        if (!cancelled) {
          setPassage({
            canonical: result.reference,
            content: result.content,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load scripture."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPassage();
    return () => {
      cancelled = true;
    };
  }, [bookId, chapter, chapterNumber, source]);

  useEffect(() => {
    void loadSelectedBibleSource().then((saved) => {
      const next = normalizeBibleSource(saved);
      setSource(next);
      if (saved && JSON.stringify(normalizeBibleSource(saved)) !== JSON.stringify(saved)) {
        void saveSelectedBibleSource(next);
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getChapterProgress(bookId, chapterNumber).then((saved) => {
      if (!cancelled) {
        setProgress(saved);
      }
    });
    void isChapterFavorited(bookId, chapterNumber).then((value) => {
      if (!cancelled) {
        setIsFavorite(value);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [bookId, chapterNumber]);

  useEffect(() => {
    if (audio.position === 0 || audio.position % 5 === 0) {
      void updateChapterProgress(bookId, chapterNumber, {
        lastPositionSeconds: audio.position,
      });
    }
  }, [audio.position, bookId, chapterNumber]);

  useEffect(() => {
    if (audio.position >= audio.duration && audio.duration > 0) {
      void updateChapterProgress(bookId, chapterNumber, { completed: true }).then(
        setProgress
      );
    }
  }, [audio.duration, audio.position, bookId, chapterNumber]);

  useEffect(() => {
    return () => {
      void Speech.stop();
    };
  }, []);

  // Auto-start audio when arriving with autoPlay (e.g. from webtoon Back/Next).
  useEffect(() => {
    if (!autoPlay || didAutoPlay || !chapter) {
      return;
    }
    setDidAutoPlay(true);
    const timer = setTimeout(() => {
      audio.play();
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- play once per arrival
  }, [autoPlay, chapter, didAutoPlay]);

  useEffect(() => {
    setDidAutoPlay(false);
    setPlayerMode("guide");
  }, [chapterNumber]);

  useEffect(() => {
    setSelectedSegment(null);
    setSheetOpen(false);
  }, [bookId, chapterNumber]);

  useEffect(() => {
    const text = passage?.content.trim() ?? "";
    let cancelled = false;
    void listFavorites().then((items) => {
      if (cancelled || !text) {
        return;
      }
      const segs = splitScriptureSegments(text);
      const applied: AppliedHighlight[] = [];
      for (const item of items) {
        if (
          (item.kind !== "bible_highlight" && item.kind !== "story_highlight") ||
          item.bookId !== bookId ||
          item.chapterNumber !== chapterNumber ||
          !item.highlightColor
        ) {
          continue;
        }
        const match = segs.find(
          (seg) =>
            seg.text.includes(item.excerpt.slice(0, 48)) ||
            item.excerpt.includes(seg.text.slice(0, 48))
        );
        if (match) {
          applied.push({
            segmentId: match.id,
            colorId: item.highlightColor,
            excerpt: item.excerpt,
          });
        }
      }
      setAppliedHighlights(applied);
    });
    return () => {
      cancelled = true;
    };
  }, [bookId, chapterNumber, passage?.content]);

  const goChapter = (number: number, play = true) => {
    void audio.stop();
    void Speech.stop();
    navigation.replace("ChapterPlayer", {
      bookId,
      chapterNumber: number,
      autoPlay: play,
    });
  };

  if (!book || !chapter) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-night-bg">
        <Text className="text-base text-terracotta-dark">Chapter not found.</Text>
      </SafeAreaView>
    );
  }

  const verses = passage?.content.trim() ?? "";
  const webtoon = getWebtoonEpisode(bookId, chapterNumber);

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-3 py-2">
          <AccessibleIconButton
            icon="keyboard-arrow-down"
            label="Close chapter"
            hint="Returns to the previous screen"
            onPress={() => {
              void audio.stop();
              void Speech.stop();
              navigation.goBack();
            }}
          />

          <View className="flex-1 flex-row items-center justify-center gap-2 px-1">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Choose chapter"
              className="flex-row items-center rounded-full bg-night-elevated px-3 py-2"
              onPress={() => setChapterOpen(true)}
            >
              <Text className="text-sm font-bold text-night-text">
                {book.name} {chapter.number}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#F2F2F7" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Bible version ${source.abbreviation}`}
              className="flex-row items-center rounded-full bg-night-elevated px-3 py-2"
              onPress={() => setVersionOpen(true)}
            >
              <Text className="text-sm font-bold text-night-text">
                {source.abbreviation}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color="#F2F2F7" />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-1">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Invite others to read this chapter"
              className="h-9 w-9 items-center justify-center rounded-full bg-terracotta/25"
              onPress={() => {
                const journey =
                  JOURNEYS.find((item) => item.bookIds.includes(bookId)) ??
                  JOURNEYS[0];
                void inviteToJourney({
                  journeyTitle: journey?.title ?? book.name,
                  booksLabel: journey?.booksLabel ?? `${book.name} journey`,
                  bookId,
                  chapterNumber,
                });
              }}
            >
              <MaterialIcons name="person-add" size={18} color="#E4572E" />
            </Pressable>
            {webtoon ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open comic storyline"
                className="h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
                onPress={() => {
                  void audio.stop();
                  navigation.navigate("WebtoonEpisode", {
                    bookId,
                    chapterNumber,
                    storylineId: webtoon.storylineId,
                  });
                }}
              >
                <MaterialIcons name="auto-stories" size={18} color="#F0D78C" />
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Bible reader"
              className="h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
              onPress={() => {
                void audio.stop();
                navigation.navigate("MainTabs", { screen: "Bible" });
              }}
            >
              <MaterialIcons name="search" size={18} color="#AEAEB2" />
            </Pressable>
          </View>
        </View>

        <View className="mx-4 mb-2 flex-row rounded-full bg-night-elevated p-1">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: playerMode === "guide" }}
            accessibilityLabel="Guide view"
            onPress={() => setPlayerMode("guide")}
            className={`flex-1 items-center rounded-full py-2 ${
              playerMode === "guide" ? "bg-terracotta/25" : ""
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                playerMode === "guide" ? "text-night-text" : "text-night-muted"
              }`}
            >
              Guide
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: playerMode === "bible" }}
            accessibilityLabel="Bible text view"
            onPress={() => setPlayerMode("bible")}
            className={`flex-1 items-center rounded-full py-2 ${
              playerMode === "bible" ? "bg-terracotta/25" : ""
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                playerMode === "bible" ? "text-night-text" : "text-night-muted"
              }`}
            >
              Bible
            </Text>
          </Pressable>
        </View>

        {playerMode === "guide" ? (
          <View className="flex-1">
            <ScrollView
              className="flex-1"
              contentContainerClassName="pb-2"
              showsVerticalScrollIndicator={false}
            >
              <ChapterPremiseComics
                panels={displayPanels}
                activeIndex={activePanelIndex}
                activeNarration={activeNarration}
                onSelectSlide={(index) => {
                  audio.seekToLine(index);
                }}
              />
            </ScrollView>

            <AudioGuidePlayer
              title={chapter.title}
              subtitle={chapter.guide.narrator}
              position={audio.position}
              duration={audio.duration}
              isPlaying={audio.isPlaying}
              speed={audio.speed}
              favorite={isFavorite || progress.favorite}
              hasPrevious={Boolean(prevChapter)}
              hasNext={Boolean(nextChapter)}
              onToggle={audio.toggle}
              onSeek={audio.seekTo}
              onCycleSpeed={() => {
                void audio.cycleSpeed();
              }}
              onToggleFavorite={() => {
                void toggleChapterFavorite({
                  bookId,
                  chapterNumber,
                  title: `${book.name} ${chapter.number} · ${chapter.title}`,
                  note: "Favorite chapter",
                }).then((result) => {
                  setIsFavorite(result.favorited);
                  void updateChapterProgress(bookId, chapterNumber, {
                    favorite: result.favorited,
                  }).then(setProgress);
                });
              }}
              onPrevious={() => {
                if (prevChapter) {
                  goChapter(prevChapter.number, true);
                }
              }}
              onNext={() => {
                if (nextChapter) {
                  goChapter(nextChapter.number, true);
                }
              }}
            />
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4"
            contentContainerClassName="pb-6"
            showsVerticalScrollIndicator={true}
          >
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="flex-1 text-sm font-bold text-night-text">
                {passage?.canonical ?? chapter.passageQuery}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Bible version ${source.abbreviation}`}
                onPress={() => setVersionOpen(true)}
                className="ml-2 flex-row items-center rounded-full bg-night-elevated px-3 py-1.5"
              >
                <Text className="text-xs font-bold text-night-text">
                  {source.abbreviation}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={18}
                  color="#F2F2F7"
                  style={{ marginLeft: 2 }}
                />
              </Pressable>
            </View>
            {loading ? (
              <ActivityIndicator color="#E4572E" />
            ) : error ? (
              <Text className="text-sm text-terracotta-dark">{error}</Text>
            ) : (
              <SelectableScripture
                text={verses}
                selectedId={selectedSegment?.id ?? null}
                highlights={appliedHighlights}
                onSelect={(segment) => {
                  setSelectedSegment(segment);
                  setSheetOpen(true);
                }}
              />
            )}
          </ScrollView>
        )}

        <AppTabBar activeTab="Home" />
      </View>

      <SelectionActionSheet
        visible={sheetOpen && Boolean(selectedSegment)}
        selectedText={selectedSegment?.text ?? ""}
        selectionLabel={`${book.name} ${chapter.number}`}
        bookId={bookId}
        chapterNumber={chapterNumber}
        scriptureRef={passage?.canonical ?? chapter.passageQuery}
        versionLabel={source.abbreviation}
        favoriteKind="story_highlight"
        onClose={() => {
          setSheetOpen(false);
          setSelectedSegment(null);
        }}
        onHighlightSaved={(colorId, excerpt) => {
          if (!selectedSegment) {
            return;
          }
          setAppliedHighlights((current) => [
            ...current.filter((item) => item.segmentId !== selectedSegment.id),
            {
              segmentId: selectedSegment.id,
              colorId,
              excerpt,
            },
          ]);
        }}
      />

      {book.id === "genesis" ? (
        <ChapterPickerModal
          visible={chapterOpen}
          chapterCount={book.chapters.length}
          selectedChapter={chapter.number}
          onClose={() => setChapterOpen(false)}
          onSelect={(number) => goChapter(number, false)}
        />
      ) : null}

      <VersionPickerModal
        visible={versionOpen}
        selected={source}
        onClose={() => setVersionOpen(false)}
        onSelect={(next) => {
          void audio.stop();
          void Speech.stop();
          setSource(next);
          void saveSelectedBibleSource(next);
        }}
      />
    </SafeAreaView>
  );
}
