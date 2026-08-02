import { useEffect, useMemo, useRef, useState } from "react";
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
import AudioGuidePlayer from "../components/player/AudioGuidePlayer";
import { getBook, getChapter } from "../data/library";
import type { RootStackParamList } from "../navigation/types";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const duration = chapter?.guide.durationSeconds ?? 0;

  const activePanelIndex = useMemo(() => {
    if (!chapter || duration <= 0) {
      return 0;
    }
    const segment = duration / Math.max(chapter.panels.length, 1);
    return Math.min(
      chapter.panels.length - 1,
      Math.floor(position / segment)
    );
  }, [chapter, duration, position]);

  const activeScriptIndex = useMemo(() => {
    if (!chapter || duration <= 0) {
      return 0;
    }
    const segment = duration / Math.max(chapter.guide.script.length, 1);
    return Math.min(
      chapter.guide.script.length - 1,
      Math.floor(position / segment)
    );
  }, [chapter, duration, position]);

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
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPosition((current) => {
          if (current >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return current + 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [duration, isPlaying]);

  useEffect(() => {
    setIsPlaying(false);
    setPosition(0);
  }, [bookId, chapterNumber]);

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
  const nextChapter = book.chapters.find((item) => item.number === chapterNumber + 1);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-teal-deep/10 px-4 py-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            className="px-1 py-1"
          >
            <Text className="text-lg text-teal-ink">↓</Text>
          </Pressable>
          <Text className="text-base font-bold text-teal-ink">
            {book.name} {chapter.number}
          </Text>
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
          <Text className="mb-4 text-2xl font-bold text-teal-ink">
            {chapter.title}
          </Text>

          <ChapterComicPanels
            panels={chapter.panels}
            activeIndex={activePanelIndex}
          />

          <View className="mb-5 rounded-2xl bg-parchment px-4 py-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-deep">
              Audio guide narration
            </Text>
            {chapter.guide.script.map((line, index) => (
              <Text
                key={`${chapter.number}-${index}`}
                className={`mb-2 text-sm leading-5 ${
                  index === activeScriptIndex
                    ? "font-semibold text-teal-ink"
                    : "text-parchment-ink/55"
                }`}
              >
                {line}
              </Text>
            ))}
          </View>

          <Text className="mb-2 text-xl font-bold text-teal-ink">
            {passage?.canonical ?? chapter.passageQuery}
          </Text>

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#1A5F61" />
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
              onPress={() =>
                navigation.replace("ChapterPlayer", {
                  bookId: book.id,
                  chapterNumber: nextChapter.number,
                })
              }
            >
              <Text className="text-sm font-bold text-teal-ink">
                Next chapter → {nextChapter.title}
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
          position={position}
          duration={duration}
          isPlaying={isPlaying}
          onToggle={() => setIsPlaying((value) => !value)}
          onSkip={(delta) =>
            setPosition((current) =>
              Math.min(duration, Math.max(0, current + delta))
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}
