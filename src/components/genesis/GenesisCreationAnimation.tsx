import { useEffect } from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const day1Light = require("../../../assets/panels/genesis-day1-light.jpg");
const watersDawn = require("../../../assets/panels/genesis-waters-dawn.jpg");

type PanelProps = {
  title: string;
  caption: string;
  source: number;
  delayMs: number;
  width: number;
};

function MotionPanel({ title, caption, source, delayMs, width }: PanelProps) {
  const glow = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    glow.value = withDelay(
      delayMs + 400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.25, { duration: 2200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
    drift.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 4800, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 4800, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      )
    );
  }, [delayMs, drift, glow]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(glow.value, [0, 1], [1.02, 1.08]) },
      { translateY: interpolate(drift.value, [0, 1], [0, -6]) },
    ],
    opacity: interpolate(glow.value, [0, 1], [0.92, 1]),
  }));

  const washStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.15, 0.4]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delayMs).duration(700).springify().damping(16)}
      className="mb-5 overflow-hidden border-b-4 border-parchment-ink/80"
      style={{ width }}
    >
      <View className="border-x-2 border-t-2 border-parchment-ink/80 bg-teal-ink px-3 py-2">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-ochre-soft">
          {title}
        </Text>
      </View>

      <View className="relative h-56 overflow-hidden border-x-2 border-parchment-ink/80 bg-teal-ink">
        <Animated.View style={[{ width: "100%", height: "100%" }, imageStyle]}>
          <Image
            source={source}
            accessibilityLabel={caption}
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
            washStyle,
          ]}
        />
      </View>

      <View className="border-x-2 border-parchment-ink/80 bg-parchment-warm px-4 py-3">
        <Text className="text-sm leading-5 text-parchment-ink">{caption}</Text>
      </View>
    </Animated.View>
  );
}

export default function GenesisCreationAnimation() {
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width - 40, 520);
  const spark = useSharedValue(0);

  useEffect(() => {
    spark.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 1600, easing: Easing.in(Easing.cubic) })
      ),
      -1,
      false
    );
  }, [spark]);

  const sparkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(spark.value, [0, 1], [0.35, 1]),
    transform: [{ scale: interpolate(spark.value, [0, 1], [0.85, 1.15]) }],
  }));

  return (
    <View className="mb-2 items-center">
      <Animated.View
        entering={FadeIn.duration(800)}
        className="mb-5 w-full items-center"
      >
        <View className="mb-3 flex-row items-center gap-2">
          <Animated.View
            style={[
              {
                height: 10,
                width: 10,
                borderRadius: 999,
                backgroundColor: "#D4A017",
              },
              sparkStyle,
            ]}
          />
          <Text className="text-xs font-semibold uppercase tracking-[3px] text-teal-deep">
            Creation begins
          </Text>
        </View>
        <Text className="mb-1 text-center text-2xl font-bold text-parchment-ink">
          In the beginning…
        </Text>
        <Text className="max-w-md text-center text-sm leading-5 text-parchment-ink/75">
          Watch light rise from the deep — a motion-comic prologue to Genesis 1.
        </Text>
      </Animated.View>

      <MotionPanel
        title="Day 1 · Let there be light"
        caption="Darkness covered the deep — then a warm burst of light split the void."
        source={day1Light}
        delayMs={200}
        width={panelWidth}
      />

      <MotionPanel
        title="The waters · Dawn over the deep"
        caption="Spirit hovered over the waters as golden dawn painted the horizon."
        source={watersDawn}
        delayMs={650}
        width={panelWidth}
      />
    </View>
  );
}
