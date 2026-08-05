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
 * One composition: full uncropped premise image + scripture-matched narration.
 */
export default function ChapterPremiseComics({
  panels,
  activeIndex,
  activeNarration,
}: Props) {
  const { width } = useWindowDimensions();
  const clampedActive = Math.min(
    Math.max(0, activeIndex),
    Math.max(0, panels.length - 1)
  );
  const panel = panels[clampedActive] ?? panels[0];
  const height = panel ? premiseHeroHeight(width, panel.image) : 0;
  const motion = useSharedValue(0);

  useEffect(() => {
    if (!panel) {
      return;
    }
    motion.value = 0;
    // Gentle fade pulse only — no scale crop that would hide faces.
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
  }, [motion, panel?.id]);

  const frameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(motion.value, [0, 1], [0.96, 1]),
  }));

  if (!panel) {
    return null;
  }

  return (
    <View className="mb-2">
      <Animated.View entering={FadeIn.duration(350)} style={frameStyle}>
        <View style={{ width, height }}>
          <PremiseHeroImage
            source={panel.image}
            width={width}
            accessibilityLabel={panel.caption}
          />
        </View>
      </Animated.View>
      <View className="mx-5 mt-3">
        {panel.scriptureRef ? (
          <Text className="mb-1 text-[11px] font-bold uppercase tracking-[1.5px] text-terracotta">
            {panel.scriptureRef}
            {panels.length > 1
              ? ` · Slide ${clampedActive + 1}/${panels.length}`
              : ""}
          </Text>
        ) : panels.length > 1 ? (
          <Text className="mb-1 text-[11px] font-bold uppercase tracking-[1.5px] text-terracotta">
            Slide {clampedActive + 1}/{panels.length}
          </Text>
        ) : null}
        <Text className="mb-1 text-base font-bold text-night-text">
          {panel.title}
        </Text>
        <Text className="text-base leading-6 text-night-muted">
          {activeNarration?.trim() || panel.caption}
        </Text>
      </View>
    </View>
  );
}
