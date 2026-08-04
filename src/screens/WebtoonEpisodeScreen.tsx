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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getWebtoonEpisode, type WebtoonPanel } from "../data/webtoonEpisodes";
import type { RootStackParamList } from "../navigation/types";
import {
  ESV_COPYRIGHT_NOTICE,
  ESV_WEBSITE_URL,
} from "../services/esvService";

type Props = NativeStackScreenProps<RootStackParamList, "WebtoonEpisode">;

/**
 * Mature anime webtoon episode reader:
 * full-bleed vertical panels, speech/narration bubbles, scroll-reveal motion.
 * Family-safe scripture storytelling (Toon Hub–style format, not adult themes).
 */
export default function WebtoonEpisodeScreen({ navigation, route }: Props) {
  const { bookId, chapterNumber } = route.params;
  const episode = getWebtoonEpisode(bookId, chapterNumber);
  const { width } = useWindowDimensions();
  const panelHeight = Math.round(width * 1.28);
  const [activeIndex, setActiveIndex] = useState(0);

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
        <Text className="text-white">Episode not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between border-b border-white/10 px-4 py-3">
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-sm font-semibold text-white/80">← Back</Text>
        </Pressable>
        <View className="items-center">
          <Text className="text-xs font-bold uppercase tracking-[2px] text-terracotta">
            {episode.seriesTitle} · {episode.episodeLabel}
          </Text>
          <Text className="text-base font-bold text-white">{episode.title}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate("ChapterPlayer", { bookId, chapterNumber })
          }
        >
          <Text className="text-xs font-bold text-ochre-soft">Audio</Text>
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
            Mature anime webtoon · family-safe
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
          />
        ))}

        <View className="items-center px-6 py-8">
          <Text className="mb-3 text-sm text-white/50">End of episode</Text>
          <Pressable
            accessibilityRole="button"
            className="mb-3 rounded-full bg-terracotta px-5 py-3"
            onPress={() =>
              navigation.navigate("ChapterPlayer", { bookId, chapterNumber })
            }
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
            Panel {activeIndex + 1} / {episode.panels.length}
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
}: {
  panel: WebtoonPanel;
  index: number;
  width: number;
  height: number;
  active: boolean;
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
        : "bg-black/75";

  const textClass =
    panel.bubble?.tone === "dialogue" ? "text-parchment-ink" : "text-white";

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(450)}
      style={[{ width, marginBottom: 10 }, frameStyle]}
    >
      <Image
        source={panel.image}
        style={{ width, height }}
        resizeMode="cover"
        accessibilityLabel={panel.bubble?.text ?? `Panel ${index + 1}`}
      />
      {panel.bubble ? (
        <View className="absolute bottom-5 left-4 right-4">
          <View className={`rounded-2xl px-4 py-3 ${bubbleClass}`}>
            <Text
              className={`text-[11px] font-bold uppercase tracking-wide ${
                panel.bubble.tone === "dialogue"
                  ? "text-terracotta"
                  : "text-ochre-soft"
              }`}
            >
              {panel.bubble.tone === "whisper"
                ? "Whisper"
                : panel.bubble.tone === "dialogue"
                  ? "Story"
                  : "Narration"}
            </Text>
            <Text className={`mt-1 text-sm leading-5 ${textClass}`}>
              {panel.bubble.text}
            </Text>
          </View>
        </View>
      ) : null}
    </Animated.View>
  );
}
