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
import Animated, {
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Speech from "expo-speech";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  getPanelAudioText,
  getWebtoonEpisode,
  type WebtoonPanel,
} from "../data/webtoonEpisodes";
import type { RootStackParamList } from "../navigation/types";
import {
  ESV_COPYRIGHT_NOTICE,
  ESV_WEBSITE_URL,
} from "../services/esvService";

type Props = NativeStackScreenProps<RootStackParamList, "WebtoonEpisode">;

/**
 * Mature anime webtoon storyline reader:
 * full-bleed vertical panels, ESV scripture + dialogue, per-scene audio.
 * Family-safe scripture storytelling (Toon Hub–style format).
 */
export default function WebtoonEpisodeScreen({ navigation, route }: Props) {
  const { bookId, chapterNumber, storylineId } = route.params;
  const episode = getWebtoonEpisode(bookId, chapterNumber, storylineId);
  const { width } = useWindowDimensions();
  const panelHeight = Math.round(width * 1.28);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingPanelId, setPlayingPanelId] = useState<string | null>(null);

  const stopAudio = useCallback(() => {
    void Speech.stop();
    setPlayingPanelId(null);
  }, []);

  useEffect(() => {
    return () => {
      void Speech.stop();
    };
  }, []);

  const playPanel = useCallback(
    (panel: WebtoonPanel) => {
      const text = getPanelAudioText(panel);
      if (!text.trim()) {
        return;
      }
      void Speech.stop();
      setPlayingPanelId(panel.id);
      Speech.speak(text, {
        rate: 0.92,
        onDone: () => setPlayingPanelId(null),
        onStopped: () => setPlayingPanelId(null),
        onError: () => setPlayingPanelId(null),
      });
    },
    []
  );

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
    setPlayingPanelId(episode.panels[0].id);
    let i = 0;
    const speakNext = () => {
      if (i >= lines.length || !episode.panels[i]) {
        setPlayingPanelId(null);
        return;
      }
      setPlayingPanelId(episode.panels[i].id);
      Speech.speak(lines[i], {
        rate: 0.92,
        onDone: () => {
          i += 1;
          speakNext();
        },
        onStopped: () => setPlayingPanelId(null),
        onError: () => setPlayingPanelId(null),
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

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between border-b border-white/10 px-4 py-3">
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            stopAudio();
            navigation.goBack();
          }}
        >
          <Text className="text-sm font-semibold text-white/80">← Back</Text>
        </Pressable>
        <View className="items-center px-2">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-terracotta">
            {episode.seriesTitle} · {episode.episodeLabel}
          </Text>
          <Text className="text-center text-base font-bold text-white" numberOfLines={1}>
            {episode.title}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (playingPanelId) {
              stopAudio();
            } else {
              playStoryline();
            }
          }}
        >
          <Text className="text-xs font-bold text-ochre-soft">
            {playingPanelId ? "Stop" : "Listen"}
          </Text>
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
          <Text className="mt-3 text-xs uppercase tracking-[2px] text-terracotta">
            ESV · family-safe anime webtoon
          </Text>
          <Pressable
            accessibilityRole="button"
            className="mt-4 self-start rounded-full bg-terracotta px-4 py-2.5"
            onPress={() => {
              if (playingPanelId) {
                stopAudio();
              } else {
                playStoryline();
              }
            }}
          >
            <Text className="text-xs font-bold text-white">
              {playingPanelId
                ? "Stop scripture audio"
                : "▶ Listen to this storyline (ESV)"}
            </Text>
          </Pressable>
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

        <View className="items-center px-6 py-8">
          <Text className="mb-3 text-sm text-white/50">End of storyline</Text>
          <Pressable
            accessibilityRole="button"
            className="mb-3 rounded-full bg-terracotta px-5 py-3"
            onPress={() => {
              stopAudio();
              navigation.navigate("ChapterPlayer", { bookId, chapterNumber });
            }}
          >
            <Text className="text-sm font-bold text-white">
              Continue with audio guide →
            </Text>
          </Pressable>
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
        <View className="rounded-full bg-black/70 px-4 py-2">
          <Text className="text-xs font-semibold text-white/85">
            Scene {activeIndex + 1} / {episode.panels.length}
            {playingPanelId ? " · Reading…" : ""}
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

  useEffect(() => {
    focus.value = withTiming(active ? 1 : 0.94, { duration: 280 });
  }, [active, focus]);

  const frameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focus.value, [0.94, 1], [0.78, 1]),
    transform: [{ scale: interpolate(focus.value, [0.94, 1], [0.985, 1]) }],
  }));

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

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(450)}
      style={[{ width, marginBottom: 10 }, frameStyle]}
    >
      <Image
        source={panel.image}
        style={{ width, height }}
        resizeMode="cover"
        accessibilityLabel={panel.bubble?.text ?? `Scene ${index + 1}`}
      />
      <View className="absolute bottom-4 left-3 right-3 gap-2">
        {panel.bubble ? (
          <View className={`rounded-2xl px-4 py-3 ${bubbleClass}`}>
            <Text
              className={`text-[11px] font-bold uppercase tracking-wide ${
                panel.bubble.tone === "dialogue" ||
                panel.bubble.tone === "scripture"
                  ? "text-terracotta"
                  : "text-ochre-soft"
              }`}
            >
              {label}
            </Text>
            <Text className={`mt-1 text-sm leading-5 ${textClass}`}>
              {panel.bubble.text}
            </Text>
          </View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isPlaying ? "Stop reading this scene" : "Read this scene aloud"
          }
          className={`self-start rounded-full px-3 py-2 ${
            isPlaying ? "bg-terracotta" : "bg-black/70"
          }`}
          onPress={onPlay}
        >
          <Text className="text-[11px] font-bold text-white">
            {isPlaying ? "■ Stop" : "▶ Read scene (ESV)"}
            {panel.scriptureRef ? ` · ${panel.scriptureRef}` : ""}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
