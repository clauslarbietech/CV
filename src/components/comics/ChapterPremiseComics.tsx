import { useEffect } from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
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
 * One composition: animated image + narration.
 * Pages look the same; only the art and text change.
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
  const heroHeight = Math.round(Math.min(width * 0.78, 380));

  if (!panel) {
    return null;
  }

  return (
    <View className="mb-2">
      <HeroImage
        key={panel.id}
        image={panel.image}
        label={panel.caption}
        width={width}
        height={heroHeight}
      />
      <View className="mx-5 mt-3">
        <Text className="text-base leading-6 text-night-text">
          {activeNarration?.trim() || panel.caption}
        </Text>
      </View>
    </View>
  );
}

function HeroImage({
  image,
  label,
  width,
  height,
}: {
  image: number;
  label: string;
  width: number;
  height: number;
}) {
  const motion = useSharedValue(0);

  useEffect(() => {
    motion.value = 0;
    motion.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 4800,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: 4800,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1,
      false
    );
  }, [image, motion]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(motion.value, [0, 1], [1.04, 1.12]) },
      { translateY: interpolate(motion.value, [0, 1], [0, -6]) },
    ],
  }));

  return (
    <Animated.View entering={FadeIn.duration(350)}>
      <View
        style={{ width, height, overflow: "hidden", backgroundColor: "#1A1A1A" }}
      >
        <Animated.View style={[{ width, height }, imageStyle]}>
          <Image
            source={image}
            accessibilityLabel={label}
            resizeMode="cover"
            style={{ width, height }}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}
