import { useEffect } from "react";
import { Text, View, useWindowDimensions } from "react-native";
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
import PremiseHeroImage, { premiseHeroHeight } from "./PremiseHeroImage";

type Props = {
  panels: ComicPanel[];
  activeIndex: number;
  /** Narration line synced to the audio guide. */
  activeNarration?: string;
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
 * One composition: top-anchored premise image + narration.
 */
export default function ChapterPremiseComics({
  panels,
  activeIndex,
  activeNarration,
}: Props) {
  const { width } = useWindowDimensions();
  const unique = uniqueComicPanels(panels);
  const clampedActive = Math.min(
    Math.max(0, activeIndex),
    Math.max(0, unique.length - 1)
  );
  const panel = unique[clampedActive] ?? unique[0];
  const height = premiseHeroHeight(width);
  const motion = useSharedValue(0);

  useEffect(() => {
    if (!panel) {
      return;
    }
    motion.value = 0;
    motion.value = withRepeat(
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
  }, [motion, panel?.id]);

  const frameStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(motion.value, [0, 1], [1.01, 1.05]) },
      { translateY: interpolate(motion.value, [0, 1], [0, 3]) },
    ],
  }));

  if (!panel) {
    return null;
  }

  return (
    <View className="mb-2">
      <Animated.View entering={FadeIn.duration(350)}>
        <View style={{ width, height, overflow: "hidden" }}>
          <Animated.View style={[{ width, height }, frameStyle]}>
            <PremiseHeroImage
              source={panel.image}
              width={width}
              accessibilityLabel={panel.caption}
            />
          </Animated.View>
        </View>
      </Animated.View>
      <View className="mx-5 mt-3">
        <Text className="text-base leading-6 text-night-text">
          {activeNarration?.trim() || panel.caption}
        </Text>
      </View>
    </View>
  );
}
