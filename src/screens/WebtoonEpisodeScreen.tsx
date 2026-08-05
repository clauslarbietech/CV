import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  Easing,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Speech from "expo-speech";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ReadAloudButton from "../components/accessibility/ReadAloudButton";
import {
  getPanelAudioText,
  getWebtoonEpisode,
  type WebtoonPanel,
} from "../data/webtoonEpisodes";
import { getBook } from "../data/library";
import type { RootStackParamList } from "../navigation/types";
import {
  ESV_COPYRIGHT_NOTICE,
  ESV_WEBSITE_URL,
} from "../services/esvService";

type Props = NativeStackScreenProps<RootStackParamList, "WebtoonEpisode">;

/**
 * Mature anime webtoon storyline reader:
 * full-bleed vertical panels, ESV scripture + dialogue,
 * per-scene Material volume icon read-aloud for non-readers.
 */
export default function WebtoonEpisodeScreen({ navigation, route }: Props) {
  const { bookId, chapterNumber, storylineId } = route.params;
  const episode = getWebtoonEpisode(bookId, chapterNumber, storylineId);
  const book = getBook(bookId);
  const nextChapter = book?.chapters.find(
    (item) => item.number === chapterNumber + 1
  );
  const prevChapter = book?.chapters.find(
    (item) => item.number === chapterNumber - 1
  );
  const { width } = useWindowDimensions();
  const panelHeight = Math.round(width * 1.28);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingPanelId, setPlayingPanelId] = useState<string | null>(null);
  const [isReadingAll, setIsReadingAll] = useState(false);

  const stopAudio = useCallback(() => {
    void Speech.stop();
    setPlayingPanelId(null);
    setIsReadingAll(false);
  }, []);

  useEffect(() => {
    return () => {
      void Speech.stop();
    };
  }, []);

  const playPanel = useCallback((panel: WebtoonPanel) => {
    const text = getPanelAudioText(panel);
    if (!text.trim()) {
      return;
    }
    void Speech.stop();
    setIsReadingAll(false);
    setPlayingPanelId(panel.id);
    Speech.speak(text, {
      rate: 0.88,
      onDone: () => setPlayingPanelId(null),
      onStopped: () => setPlayingPanelId(null),
      onError: () => setPlayingPanelId(null),
    });
  }, []);

  const playStoryline = useCallback(() => {
    if (!episode?.panels.length) {
      return;
    }
    void Speech.stop();
    const lines = episode.panels
      .map((panel) => getPanelAudioText(panel))
      .filter(Boolean);
    if (!lines.length) {
      return;
    }
    setIsReadingAll(true);
    setPlayingPanelId(episode.panels[0].id);
    let i = 0;
    const speakNext = () => {
      if (i >= lines.length || !episode.panels[i]) {
        setPlayingPanelId(null);
        setIsReadingAll(false);
        return;
      }
      setPlayingPanelId(episode.panels[i].id);
      Speech.speak(lines[i], {
        rate: 0.88,
        onDone: () => {
          i += 1;
          speakNext();
        },
        onStopped: () => {
          setPlayingPanelId(null);
          setIsReadingAll(false);
        },
        onError: () => {
          setPlayingPanelId(null);
          setIsReadingAll(false);
        },
      });
    };
    speakNext();
  }, [episode]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const index = Math.max(
        0,
        Math.min(
          (episode?.panels.length ?? 1) - 1,
          Math.round(y / Math.max(panelHeight * 0.85, 1))
        )
      );
      setActiveIndex(index);
    },
    [episode?.panels.length, panelHeight]
  );

  if (!episode) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Storyline not found.</Text>
      </SafeAreaView>
    );
  }

  const anyPlaying = Boolean(playingPanelId);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between border-b border-white/10 px-3 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => {
            stopAudio();
            navigation.goBack();
          }}
          className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View className="mx-2 flex-1 items-center">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-terracotta">
            {episode.seriesTitle} · {episode.episodeLabel}
          </Text>
          <Text
            className="text-center text-base font-bold text-white"
            numberOfLines={1}
          >
            {episode.title}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            anyPlaying ? "Stop reading aloud" : "Read whole storyline aloud"
          }
          onPress={() => {
            if (anyPlaying) {
              stopAudio();
            } else {
              playStoryline();
            }
          }}
          className={`h-10 w-10 items-center justify-center rounded-full ${
            anyPlaying ? "bg-terracotta" : "bg-white/10"
          }`}
          hitSlop={8}
        >
          <MaterialIcons
            name={anyPlaying ? "stop" : "volume-up"}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <View className="px-4 py-5">
          <Text className="text-2xl font-bold text-white">{episode.title}</Text>
          <Text className="mt-1 text-sm text-white/60">{episode.subtitle}</Text>
          <View className="mt-3 flex-row items-center">
            <MaterialIcons name="volume-up" size={16} color="#E4572E" />
            <Text className="ml-1 text-xs uppercase tracking-[1.5px] text-terracotta">
              Tap the speaker to hear every word
            </Text>
          </View>
          <View className="mt-4">
            <ReadAloudButton
              isPlaying={anyPlaying}
              label={
                anyPlaying
                  ? "Stop reading"
                  : "Hear this whole story read aloud"
              }
              onPress={() => {
                if (anyPlaying) {
                  stopAudio();
                } else {
                  playStoryline();
                }
              }}
            />
          </View>
          <Text className="mt-2 text-[11px] leading-4 text-white/45">
            Tap the speaker on each scene to hear the words aloud.
          </Text>
        </View>

        {episode.panels.map((panel, index) => (
          <WebtoonFrame
            key={panel.id}
            panel={panel}
            index={index}
            width={width}
            height={panelHeight}
            active={index === activeIndex}
            isPlaying={playingPanelId === panel.id}
            onPlay={() => {
              if (playingPanelId === panel.id) {
                stopAudio();
              } else {
                playPanel(panel);
              }
            }}
          />
        ))}

        <View className="items-center px-5 py-8">
          <Pressable
            accessibilityRole="button"
            className="mb-3 w-full max-w-sm flex-row items-center justify-center rounded-full bg-terracotta px-5 py-3.5"
            onPress={() => {
              stopAudio();
              navigation.navigate("ChapterPlayer", {
                bookId,
                chapterNumber,
                autoPlay: true,
              });
            }}
          >
            <Text className="text-sm font-bold text-white">
              Continue chapter
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={{ marginLeft: 6 }}
            />
          </Pressable>

          <View className="mb-4 w-full max-w-sm flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              disabled={!prevChapter}
              className={`flex-1 items-center rounded-full px-4 py-3 ${
                prevChapter ? "bg-terracotta" : "bg-white/10"
              }`}
              onPress={() => {
                if (!prevChapter) {
                  return;
                }
                stopAudio();
                navigation.replace("ChapterPlayer", {
                  bookId,
                  chapterNumber: prevChapter.number,
                  autoPlay: true,
                });
              }}
            >
              <Text
                className={`text-sm font-bold ${
                  prevChapter ? "text-white" : "text-white/35"
                }`}
              >
                ← Back
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!nextChapter}
              className={`flex-1 items-center rounded-full px-4 py-3 ${
                nextChapter ? "bg-terracotta" : "bg-white/10"
              }`}
              onPress={() => {
                if (!nextChapter) {
                  return;
                }
                stopAudio();
                navigation.replace("ChapterPlayer", {
                  bookId,
                  chapterNumber: nextChapter.number,
                  autoPlay: true,
                });
              }}
            >
              <Text
                className={`text-sm font-bold ${
                  nextChapter ? "text-white" : "text-white/35"
                }`}
              >
                Next →
              </Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="link"
            onPress={() => {
              void Linking.openURL(ESV_WEBSITE_URL);
            }}
          >
            <Text className="text-center text-[10px] leading-4 text-white/40">
              {ESV_COPYRIGHT_NOTICE}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View className="absolute bottom-4 left-0 right-0 items-center">
        <View className="flex-row items-center rounded-full bg-black/70 px-4 py-2">
          {playingPanelId ? (
            <MaterialIcons
              name="volume-up"
              size={14}
              color="#F0D78C"
              style={{ marginRight: 6 }}
            />
          ) : null}
          <Text className="text-xs font-semibold text-white/85">
            Scene {activeIndex + 1} / {episode.panels.length}
            {playingPanelId ? " · Reading aloud…" : ""}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function WebtoonFrame({
  panel,
  index,
  width,
  height,
  active,
  isPlaying,
  onPlay,
}: {
  panel: WebtoonPanel;
  index: number;
  width: number;
  height: number;
  active: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const focus = useSharedValue(active ? 1 : 0.94);
  const kenBurns = useSharedValue(0);

  useEffect(() => {
    focus.value = withTiming(active ? 1 : 0.94, { duration: 280 });
    if (active) {
      kenBurns.value = 0;
      kenBurns.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: 5200,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0, {
            duration: 5200,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        false
      );
    } else {
      kenBurns.value = withTiming(0, { duration: 400 });
    }
  }, [active, focus, kenBurns]);

  const frameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focus.value, [0.94, 1], [0.78, 1]),
    transform: [{ scale: interpolate(focus.value, [0.94, 1], [0.985, 1]) }],
  }));

  const imageStyle = useAnimatedStyle(() => {
    // Alternate drift direction per panel so consecutive scenes feel distinct.
    const dir = index % 2 === 0 ? 1 : -1;
    return {
      transform: [
        {
          scale: interpolate(kenBurns.value, [0, 1], [1.05, 1.14]),
        },
        {
          translateX: interpolate(kenBurns.value, [0, 1], [0, -10 * dir]),
        },
        {
          translateY: interpolate(kenBurns.value, [0, 1], [0, -6]),
        },
      ],
    };
  });

  const bubbleClass =
    panel.bubble?.tone === "whisper"
      ? "bg-teal-ink/90"
      : panel.bubble?.tone === "dialogue"
        ? "bg-white"
        : panel.bubble?.tone === "scripture"
          ? "bg-ochre/95"
          : "bg-black/75";

  const textClass =
    panel.bubble?.tone === "dialogue" || panel.bubble?.tone === "scripture"
      ? "text-parchment-ink"
      : "text-white";

  const label =
    panel.bubble?.tone === "whisper"
      ? "Whisper"
      : panel.bubble?.tone === "dialogue"
        ? "God spoke"
        : panel.bubble?.tone === "scripture"
          ? panel.scriptureRef ?? "ESV"
          : "Narration";

  const iconOnLight =
    panel.bubble?.tone === "dialogue" || panel.bubble?.tone === "scripture";

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(450)}
      style={[{ width, marginBottom: 10 }, frameStyle]}
    >
      <View style={{ width, height, overflow: "hidden" }}>
        <Animated.View style={[{ width, height }, imageStyle]}>
          <Image
            source={panel.image}
            style={{ width, height }}
            resizeMode="cover"
            accessibilityLabel={
              panel.scriptureText ?? panel.bubble?.text ?? `Scene ${index + 1}`
            }
          />
        </Animated.View>
      </View>

      <View className="absolute right-3 top-3">
        <ReadAloudButton compact isPlaying={isPlaying} onPress={onPlay} />
      </View>

      <View className="absolute bottom-4 left-3 right-3 gap-2">
        {panel.bubble ? (
          <View className={`rounded-2xl px-4 py-3 ${bubbleClass}`}>
            <View className="mb-1 flex-row items-center justify-between">
              <Text
                className={`text-[11px] font-bold uppercase tracking-wide ${
                  iconOnLight ? "text-terracotta" : "text-ochre-soft"
                }`}
              >
                {label}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isPlaying
                    ? "Stop reading this speech"
                    : "Read this speech aloud"
                }
                onPress={onPlay}
                hitSlop={8}
                className="h-8 w-8 items-center justify-center rounded-full bg-black/10"
              >
                <MaterialIcons
                  name={isPlaying ? "stop" : "volume-up"}
                  size={18}
                  color={iconOnLight ? "#E4572E" : "#F0D78C"}
                />
              </Pressable>
            </View>
            <Text className={`text-sm leading-5 ${textClass}`}>
              {panel.bubble.text}
            </Text>
            {panel.scriptureRef ? (
              <Text
                className={`mt-2 text-[10px] ${
                  iconOnLight ? "text-parchment-ink/55" : "text-white/55"
                }`}
              >
                Tap the speaker to hear {panel.scriptureRef} + speech
              </Text>
            ) : null}
          </View>
        ) : (
          <ReadAloudButton
            isPlaying={isPlaying}
            label={
              panel.scriptureRef
                ? `Hear ${panel.scriptureRef} read aloud`
                : "Hear this scene read aloud"
            }
            onPress={onPlay}
          />
        )}
      </View>
    </Animated.View>
  );
}
