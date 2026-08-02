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
import ChapterComicPanels from "../components/comics/ChapterComicPanels";
import EmotionalStoryboard from "../components/comics/EmotionalStoryboard";
import AudioGuidePlayer from "../components/player/AudioGuidePlayer";
import VoiceReflectionRecorder from "../components/player/VoiceReflectionRecorder";
import { getBook, getChapter } from "../data/library";
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

  if (!book || !chapter) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-terracotta-dark">
          Chapter not found.
        </Text>
      </SafeAreaView>
    );
  }

  const verses = passage?.passages.join("\n\n").trim() ?? "";
  const nextChapter = book.chapters.find(
    (item) => item.number === chapterNumber + 1
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-teal-deep/10 px-4 py-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void audio.stop();
              navigation.goBack();
            }}
            className="px-1 py-1"
          >
            <Text className="text-lg text-teal-ink">↓</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-base font-bold text-teal-ink">
              {book.name} {chapter.number}
            </Text>
            <Text className="text-[11px] text-parchment-ink/55">
              Bible on screen · guide in headphones
            </Text>
          </View>
          <View className="rounded-full bg-teal-mist px-2.5 py-1">
            <Text className="text-xs font-bold text-teal-ink">ESV</Text>
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
          <Text className="mb-1 text-2xl font-bold text-teal-ink">
            {chapter.title}
          </Text>
          <Text className="mb-4 text-sm text-parchment-ink/65">
            ~10 minute habit · tap play and follow the comics + scripture
          </Text>

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

          <View className="mb-5 rounded-2xl bg-parchment px-4 py-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-deep">
              Audio guide narration
            </Text>
            {chapter.guide.script.map((line, index) => (
              <Text
                key={`${chapter.number}-${index}`}
                className={`mb-2 text-sm leading-5 ${
                  index === audio.activeLineIndex
                    ? "font-semibold text-teal-ink"
                    : "text-parchment-ink/55"
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

          <Text className="mb-2 text-xl font-bold text-teal-ink">
            {passage?.canonical ?? chapter.passageQuery}
          </Text>

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#1E3A6E" />
              <Text className="mt-3 text-sm text-teal-deep">
                Fetching {chapter.passageQuery}…
              </Text>
            </View>
          ) : error ? (
            <View className="py-3">
              <Text className="mb-2 text-base font-semibold text-terracotta-dark">
                Could not load passage
              </Text>
              <Text className="text-sm leading-5 text-parchment-ink/80">
                {error}
              </Text>
            </View>
          ) : (
            <Text className="text-base leading-7 text-parchment-ink">
              {verses}
            </Text>
          )}

          {nextChapter ? (
            <Pressable
              accessibilityRole="button"
              className="mt-8 items-center rounded-full border border-teal-deep/20 px-4 py-3"
              onPress={() => {
                void audio.stop();
                navigation.replace("ChapterPlayer", {
                  bookId: book.id,
                  chapterNumber: nextChapter.number,
                });
              }}
            >
              <Text className="text-sm font-bold text-teal-ink">
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
            <Text className="text-center text-[10px] leading-4 text-parchment-ink/60">
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
