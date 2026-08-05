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
import ChapterComicPanels from "../components/comics/ChapterComicPanels";
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
  ESV_COPYRIGHT_NOTICE,
  ESV_WEBSITE_URL,
  fetchPassage,
  type EsvPassage,
} from "../services/esvService";

type Props = NativeStackScreenProps<RootStackParamList, "ChapterPlayer">;

export default function ChapterPlayerScreen({ navigation, route }: Props) {
  const { bookId, chapterNumber } = route.params;
  const book = getBook(bookId);
  const chapter = getChapter(bookId, chapterNumber);

  const [passage, setPassage] = useState<EsvPassage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ChapterProgress>({
    completed: false,
    favorite: false,
    downloaded: false,
    lastPositionSeconds: 0,
  });
  const [readingScripture, setReadingScripture] = useState(false);

  const audio = useAudioGuideSession({
    guide: chapter?.guide,
    chapterKey: `${bookId}:${chapterNumber}`,
  });

  const reflection = useVoiceReflection({ bookId, chapterNumber });

  const activePanelIndex = useMemo(() => {
    if (!chapter || audio.duration <= 0) {
      return 0;
    }
    const segment = audio.duration / Math.max(chapter.panels.length, 1);
    return Math.min(
      chapter.panels.length - 1,
      Math.floor(audio.position / segment)
    );
  }, [audio.duration, audio.position, chapter]);

  useEffect(() => {
    if (!chapter) {
      return;
    }

    const query = chapter.passageQuery;
    let cancelled = false;

    async function loadPassage() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPassage(query);
        if (!cancelled) {
          setPassage(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load scripture."
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
  }, [chapter]);

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
    // Persist sparsely so AsyncStorage writes don't thrash every second.
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

  const verses = passage?.passages.join("\n\n").trim() ?? "";
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
      ? `${passage.canonical}, from the English Standard Version. `
      : `${chapter?.passageQuery ?? ""}, from the English Standard Version. `;
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
              Bible on screen · guide in headphones
            </Text>
          </View>
          <View className="rounded-full bg-night-elevated px-2.5 py-1">
            <Text className="text-xs font-bold text-night-text">ESV</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-8 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-1 text-xs font-semibold uppercase tracking-[2px] text-terracotta">
            {chapter.guide.title}
          </Text>
          <Text className="mb-1 text-2xl font-bold text-night-text">
            {chapter.title}
          </Text>
          <Text className="mb-4 text-sm text-night-muted">
            ~10 minute habit · tap play and follow the comics + scripture
          </Text>

          {webtoon ? (
            <Pressable
              accessibilityRole="button"
              className="mb-4 rounded-2xl bg-teal-ink px-4 py-3"
              onPress={() => {
                void audio.stop();
                navigation.navigate("WebtoonEpisode", {
                  bookId,
                  chapterNumber,
                  storylineId: webtoon.storylineId,
                });
              }}
            >
              <Text className="text-xs font-bold uppercase tracking-[2px] text-ochre-soft">
                {webtoon.seriesTitle} · {webtoon.episodeLabel}
              </Text>
              <Text className="mt-1 text-base font-bold text-white">
                Read webtoon storyline →
              </Text>
              <Text className="mt-1 text-xs text-white/65">
                ESV scenes · dialogue · tap to hear scripture
              </Text>
            </Pressable>
          ) : null}

          {chapter.number === 3 ? (
            <EmotionalStoryboard
              panels={chapter.panels}
              activeIndex={activePanelIndex}
              title="Emotional storyboard"
              subtitle="The Fall — scene by scene"
            />
          ) : (
            <ChapterComicPanels
              panels={chapter.panels}
              activeIndex={activePanelIndex}
            />
          )}

          <View className="mb-5 rounded-2xl bg-night-card px-4 py-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-ochre-soft">
              Audio guide narration
            </Text>
            {chapter.guide.script.map((line, index) => (
              <Text
                key={`${chapter.number}-${index}`}
                className={`mb-2 text-sm leading-5 ${
                  index === audio.activeLineIndex
                    ? "font-semibold text-night-text"
                    : "text-night-soft"
                }`}
              >
                {line}
              </Text>
            ))}
          </View>

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

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-night-text">
              {passage?.canonical ?? chapter.passageQuery}
            </Text>
            {verses ? (
              <ReadAloudButton
                compact
                isPlaying={readingScripture}
                onPress={toggleScriptureReadAloud}
                accessibilityHint="Reads the full ESV chapter text out loud for non-readers"
              />
            ) : null}
          </View>

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#E4572E" />
              <Text className="mt-3 text-sm text-night-muted">
                Fetching {chapter.passageQuery}…
              </Text>
            </View>
          ) : error ? (
            <View className="py-3">
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
                      : "Read ESV scripture aloud"
                  }
                  onPress={toggleScriptureReadAloud}
                />
              </View>
              <Text className="text-base leading-7 text-night-text">
                {verses}
              </Text>
            </>
          )}

          {nextChapter ? (
            <Pressable
              accessibilityRole="button"
              className="mt-8 items-center rounded-full border border-night-border px-4 py-3"
              onPress={() => {
                void audio.stop();
                navigation.replace("ChapterPlayer", {
                  bookId: book.id,
                  chapterNumber: nextChapter.number,
                });
              }}
            >
              <Text className="text-sm font-bold text-night-text">
                Next chapter tomorrow → {nextChapter.title}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            accessibilityRole="link"
            className="mt-6"
            onPress={() => {
              void Linking.openURL(ESV_WEBSITE_URL);
            }}
          >
            <Text className="text-center text-[10px] leading-4 text-night-soft">
              {ESV_COPYRIGHT_NOTICE}
            </Text>
          </Pressable>
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
