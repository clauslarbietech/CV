import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Speech from "expo-speech";
import BibleSearchModal from "../components/bible/BibleSearchModal";
import ScripturePickerModal from "../components/bible/ScripturePickerModal";
import VoiceCarousel from "../components/bible/VoiceCarousel";
import SelectableScripture, {
  splitScriptureSegments,
  type AppliedHighlight,
  type ScriptureSegment,
} from "../components/bible/SelectableScripture";
import SelectionActionSheet from "../components/bible/SelectionActionSheet";
import VersionPickerModal from "../components/bible/VersionPickerModal";
import PremiseHeroImage from "../components/comics/PremiseHeroImage";
import { listFavorites } from "../services/favoritesService";
import {
  CATALOG_BOOKS,
  getCatalogBook,
  libraryBookIdFor,
  passageQueryFor,
  type CatalogBook,
} from "../data/bibleCatalog";
import { getGenesisChapter } from "../data/genesisChapters";
import { getChapter } from "../data/library";
import {
  getPanelAudioText,
  getWebtoonEpisode,
} from "../data/webtoonEpisodes";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import {
  loadSelectedBibleSource,
  saveSelectedBibleSource,
} from "../services/biblePreferences";
import { ESV_COPYRIGHT_NOTICE, ESV_WEBSITE_URL } from "../services/esvService";
import {
  fetchScriptureChapter,
  getDefaultBibleSource,
  normalizeBibleSource,
} from "../services/scriptureService";
import {
  DEFAULT_YOUVERSION_VERSION_ID,
  fetchBibleBooksForVersion,
} from "../services/youversionService";
import {
  formatSpeechRate,
  loadSpeechPreferences,
  nextSpeechRate,
  saveSpeechRate,
  saveSpeechVoiceId,
  speechSpeakOptions,
  SPEECH_RATES,
} from "../services/speechPreferences";
import { MIN_TOUCH_TARGET } from "../theme/a11y";
import { useReaderColors } from "../theme/ThemeProvider";
import type { BibleSource } from "../types/bibleSource";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Bible">,
  NativeStackScreenProps<RootStackParamList>
>;

/**
 * YouVersion-style Bible reader — comic premise on top, then scripture.
 */
export default function BibleReaderScreen({ navigation }: Props) {
  const readerColors = useReaderColors();
  const { width } = useWindowDimensions();

  const [bookId, setBookId] = useState("GEN");
  const [chapter, setChapter] = useState(1);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] =
    useState<ScriptureSegment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [appliedHighlights, setAppliedHighlights] = useState<
    AppliedHighlight[]
  >([]);
  const [source, setSource] = useState<BibleSource>(() => getDefaultBibleSource());
  const [books, setBooks] = useState<CatalogBook[]>(CATALOG_BOOKS);
  const [booksLoading, setBooksLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verses, setVerses] = useState("");
  const [canonical, setCanonical] = useState("");
  const [copyright, setCopyright] = useState(
    "Scripture via YouVersion Platform when configured."
  );
  const [copyrightUrl, setCopyrightUrl] = useState(
    "https://platform.youversion.com/"
  );
  const [showFullCopyright, setShowFullCopyright] = useState(false);
  const [reading, setReading] = useState(false);
  const [voiceMenuOpen, setVoiceMenuOpen] = useState(false);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.85);
  const continueReadingRef = useRef(false);
  const pendingAutoSpeakRef = useRef(false);
  const speakTokenRef = useRef(0);

  const libraryId = libraryBookIdFor(bookId);
  const book = getCatalogBook(bookId, books);
  const libraryChapter = getChapter(libraryId, chapter);
  const genesisMeta =
    libraryId === "genesis" ? getGenesisChapter(chapter) : undefined;
  const webtoon = getWebtoonEpisode(libraryId, chapter);

  const comicPeek = useMemo(() => {
    if (webtoon?.panels?.[0]) {
      const panel = webtoon.panels[0];
      return {
        image: panel.image,
        caption: panel.bubble?.text,
        audioText: getPanelAudioText(panel),
        count: webtoon.panels.length,
        storylineId: webtoon.storylineId,
      };
    }
    if (libraryChapter?.panels?.[0]) {
      const panel = libraryChapter.panels[0];
      return {
        image: panel.image,
        caption: panel.caption,
        audioText: `${panel.title}. ${panel.caption}`,
        count: libraryChapter.panels.length,
        storylineId: undefined as string | undefined,
      };
    }
    return null;
  }, [libraryChapter?.panels, webtoon]);

  const chapterTitle =
    webtoon?.title ??
    genesisMeta?.title ??
    libraryChapter?.title ??
    `${book?.name ?? "Bible"} ${chapter}`;

  useEffect(() => {
    let cancelled = false;
    void loadSelectedBibleSource().then((saved) => {
      if (cancelled) {
        return;
      }
      const next = normalizeBibleSource(saved);
      setSource(next);
      if (!saved || saved.kind !== next.kind) {
        void saveSelectedBibleSource(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const versionId =
      source.kind === "youversion"
        ? source.versionId
        : DEFAULT_YOUVERSION_VERSION_ID;

    setBooksLoading(true);
    void fetchBibleBooksForVersion(versionId)
      .then((nextBooks) => {
        if (cancelled) {
          return;
        }
        setBooks(nextBooks);
        const stillValid = nextBooks.some(
          (item) => item.usfm === bookId || item.id === bookId
        );
        if (!stillValid && nextBooks[0]) {
          setBookId(nextBooks[0].usfm);
          setChapter(1);
        } else {
          const current = nextBooks.find(
            (item) => item.usfm === bookId || item.id === bookId
          );
          if (current && chapter > current.chapters) {
            setChapter(current.chapters);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBooks(CATALOG_BOOKS);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setBooksLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // Intentionally depend on version, not book/chapter (those adjust inside).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const loadPassage = useCallback(async () => {
    const query = passageQueryFor(bookId, chapter, books);
    setLoading(true);
    setError(null);
    setShowFullCopyright(false);
    try {
      const result = await fetchScriptureChapter(bookId, chapter, source);
      setVerses(result.content);
      setCanonical(result.reference || query);
      setCopyright(result.copyright);
      setCopyrightUrl(result.copyrightUrl);
      if (
        result.source.kind !== source.kind ||
        (result.source.kind === "youversion" &&
          source.kind === "youversion" &&
          result.source.abbreviation !== source.abbreviation)
      ) {
        setSource(result.source);
      }
    } catch (err) {
      if (genesisMeta) {
        setCanonical(genesisMeta.passageQuery);
        setVerses(
          `${genesisMeta.keyVerseRef}\n\n${genesisMeta.keyVerseEsV}\n\n${genesisMeta.summary}`
        );
        setCopyright(ESV_COPYRIGHT_NOTICE);
        setCopyrightUrl(ESV_WEBSITE_URL);
        setError(
          "Showing a short offline preview. Add EXPO_PUBLIC_YOUVERSION_APP_KEY to load the full chapter from the Bible API."
        );
      } else {
        setVerses("");
        setCanonical(query);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load passage. Add EXPO_PUBLIC_YOUVERSION_APP_KEY."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [bookId, books, chapter, genesisMeta, source]);

  useFocusEffect(
    useCallback(() => {
      void loadPassage();
      return () => {
        void Speech.stop();
        setReading(false);
      };
    }, [loadPassage])
  );

  useEffect(() => {
    setSelectedSegment(null);
    setSheetOpen(false);
  }, [bookId, chapter, source.abbreviation]);

  useEffect(() => {
    let cancelled = false;
    void listFavorites().then((items) => {
      if (cancelled || !verses.trim()) {
        return;
      }
      const segs = splitScriptureSegments(verses);
      const applied: AppliedHighlight[] = [];
      for (const item of items) {
        if (
          item.kind !== "bible_highlight" ||
          item.bookId !== libraryId ||
          item.chapterNumber !== chapter ||
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
  }, [chapter, libraryId, verses]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void loadSpeechPreferences().then((prefs) => {
        if (!cancelled) {
          setVoiceId(prefs.voiceId);
          setSpeechRate(prefs.rate);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const stopReading = useCallback(() => {
    continueReadingRef.current = false;
    pendingAutoSpeakRef.current = false;
    speakTokenRef.current += 1;
    void Speech.stop();
    setReading(false);
  }, []);

  const nextPassage = useCallback(() => {
    if (!book) {
      return null;
    }
    if (chapter < book.chapters) {
      return { bookId, chapter: chapter + 1 };
    }
    const index = books.findIndex(
      (item) => item.usfm === bookId || item.id === bookId
    );
    const following = index >= 0 ? books[index + 1] : undefined;
    if (!following) {
      return null;
    }
    return { bookId: following.usfm, chapter: 1 };
  }, [book, bookId, books, chapter]);

  const speakCurrentChapter = useCallback(() => {
    const body = verses.trim();
    if (!body || loading) {
      return;
    }
    const token = ++speakTokenRef.current;
    setReading(true);
    const title = canonical || passageQueryFor(bookId, chapter, books);
    Speech.speak(`${title}. ${body}`, {
      ...speechSpeakOptions({ voiceId, rate: speechRate }),
      onDone: () => {
        if (token !== speakTokenRef.current) {
          return;
        }
        if (!continueReadingRef.current) {
          setReading(false);
          return;
        }
        const next = nextPassage();
        if (!next) {
          continueReadingRef.current = false;
          setReading(false);
          return;
        }
        pendingAutoSpeakRef.current = true;
        setBookId(next.bookId);
        setChapter(next.chapter);
      },
      onStopped: () => {
        if (token === speakTokenRef.current && !continueReadingRef.current) {
          setReading(false);
        }
      },
      onError: () => {
        if (token === speakTokenRef.current) {
          continueReadingRef.current = false;
          pendingAutoSpeakRef.current = false;
          setReading(false);
        }
      },
    });
  }, [
    bookId,
    books,
    canonical,
    chapter,
    loading,
    nextPassage,
    speechRate,
    verses,
    voiceId,
  ]);

  // After a finished chapter auto-advances, speak the newly loaded passage.
  useEffect(() => {
    if (!pendingAutoSpeakRef.current || loading || !verses.trim()) {
      return;
    }
    pendingAutoSpeakRef.current = false;
    speakCurrentChapter();
  }, [bookId, chapter, loading, speakCurrentChapter, verses]);

  const readAloud = () => {
    if (reading || continueReadingRef.current) {
      stopReading();
      return;
    }
    if (!verses.trim()) {
      return;
    }
    continueReadingRef.current = true;
    speakCurrentChapter();
  };

  /** Cycle 0.7x → 0.85x → 1x → 1.15x → 1.3x → … (same pattern as Guide 1x). */
  const cycleSpeed = () => {
    const next = nextSpeechRate(speechRate, 1);
    // Wrap past the last rate back to the slowest.
    const atEnd =
      Math.abs(speechRate - SPEECH_RATES[SPEECH_RATES.length - 1]) < 0.01;
    const rate = atEnd ? SPEECH_RATES[0] : next;
    setSpeechRate(rate);
    void saveSpeechRate(rate);
    if (continueReadingRef.current || reading) {
      const keepGoing = continueReadingRef.current;
      speakTokenRef.current += 1;
      void Speech.stop();
      continueReadingRef.current = keepGoing;
      setTimeout(() => {
        if (keepGoing) {
          speakCurrentChapter();
        }
      }, 80);
    }
  };

  const goChapter = (delta: number) => {
    if (!book) {
      return;
    }
    const next = chapter + delta;
    if (next < 1 || next > book.chapters) {
      return;
    }
    stopReading();
    setChapter(next);
  };

  const openFullComic = () => {
    if (!comicPeek) {
      return;
    }
    navigation.navigate("WebtoonEpisode", {
      bookId: libraryId,
      chapterNumber: chapter,
      storylineId: comicPeek.storylineId,
    });
  };

  const shortCopyright =
    copyright.length > 90 ? `${copyright.slice(0, 87).trim()}…` : copyright;

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: readerColors.bg }}
    >
      <View className="flex-1">
      <View className="flex-row items-center justify-between px-3 pb-2 pt-1">
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose book and chapter"
            onPress={() => setPickerOpen(true)}
            className="flex-row items-center rounded-full px-3 py-2"
            style={{ backgroundColor: readerColors.elevated }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: readerColors.text }}
            >
              {book?.name ?? "Bible"} {chapter}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={20}
              color={readerColors.text}
              style={{ marginLeft: 2 }}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Bible version ${source.abbreviation}`}
            onPress={() => setVersionOpen(true)}
            className="flex-row items-center rounded-full px-3 py-2"
            style={{ backgroundColor: readerColors.elevated }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: readerColors.text }}
            >
              {source.abbreviation}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={20}
              color={readerColors.text}
              style={{ marginLeft: 2 }}
            />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-1">
          <IconButton
            name="record-voice-over"
            label="Choose narrator voice"
            onPress={() => setVoiceMenuOpen((open) => !open)}
            active={voiceMenuOpen}
          />
          <IconButton
            name={reading ? "stop" : "volume-up"}
            label={
              reading
                ? "Stop reading"
                : "Read aloud and continue through following chapters"
            }
            onPress={readAloud}
            active={reading}
          />
          <IconButton
            name="search"
            label="Search scripture"
            onPress={() => setSearchOpen(true)}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Premise comic at the very top — story before the scroll of text */}
        {comicPeek ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open full comic storyline"
            onPress={openFullComic}
            style={{
              width,
              backgroundColor: readerColors.surface,
            }}
          >
            <PremiseHeroImage
              source={comicPeek.image}
              width={width}
              accessibilityLabel={comicPeek.caption ?? chapterTitle}
            />
            <View
              className="flex-row items-center justify-between px-4 py-2.5"
              style={{ backgroundColor: readerColors.elevated }}
            >
              <View className="flex-1 pr-3">
                <Text
                  className="text-[10px] font-bold uppercase tracking-[1.5px]"
                  style={{ color: readerColors.accentSoft }}
                >
                  Story premise
                </Text>
                <Text
                  className="mt-0.5 text-sm font-semibold"
                  style={{ color: readerColors.text }}
                  numberOfLines={2}
                >
                  {comicPeek.caption ?? `Open comic · ${comicPeek.count} scenes`}
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={22}
                color={readerColors.accent}
              />
            </View>
          </Pressable>
        ) : null}

        <View className="px-5 pb-4 pt-3">
          <Text
            className="mb-1 text-xs font-semibold uppercase tracking-[1.5px]"
            style={{ color: readerColors.accentSoft }}
          >
            {canonical || passageQueryFor(bookId, chapter, books)}
          </Text>
          <Text
            className="mb-4 text-[22px] font-bold leading-7"
            style={{ color: readerColors.text }}
          >
            {chapterTitle}
          </Text>

          {loading ? (
            <View className="items-center py-12">
              <ActivityIndicator color={readerColors.accent} />
              <Text
                className="mt-3 text-sm"
                style={{ color: readerColors.secondary }}
              >
                Loading…
              </Text>
            </View>
          ) : (
            <>
              {error ? (
                <Text
                  className="mb-3 text-xs leading-4"
                  style={{ color: readerColors.warn }}
                >
                  {error}
                </Text>
              ) : null}
              <SelectableScripture
                text={
                  verses ||
                  "Add EXPO_PUBLIC_YOUVERSION_APP_KEY to load full chapter text from the Bible API."
                }
                selectedId={selectedSegment?.id ?? null}
                highlights={appliedHighlights}
                onSelect={(segment) => {
                  setSelectedSegment(segment);
                  setSheetOpen(true);
                }}
              />
            </>
          )}

          <Pressable
            accessibilityRole="button"
            className="mt-5"
            onPress={() => {
              if (copyright.length > 90) {
                setShowFullCopyright((value) => !value);
              } else {
                void Linking.openURL(copyrightUrl);
              }
            }}
          >
            <Text
              className="text-center text-[11px] leading-4"
              style={{ color: readerColors.faint }}
            >
              {showFullCopyright ? copyright : shortCopyright}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Docked above Home/Bible/Plans/More — not floating over scripture */}
      <View
        accessibilityRole="toolbar"
        accessibilityLabel="Bible audio controls"
        className="border-t px-3 pt-2 pb-2"
        style={{
          backgroundColor: readerColors.elevated,
          borderTopColor: readerColors.border,
        }}
      >
        <VoiceCarousel
          visible={voiceMenuOpen}
          selectedVoiceId={voiceId}
          accentColor={readerColors.accent}
          surfaceColor={readerColors.surface}
          textColor={readerColors.text}
          mutedColor={readerColors.secondary}
          onSelect={(nextId) => {
            setVoiceId(nextId);
            void saveSpeechVoiceId(nextId);
          }}
        />

        <View className="flex-row items-center justify-between gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose narrator voice"
            accessibilityState={{ expanded: voiceMenuOpen }}
            accessibilityHint="Shows a swipeable list of narrator voices"
            onPress={() => setVoiceMenuOpen((open) => !open)}
            className="items-center justify-center rounded-full"
            style={{
              minWidth: MIN_TOUCH_TARGET,
              minHeight: MIN_TOUCH_TARGET,
              backgroundColor: voiceMenuOpen
                ? readerColors.accent
                : readerColors.surface,
            }}
          >
            <MaterialIcons
              name="record-voice-over"
              size={22}
              color={voiceMenuOpen ? "#FFFFFF" : readerColors.text}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous chapter"
            onPress={() => goChapter(-1)}
            className="items-center justify-center rounded-full"
            style={{
              minWidth: MIN_TOUCH_TARGET,
              minHeight: MIN_TOUCH_TARGET,
              backgroundColor: readerColors.surface,
            }}
          >
            <MaterialIcons
              name="chevron-left"
              size={28}
              color={readerColors.text}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              reading
                ? "Stop continuous reading"
                : "Play and keep reading following chapters"
            }
            accessibilityHint={
              reading
                ? "Stops read aloud"
                : "Reads this chapter, then continues to the next chapters"
            }
            onPress={readAloud}
            className="items-center justify-center rounded-full"
            style={{
              width: 56,
              height: 56,
              backgroundColor: readerColors.accent,
            }}
          >
            <MaterialIcons
              name={reading ? "pause" : "play-arrow"}
              size={32}
              color="#FFFFFF"
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next chapter"
            onPress={() => goChapter(1)}
            className="items-center justify-center rounded-full"
            style={{
              minWidth: MIN_TOUCH_TARGET,
              minHeight: MIN_TOUCH_TARGET,
              backgroundColor: readerColors.surface,
            }}
          >
            <MaterialIcons
              name="chevron-right"
              size={28}
              color={readerColors.text}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Playback speed ${formatSpeechRate(speechRate)}. Tap to change.`}
            accessibilityHint="Cycles through slower and faster reading speeds"
            onPress={cycleSpeed}
            className="items-center justify-center rounded-full px-3"
            style={{
              minWidth: MIN_TOUCH_TARGET,
              minHeight: MIN_TOUCH_TARGET,
              backgroundColor: readerColors.surface,
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: readerColors.text }}
            >
              {formatSpeechRate(speechRate)}
            </Text>
          </Pressable>
        </View>

        {reading ? (
          <Text
            accessibilityLiveRegion="polite"
            className="mt-1.5 text-center text-[10px] font-semibold"
            style={{ color: readerColors.secondary }}
          >
            Reading · continues to next chapters until you stop
          </Text>
        ) : null}
      </View>
      </View>

      <ScripturePickerModal
        visible={pickerOpen}
        bookId={bookId}
        chapter={chapter}
        books={books}
        loading={booksLoading}
        onClose={() => setPickerOpen(false)}
        onSelect={(nextBookId, nextChapter) => {
          stopReading();
          setBookId(nextBookId);
          setChapter(nextChapter);
        }}
      />
      <BibleSearchModal
        visible={searchOpen}
        books={books}
        onClose={() => setSearchOpen(false)}
        onJump={(nextBookId, nextChapter) => {
          stopReading();
          setBookId(nextBookId);
          setChapter(nextChapter);
        }}
      />
      <VersionPickerModal
        visible={versionOpen}
        selected={source}
        onClose={() => setVersionOpen(false)}
        onSelect={(next) => {
          stopReading();
          setSource(next);
          void saveSelectedBibleSource(next);
        }}
      />
      <SelectionActionSheet
        visible={sheetOpen && Boolean(selectedSegment)}
        selectedText={selectedSegment?.text ?? ""}
        selectionLabel={`${book?.name ?? "Bible"} ${chapter}`}
        bookId={libraryId}
        chapterNumber={chapter}
        scriptureRef={canonical || passageQueryFor(bookId, chapter, books)}
        versionLabel={source.abbreviation}
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

    </SafeAreaView>
  );
}

function IconButton({
  name,
  label,
  onPress,
  active,
}: {
  name: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const readerColors = useReaderColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="ml-1 h-10 w-10 items-center justify-center rounded-full"
      style={{
        backgroundColor: active ? readerColors.accent : "transparent",
      }}
      hitSlop={6}
    >
      <MaterialIcons name={name} size={22} color={readerColors.text} />
    </Pressable>
  );
}
