import { useEffect } from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { BRAND, BRAND_COLORS } from "../../content/brand";
import BrandWordmark from "./BrandWordmark";

const LOGO_MARK = require("../../../assets/brand/pixbible-logo-mark.png");

type Props = {
  onComplete: () => void;
};

/**
 * Premium cover animation — centered logo on deep navy (not orange).
 * Inspired by classic app splash layout: mark → breathe → tagline → hand off.
 */
export default function CoverAnimationScreen({ onComplete }: Props) {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(160, width * 0.42);

  const entrance = useSharedValue(0);
  const breathe = useSharedValue(0);
  const tagline = useSharedValue(0);
  const exit = useSharedValue(0);

  useEffect(() => {
    entrance.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
    breathe.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.35, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
    tagline.value = withDelay(900, withTiming(1, { duration: 600 }));
    exit.value = withDelay(
      BRAND.coverDurationMs - 500,
      withTiming(1, { duration: 500, easing: Easing.inOut(Easing.quad) }, () => {
        runOnJS(onComplete)();
      })
    );
  }, [breathe, entrance, exit, onComplete, tagline]);

  const logoWrapStyle = useAnimatedStyle(() => ({
    opacity: interpolate(entrance.value, [0, 1], [0, 1]),
    transform: [
      { scale: interpolate(entrance.value, [0, 1], [0.86, 1]) },
      { translateY: interpolate(breathe.value, [0, 1], [0, -4]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breathe.value, [0, 1], [0.12, 0.38]),
    transform: [{ scale: interpolate(breathe.value, [0, 1], [0.92, 1.08]) }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(tagline.value, [0, 1], [0, 1]),
    transform: [
      { translateY: interpolate(tagline.value, [0, 1], [8, 0]) },
    ],
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exit.value, [0, 1], [1, 0]),
  }));

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: BRAND_COLORS.navy,
          alignItems: "center",
          justifyContent: "center",
        },
        screenStyle,
      ]}
    >
      {/* Ambient wash */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "18%",
          width: width * 1.2,
          height: width * 1.2,
          borderRadius: width * 0.6,
          backgroundColor: BRAND_COLORS.navySoft,
          opacity: 0.55,
        }}
      />

      <Animated.View style={logoWrapStyle} className="items-center">
        <Animated.View
          style={[
            {
              position: "absolute",
              width: logoSize * 1.35,
              height: logoSize * 1.35,
              borderRadius: logoSize * 0.675,
              backgroundColor: BRAND_COLORS.gold,
            },
            glowStyle,
          ]}
        />
        <View
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: BRAND_COLORS.navySoft,
            borderWidth: 1,
            borderColor: "rgba(212, 160, 23, 0.35)",
          }}
        >
          <Image
            source={LOGO_MARK}
            style={{ width: logoSize * 0.88, height: logoSize * 0.88 }}
            resizeMode="contain"
            accessibilityLabel="PixBible logo"
          />
        </View>
      </Animated.View>

      <Animated.View style={taglineStyle} className="mt-8 items-center px-8">
        <BrandWordmark size="sm" variant="cover" />
        <Text
          className="mt-3 text-center text-sm font-medium"
          style={{ color: BRAND_COLORS.goldSoft }}
        >
          {BRAND.tagline}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
