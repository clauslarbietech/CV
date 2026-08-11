import { useEffect, useState } from "react";
import { Image, Pressable, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getChapter } from "../data/library";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AnimationDemo">;

const SCENE_SECONDS = 3.2;

/**
 * Standalone preview of the motion language we'll use for scripture comics:
 * scene crossfades + Ken-Burns drift/glow on the active beat.
 * Final production can swap these stills for hand-drawn frame animation later.
 */
export default function AnimationDemoScreen({ navigation }: Props) {
  const chapter = getChapter("genesis", 3);
  const panels = chapter?.panels ?? [];
  const { width } = useWindowDimensions();
  const frameWidth = Math.min(width - 28, 400);
  const frameHeight = frameWidth * 0.78;

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const motion = useSharedValue(0);

  useEffect(() => {
    motion.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [motion]);

  useEffect(() => {
    if (!playing || panels.length === 0) {
      return;
    }
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % panels.length);
    }, SCENE_SECONDS * 1000);
    return () => clearInterval(timer);
  }, [panels.length, playing]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(motion.value, [0, 1], [1.05, 1.14]) },
      { translateX: interpolate(motion.value, [0, 1], [0, -10]) },
      { translateY: interpolate(motion.value, [0, 1], [2, -6]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(motion.value, [0, 1], [0.1, 0.32]),
  }));

  const active = panels[index];

  return (
    <SafeAreaView className="flex-1 bg-parchment-ink" edges={["top", "left", "right"]}>
      <View className="flex-1 px-4 pt-3">
        <View className="mb-4 flex-row items-center justify-between">
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
            <Text className="text-sm font-semibold text-white/80">← Back</Text>
          </Pressable>
          <Text className="text-sm font-bold uppercase tracking-[2px] text-ochre-soft">
            Animation demo
          </Text>
          <View className="w-12" />
        </View>

        <Text className="mb-1 text-2xl font-bold text-white">Genesis 3 · The Fall</Text>
        <Text className="mb-4 text-sm leading-5 text-white/70">
          Example of the motion style: each scripture beat crossfades, then slowly
          drifts (Ken-Burns) with a soft glow. Later we can replace stills with
          hand-drawn frame animation.
        </Text>

        <View
          className="mb-4 overflow-hidden rounded-3xl border border-white/15 bg-black"
          style={{ width: frameWidth, height: frameHeight, alignSelf: "center" }}
        >
          {active ? (
            <Animated.View
              key={active.id}
              entering={FadeIn.duration(650)}
              exiting={FadeOut.duration(450)}
              style={{ width: "100%", height: "100%" }}
            >
              <Animated.View style={[{ width: "100%", height: "100%" }, imageStyle]}>
                <Image
                  source={active.image}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                  accessibilityLabel={active.caption}
                />
              </Animated.View>
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: "#F0D78C",
                    pointerEvents: "none",
                  },
                  glowStyle,
                ]}
              />
            </Animated.View>
          ) : null}

          <View className="absolute bottom-0 left-0 right-0 bg-black/55 px-4 py-3">
            <Text className="text-xs font-bold uppercase tracking-[2px] text-terracotta-soft">
              Scene {index + 1} of {panels.length}
            </Text>
            <Text className="mt-1 text-base font-bold text-white">
              {active?.title}
            </Text>
          </View>
        </View>

        <View className="mb-4 rounded-2xl bg-white/10 px-4 py-3">
          <Text className="text-sm leading-5 text-white/90">{active?.caption}</Text>
        </View>

        <View className="mb-3 flex-row justify-center gap-2">
          {panels.map((panel, panelIndex) => (
            <Pressable
              key={panel.id}
              accessibilityRole="button"
              onPress={() => setIndex(panelIndex)}
              className={`h-2 rounded-full ${
                panelIndex === index ? "w-6 bg-terracotta" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </View>

        <View className="flex-row justify-center gap-3">
          <Pressable
            accessibilityRole="button"
            className="rounded-full bg-terracotta px-5 py-3"
            onPress={() => setPlaying((value) => !value)}
          >
            <Text className="text-sm font-bold text-white">
              {playing ? "Pause demo" : "Play demo"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            className="rounded-full border border-white/25 px-5 py-3"
            onPress={() =>
              navigation.navigate("ChapterPlayer", {
                bookId: "genesis",
                chapterNumber: 3,
              })
            }
          >
            <Text className="text-sm font-bold text-white">Open full chapter</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
