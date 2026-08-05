import { useEffect } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { ComicPanel } from "../../data/library";
import { useTheme } from "../../theme/ThemeProvider";
import PremiseHeroImage, { premiseHeroHeight } from "./PremiseHeroImage";

type Props = {
  panels: ComicPanel[];
  activeIndex: number;
  /** ESV line synced to the audio guide / current slide. */
  activeNarration?: string;
  onSelectSlide?: (index: number) => void;
};

/** Prefer unique images so the chapter feed never stacks duplicate art. */
export function uniqueComicPanels(panels: ComicPanel[]): ComicPanel[] {
  const seen = new Set<number>();
  const unique: ComicPanel[] = [];
  for (const panel of panels) {
    if (seen.has(panel.image)) {
      continue;
    }
    seen.add(panel.image);
    unique.push(panel);
  }
  return unique.length > 0 ? unique : panels.slice(0, 1);
}

/**
 * Genesis-style chapter view: large hero art, speech below (not overlaid on art).
 */
export default function ChapterPremiseComics({
  panels,
  activeIndex,
  activeNarration,
  onSelectSlide,
}: Props) {
  const { width } = useWindowDimensions();
  const { reduceMotion } = useTheme();
  const contentWidth = width - 32;
  const clampedActive = Math.min(
    Math.max(0, activeIndex),
    Math.max(0, panels.length - 1)
  );
  const panel = panels[clampedActive] ?? panels[0];
  const height = panel ? premiseHeroHeight(contentWidth, panel.image) : 0;
  const motion = useSharedValue(0);

  useEffect(() => {
    if (!panel || reduceMotion) {
      motion.value = 1;
      return;
    }
    motion.value = 0;
    motion.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1,
      false
    );
  }, [motion, panel?.id, reduceMotion]);

  const frameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(motion.value, [0, 1], [0.96, 1]),
  }));

  if (!panel) {
    return null;
  }

  const scriptureBody = activeNarration?.trim() || panel.caption;
  const scriptureRef = panel.scriptureRef ?? "ESV";

  return (
    <View className="px-4">
      <Animated.View
        entering={FadeIn.duration(350)}
        style={frameStyle}
        className="overflow-hidden rounded-2xl bg-night-card"
      >
        <View style={{ width: contentWidth, height }}>
          <PremiseHeroImage
            source={panel.image}
            width={contentWidth}
            accessibilityLabel={
              panel.scriptureRef
                ? `${panel.scriptureRef}. ${scriptureBody}`
                : scriptureBody
            }
          />
        </View>
      </Animated.View>

      {panels.length > 1 ? (
        <View className="mt-3 flex-row items-center justify-center gap-2">
          {panels.map((item, index) => {
            const selected = index === clampedActive;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Scene ${index + 1} of ${panels.length}`}
                onPress={() => onSelectSlide?.(index)}
                className={`h-2 rounded-full ${
                  selected ? "w-6 bg-terracotta" : "w-2 bg-night-border"
                }`}
              />
            );
          })}
          <Text className="ml-2 text-[11px] font-semibold text-night-muted">
            Scene {clampedActive + 1} / {panels.length}
          </Text>
        </View>
      ) : null}

      <View className="mt-4 rounded-2xl bg-night-card px-4 py-3">
        <Text className="mb-1 text-[11px] font-bold uppercase tracking-wide text-terracotta">
          {scriptureRef}
        </Text>
        <Text className="text-[16px] leading-7 text-night-text">
          {scriptureBody}
        </Text>
      </View>
    </View>
  );
}
