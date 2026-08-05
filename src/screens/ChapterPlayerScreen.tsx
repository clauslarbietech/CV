import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Speech from "expo-speech";
import ReadAloudButton from "../components/accessibility/ReadAloudButton";
import ChapterPremiseComics, {
  uniqueComicPanels,
} from "../components/comics/ChapterPremiseComics";
import EmotionalStoryboard from "../components/comics/EmotionalStoryboard";
import AudioGuidePlayer from "../components/player/AudioGuidePlayer";
import VoiceReflectionRecorder from "../components/player/VoiceReflectionRecorder";
import { getBook, getChapter } from "../data/library";
import { getWebtoonEpisode } from "../data/webtoonEpisodes";
import { useAudioGuideSession } from "../hooks/useAudioGuideSession";
import { useVoiceReflection } from "../hooks/useVoiceReflection";
import type { RootStackParamList } from "../navigation/types";
import {
  getChapterProgress,
  updateChapterProgress,
  type ChapterProgress,
} from "../services/listeningProgress";
import {
  fetchScriptureChapter,
  getDefaultBibleSource,
} from "../services/scriptureService";

type Props = NativeStackScreenProps<RootStackParamList, "ChapterPlayer">;

type PassageState = {
  canonical: string;
  content: string;
  copyright: string;
  copyrightUrl: string;
};

export default function ChapterPlayerScreen({ navigation, route }: Props) {
  const { bookId, chapterNumber } = route.params;
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
  const [readingScripture, setReadingScripture] = useState(false);
  const [scriptureExpanded, setScriptureExpanded] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);

  const audio = useAudioGuideSession({
    guide: chapter?.guide,
    chapterKey: `${bookId}:${chapterNumber}`,
  });

  const reflection = useVoiceReflection({ bookId, chapterNumber });

  const displayPanels = useMemo(
    () => (chapter ? uniqueComicPanels(chapter.panels) : []),
    [chapter]
  );

  const activePanelIndex = useMemo(() => {
    if (!chapter || audio.duration <= 0 || displayPanels.length === 0) {
      return 0;
    }
    const segment = audio.duration / Math.max(displayPanels.length, 1);
    return Math.min(
      displayPanels.length - 1,
      Math.floor(audio.position / segment)
    );
  }, [audio.duration, audio.position, chapter, displayPanels.length]);

  const activeNarration = useMemo(() => {
    if (!chapter?.guide.script.length) {
      return undefined;
    }
    const line =
      chapter.guide.script[audio.activeLineIndex] ?? chapter.guide.script[0];
    return line;
  }, [audio.activeLineIndex, chapter]);

  useEffect(() => {
    if (!chapter) {
      return;
    }

    let cancelled = false;

    async function loadPassage() {
      setLoading(true);
      setError(null);
      setScriptureExpanded(false);
      try {
        const result = await fetchScriptureChapter(
          bookId,
          chapterNumber,
          getDefaultBibleSource()
        );
        if (!cancelled) {
          setPassage({
            canonical: result.reference,
            content: result.content,
            copyright: result.copyright,
            copyrightUrl: result.copyrightUrl,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load scripture. Add EXPO_PUBLIC_YOUVERSION_APP_KEY."
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
  }, [bookId, chapter, chapterNumber]);

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      const saved = await getChapterProgress(bookId, chapterNumber);
      if (!cancelled) {
        setProgress(saved);
      }
    }

    void loadProgress();
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

  const verses = passage?.content.trim() ?? "";
  const webtoon = getWebtoonEpisode(bookId, chapterNumber);

  const toggleScriptureReadAloud = () => {
    if (readingScripture) {
      void Speech.stop();
      setReadingScripture(false);
      return;
    }
    const text = verses.trim();
    if (!text) {
      return;
    }
    void audio.stop();
    setReadingScripture(true);
    const intro = passage?.canonical
      ? `${passage.canonical}. `
      : `${chapter?.passageQuery ?? ""}. `;
    Speech.speak(`${intro}${text}`, {
      rate: 0.88,
      onDone: () => setReadingScripture(false),
      onStopped: () => setReadingScripture(false),
      onError: () => setReadingScripture(false),
    });
  };

  if (!book || !chapter) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-night-bg">
        <Text className="text-base text-terracotta-dark">
          Chapter not found.
        </Text>
      </SafeAreaView>
    );
  }

  const nextChapter = book.chapters.find(
    (item) => item.number === chapterNumber + 1
  );

  const goNextChapter = () => {
    if (!nextChapter) {
      return;
    }
    void audio.stop();
    void Speech.stop();
    setReadingScripture(false);
    navigation.replace("ChapterPlayer", {
      bookId: book.id,
      chapterNumber: nextChapter.number,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-night-border px-4 py-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void audio.stop();
              void Speech.stop();
              setReadingScripture(false);
              navigation.goBack();
            }}
            className="px-1 py-1"
          >
            <Text className="text-lg text-night-text">↓</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-base font-bold text-night-text">
              {book.name} {chapter.number}
            </Text>
            <Text className="text-[11px] text-night-muted">
              Premise first · scripture on tap
            </Text>
          </View>
          <View className="rounded-full bg-night-elevated px-2.5 py-1">
            <Text className="text-xs font-bold text-night-text">Bible</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Comic premise at the very top of the Bible chapter view */}
          {chapter.number === 3 ? (
            <View className="px-5 pt-4">
              <EmotionalStoryboard
                panels={displayPanels}
                activeIndex={activePanelIndex}
                title="Emotional storyboard"
                subtitle="The Fall — scene by scene"
              />
            </View>
          ) : (
            <ChapterPremiseComics
              panels={displayPanels}
              activeIndex={activePanelIndex}
              chapterTitle={chapter.title}
              premise={
                displayPanels[0]?.caption ??
                chapter.guide.script[1] ??
                chapter.guide.script[0] ??
                ""
              }
              activeNarration={activeNarration}
            />
          )}

          <View className="px-5">
            {webtoon ? (
              <Pressable
                accessibilityRole="button"
                className="mb-4 rounded-2xl border border-terracotta/40 bg-night-card px-4 py-3"
                onPress={() => {
                  void audio.stop();
                  navigation.navigate("WebtoonEpisode", {
                    bookId,
                    chapterNumber,
                    storylineId: webtoon.storylineId,
                  });
                }}
              >
                <Text className="text-xs font-bold uppercase tracking-[2px] text-terracotta">
                  {webtoon.seriesTitle} · {webtoon.episodeLabel}
                </Text>
                <Text className="mt-1 text-base font-bold text-night-text">
                  Open full webtoon →
                </Text>
              </Pressable>
            ) : null}

            {nextChapter ? (
              <Pressable
                accessibilityRole="button"
                className="mb-4 items-center rounded-full bg-terracotta px-4 py-3"
                onPress={goNextChapter}
              >
                <Text className="text-sm font-bold text-white">
                  Next chapter → {nextChapter.title}
                </Text>
              </Pressable>
            ) : null}

            <View className="mb-4 overflow-hidden rounded-2xl border border-night-border bg-night-card">
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: scriptureExpanded }}
                className="flex-row items-center justify-between px-4 py-3"
                onPress={() => setScriptureExpanded((open) => !open)}
              >
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold uppercase tracking-[1.5px] text-ochre-soft">
                    Full scripture
                  </Text>
                  <Text className="mt-0.5 text-base font-bold text-night-text">
                    {passage?.canonical ?? chapter.passageQuery}
                  </Text>
                  <Text className="mt-0.5 text-xs text-night-muted">
                    {scriptureExpanded
                      ? "Tap to collapse"
                      : "Tap to expand and read the chapter"}
                  </Text>
                </View>
                <Text className="text-lg text-night-text">
                  {scriptureExpanded ? "▴" : "▾"}
                </Text>
              </Pressable>

              {scriptureExpanded ? (
                <View className="border-t border-night-border px-4 py-3">
                  {loading ? (
                    <View className="items-center py-6">
                      <ActivityIndicator size="large" color="#E4572E" />
                      <Text className="mt-3 text-sm text-night-muted">
                        Fetching {chapter.passageQuery}…
                      </Text>
                    </View>
                  ) : error ? (
                    <View className="py-2">
                      <Text className="mb-2 text-base font-semibold text-terracotta-dark">
                        Could not load passage
                      </Text>
                      <Text className="text-sm leading-5 text-night-muted">
                        {error}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <View className="mb-3">
                        <ReadAloudButton
                          isPlaying={readingScripture}
                          label={
                            readingScripture
                              ? "Stop reading scripture"
                              : "Read scripture aloud"
                          }
                          onPress={toggleScriptureReadAloud}
                        />
                      </View>
                      <Text className="text-base leading-7 text-night-text">
                        {verses}
                      </Text>
                    </>
                  )}
                </View>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              className="mb-4 rounded-2xl border border-night-border bg-night-elevated px-4 py-3"
              onPress={() => setReflectionOpen((open) => !open)}
            >
              <Text className="text-sm font-bold text-night-text">
                {reflectionOpen ? "Hide voice reflection" : "Voice reflection"}
              </Text>
              <Text className="mt-0.5 text-xs text-night-muted">
                Optional · record a short prayer or takeaway
              </Text>
            </Pressable>

            {reflectionOpen ? (
              <VoiceReflectionRecorder
                isRecording={reflection.isRecording}
                durationMillis={reflection.durationMillis}
                hasReflection={Boolean(reflection.reflectionUri)}
                isPlayingReflection={reflection.isPlayingReflection}
                permissionDenied={reflection.permissionDenied}
                isBusy={reflection.isBusy}
                onStart={() => {
                  void reflection.startRecording();
                }}
                onStop={() => {
                  void reflection.stopRecording();
                }}
                onPlayToggle={reflection.togglePlayback}
                onClear={() => {
                  void reflection.clearReflection();
                }}
              />
            ) : null}

            <Pressable
              accessibilityRole="link"
              className="mt-2"
              onPress={() => {
                void Linking.openURL(
                  passage?.copyrightUrl ?? "https://platform.youversion.com/"
                );
              }}
            >
              <Text className="text-center text-[10px] leading-4 text-night-soft">
                {passage?.copyright ??
                  "Add EXPO_PUBLIC_YOUVERSION_APP_KEY to load scripture from the Bible API."}
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <AudioGuidePlayer
          title={chapter.guide.title}
          narrator={chapter.guide.narrator}
          position={audio.position}
          duration={audio.duration}
          isPlaying={audio.isPlaying}
          speed={audio.speed}
          downloaded={progress.downloaded}
          favorite={progress.favorite}
          completed={progress.completed}
          onToggle={audio.toggle}
          onSkip={audio.skip}
          onCycleSpeed={() => {
            void audio.cycleSpeed();
          }}
          onToggleFavorite={() => {
            void updateChapterProgress(bookId, chapterNumber, {
              favorite: !progress.favorite,
            }).then(setProgress);
          }}
          onToggleComplete={() => {
            void updateChapterProgress(bookId, chapterNumber, {
              completed: !progress.completed,
            }).then(setProgress);
          }}
          onDownload={() => {
            void updateChapterProgress(bookId, chapterNumber, {
              downloaded: true,
            }).then(setProgress);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
