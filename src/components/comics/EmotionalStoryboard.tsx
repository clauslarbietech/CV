import { useEffect } from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInRight,
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
  title?: string;
  subtitle?: string;
};

/**
 * Storyboard-style emotional comic beats.
 * Active panel gets a Ken-Burns drift + soft glow so scripture moments feel alive
 * (e.g. Eve bites → hands apple → serpent smirks).
 */
export default function EmotionalStoryboard({
  panels,
  activeIndex,
  title = "Animated storyboard",
  subtitle = "Emotion in motion — scene by scene",
}: Props) {
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width - 32, 420);

  return (
    <View className="mb-5">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-terracotta">
        {title}
      </Text>
      <Text className="mb-3 mt-1 text-lg font-bold text-night-text">{subtitle}</Text>

      {panels.map((panel, index) => (
        <StoryBeat
          key={panel.id}
          panel={panel}
          index={index}
          active={index === activeIndex}
          width={panelWidth}
        />
      ))}
    </View>
  );
}

function StoryBeat({
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
  const motion = useSharedValue(0);
  const focus = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    focus.value = withTiming(active ? 1 : 0, { duration: 350 });
    if (active) {
      motion.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 3200, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      );
    } else {
      motion.value = withTiming(0, { duration: 400 });
    }
  }, [active, focus, motion]);

  const frameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focus.value, [0, 1], [0.55, 1]),
    transform: [{ scale: interpolate(focus.value, [0, 1], [0.98, 1]) }],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(motion.value, [0, 1], [1.04, 1.12]) },
      { translateX: interpolate(motion.value, [0, 1], [0, -8]) },
      { translateY: interpolate(motion.value, [0, 1], [0, -5]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(motion.value, [0, 1], [0.08, 0.28]) * focus.value,
  }));

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 160).duration(500)}
      style={[{ width, alignSelf: "center", marginBottom: 14 }, frameStyle]}
      className="overflow-hidden rounded-2xl border border-night-border bg-night-card"
    >
      <View className="flex-row items-center justify-between bg-teal-ink px-3 py-2">
        <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-ochre-soft">
          Scene {index + 1} · {panel.title}
        </Text>
        {active ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text className="text-[10px] font-bold uppercase text-terracotta-soft">
              Now
            </Text>
          </Animated.View>
        ) : null}
      </View>

      <View className="relative h-52 overflow-hidden bg-teal-ink">
        <Animated.View style={[{ width: "100%", height: "100%" }, imageStyle]}>
          <Image
            source={panel.image}
            accessibilityLabel={panel.caption}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
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
      </View>

      <View className="bg-night-elevated px-3 py-3">
        <Text className="text-sm leading-5 text-night-text">{panel.caption}</Text>
      </View>
    </Animated.View>
  );
}
