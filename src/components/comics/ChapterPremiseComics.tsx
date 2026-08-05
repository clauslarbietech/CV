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
 * Scripture slideshow: image for the beat + ESV text only.
 */
export default function ChapterPremiseComics({
  panels,
  activeIndex,
  activeNarration,
  onSelectSlide,
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

  const scriptureBody = activeNarration?.trim() || panel.caption;

  return (
    <View className="mb-2">
      <Animated.View entering={FadeIn.duration(350)} style={frameStyle}>
        <View style={{ width, height }}>
          <PremiseHeroImage
            source={panel.image}
            width={width}
            accessibilityLabel={
              panel.scriptureRef
                ? `${panel.scriptureRef}. ${scriptureBody}`
                : scriptureBody
            }
          />
        </View>
      </Animated.View>

      {panels.length > 1 ? (
        <View className="mx-5 mt-3 flex-row flex-wrap gap-2">
          {panels.map((item, index) => {
            const selected = index === clampedActive;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Slide ${index + 1}: ${item.scriptureRef ?? item.title}`}
                onPress={() => onSelectSlide?.(index)}
                className={`rounded-full px-3 py-1.5 ${
                  selected ? "bg-terracotta" : "bg-night-elevated"
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    selected ? "text-white" : "text-night-muted"
                  }`}
                >
                  {index + 1}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <View className="mx-5 mt-3">
        <Text className="mb-1 text-[11px] font-bold uppercase tracking-[1.5px] text-terracotta">
          {panel.scriptureRef ?? "ESV"}
          {panels.length > 1
            ? ` · ${clampedActive + 1}/${panels.length}`
            : ""}
        </Text>
        <Text className="mb-2 text-base font-bold text-night-text">
          {panel.title}
        </Text>
        <Text className="text-[17px] leading-7 text-night-text">
          {scriptureBody}
        </Text>
      </View>
    </View>
  );
}
