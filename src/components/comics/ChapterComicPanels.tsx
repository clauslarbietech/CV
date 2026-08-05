import { useEffect } from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { ComicPanel } from "../../data/library";

type Props = {
  panels: ComicPanel[];
  activeIndex: number;
};

function PanelCard({
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
          withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.35, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(0, { duration: 300 });
    }
  }, [active, pulse]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.05]) }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 180).duration(550)}
      className="mb-4 overflow-hidden border-2 border-night-border"
      style={{
        width,
        opacity: active ? 1 : 0.72,
      }}
    >
      <View className="bg-teal-ink px-3 py-2">
        <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-ochre-soft">
          {panel.title}
        </Text>
      </View>
      <View className="h-48 overflow-hidden bg-teal-ink">
        <Animated.View style={[{ width: "100%", height: "100%" }, imageStyle]}>
          <Image
            source={panel.image}
            accessibilityLabel={panel.caption}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </Animated.View>
      </View>
      <View className="bg-night-elevated px-3 py-2.5">
        <Text className="text-sm leading-5 text-night-text">
          {panel.caption}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ChapterComicPanels({ panels, activeIndex }: Props) {
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width - 40, 520);
  const intro = useSharedValue(0);

  useEffect(() => {
    intro.value = withDelay(
      100,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
  }, [intro]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ translateY: interpolate(intro.value, [0, 1], [10, 0]) }],
  }));

  return (
    <View className="mb-4 items-center">
      <Animated.View style={headerStyle} className="mb-3 w-full">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-ochre-soft">
          Anime comic panels
        </Text>
        <Text className="mt-1 text-lg font-bold text-night-text">
          Motion visuals for this chapter
        </Text>
      </Animated.View>

      {panels.map((panel, index) => (
        <PanelCard
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
