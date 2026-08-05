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
import AppTabBar from "../components/navigation/AppTabBar";
import {
  getPanelAudioText,
  getWebtoonEpisode,
  type WebtoonPanel,
} from "../data/webtoonEpisodes";
import { getBook } from "../data/library";
import HighlightModal from "../components/favorites/HighlightModal";
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
  const [highlightOpen, setHighlightOpen] = useState(false);

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
      <View className="flex-1">
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
        <View className="px-4 py-4">
          <View className="mt-1">
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

      <View className="items-center border-t border-white/10 bg-black py-2">
        <View className="mb-1 w-full max-w-sm flex-row items-center justify-center gap-2 px-4">
          <View className="flex-row items-center rounded-full bg-white/10 px-4 py-2">
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Highlight or save a note on this scene"
            className="flex-row items-center rounded-full bg-terracotta px-3 py-2"
            onPress={() => setHighlightOpen(true)}
          >
            <MaterialIcons name="auto-awesome" size={16} color="#FFFFFF" />
            <Text className="ml-1.5 text-xs font-bold text-white">
              Highlight
            </Text>
          </Pressable>
        </View>
      </View>

      <AppTabBar activeTab="Home" />

      <HighlightModal
        visible={highlightOpen}
        kind="story_highlight"
        bookId={bookId}
        chapterNumber={chapterNumber}
        storylineId={episode.storylineId}
        defaultExcerpt={
          episode.panels[activeIndex]?.bubble?.text ??
          episode.panels[activeIndex]?.scriptureText ??
          episode.title
        }
        scriptureRef={episode.panels[activeIndex]?.scriptureRef}
        onClose={() => setHighlightOpen(false)}
      />
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
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Collapse when leaving the scene so the next panel starts compact.
    if (!active) {
      setExpanded(false);
    }
  }, [active]);

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
      ? "bg-night-elevated/95"
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

  const previewText = panel.bubble?.text?.trim() ?? "";
  const fullScripture = panel.scriptureText?.trim() ?? "";
  const hasMoreText =
    Boolean(fullScripture) &&
    fullScripture.replace(/\s+/g, " ") !== previewText.replace(/\s+/g, " ") &&
    fullScripture.length > previewText.length + 8;

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
                {panel.scriptureRef ? ` · ${panel.scriptureRef}` : ""}
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

            <Text
              className={`text-sm leading-5 ${textClass}`}
              numberOfLines={expanded ? undefined : 3}
            >
              {expanded && fullScripture ? fullScripture : previewText}
            </Text>

            {hasMoreText || previewText.length > 90 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  expanded ? "Show less text" : "Expand to read more"
                }
                accessibilityState={{ expanded }}
                onPress={() => setExpanded((value) => !value)}
                className="mt-2 items-center pt-1"
                hitSlop={8}
              >
                <View
                  className={`mb-1 h-1 w-8 rounded-full ${
                    iconOnLight ? "bg-parchment-ink/25" : "bg-white/30"
                  }`}
                />
                <MaterialIcons
                  name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={26}
                  color={iconOnLight ? "#E4572E" : "#F0D78C"}
                />
                <Text
                  className={`text-[10px] font-semibold ${
                    iconOnLight ? "text-terracotta" : "text-ochre-soft"
                  }`}
                >
                  {expanded ? "Show less" : "Tap to read more"}
                </Text>
              </Pressable>
            ) : null}

            {!expanded && panel.scriptureRef ? (
              <Text
                className={`mt-1 text-[10px] ${
                  iconOnLight ? "text-parchment-ink/55" : "text-white/55"
                }`}
              >
                Tap the speaker to hear {panel.scriptureRef}
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
