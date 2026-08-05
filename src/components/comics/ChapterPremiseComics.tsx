import { useEffect } from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
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
  chapterTitle: string;
  /** One-line premise under the hero image. */
  premise: string;
  /** Narration line synced to the audio guide (active beat). */
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
 * Bible chapter comics: hero premise image at the very top,
 * then progressive secondary beats as more art ships.
 */
export default function ChapterPremiseComics({
  panels,
  activeIndex,
  chapterTitle,
  premise,
  activeNarration,
}: Props) {
  const { width } = useWindowDimensions();
  const unique = uniqueComicPanels(panels);
  const hero = unique[0];
  const more = unique.slice(1);
  const heroHeight = Math.round(Math.min(width * 0.72, 340));
  const clampedActive = Math.min(activeIndex, unique.length - 1);

  if (!hero) {
    return null;
  }

  return (
    <View className="mb-4">
      <HeroPanel
        panel={hero}
        width={width}
        height={heroHeight}
        chapterTitle={chapterTitle}
        premise={premise}
        active={clampedActive === 0}
      />

      {activeNarration ? (
        <View className="mx-5 mt-3 rounded-2xl bg-night-card px-4 py-3">
          <Text className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-ochre-soft">
            Now playing
          </Text>
          <Text className="text-sm leading-5 text-night-text">
            {activeNarration}
          </Text>
        </View>
      ) : null}

      {more.length > 0 ? (
        <View className="mx-5 mt-4">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-terracotta">
            More of the story
          </Text>
          {more.map((panel, index) => (
            <ProgressivePanel
              key={panel.id}
              panel={panel}
              index={index}
              active={clampedActive === index + 1}
              width={Math.min(width - 40, 520)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function HeroPanel({
  panel,
  width,
  height,
  chapterTitle,
  premise,
  active,
}: {
  panel: ComicPanel;
  width: number;
  height: number;
  chapterTitle: string;
  premise: string;
  active: boolean;
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
  }, [motion, panel.id]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(motion.value, [0, 1], [1.04, 1.12]) },
      { translateY: interpolate(motion.value, [0, 1], [0, -6]) },
    ],
    opacity: active ? 1 : 0.92,
  }));

  return (
    <View>
      <View style={{ width, height, overflow: "hidden", backgroundColor: "#1A1A1A" }}>
        <Animated.View style={[{ width, height }, imageStyle]}>
          <Image
            source={panel.image}
            accessibilityLabel={panel.caption || premise}
            resizeMode="cover"
            style={{ width, height }}
          />
        </Animated.View>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: Math.round(height * 0.45),
            backgroundColor: "rgba(18,18,18,0.55)",
          }}
        />
        <View className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8">
          <Text className="text-[11px] font-bold uppercase tracking-[2px] text-ochre-soft">
            {panel.title}
          </Text>
          <Text className="mt-1 text-2xl font-bold text-white" numberOfLines={2}>
            {chapterTitle}
          </Text>
          <Text className="mt-1.5 text-sm leading-5 text-white/85" numberOfLines={3}>
            {premise}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ProgressivePanel({
  panel,
  index,
  active,
  width,
}: {
  panel: ComicPanel;
  index: number;
  active: boolean;
  width: number;
}) {
  const pulse = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    if (active) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(0, { duration: 280 });
    }
  }, [active, pulse]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.06]) }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 120).duration(420)}
      className="mb-3 overflow-hidden rounded-2xl border border-night-border bg-night-card"
      style={{ width, alignSelf: "center", opacity: active ? 1 : 0.78 }}
    >
      <View className="h-40 overflow-hidden bg-night-elevated">
        <Animated.View style={[{ width: "100%", height: "100%" }, imageStyle]}>
          <Image
            source={panel.image}
            accessibilityLabel={panel.caption}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </Animated.View>
      </View>
      <View className="px-3 py-2.5">
        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ochre-soft">
          {panel.title}
        </Text>
        <Text className="mt-1 text-sm leading-5 text-night-text">
          {panel.caption}
        </Text>
      </View>
    </Animated.View>
  );
}
