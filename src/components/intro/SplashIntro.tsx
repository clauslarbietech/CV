import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

type Props = {
  onDone: () => void;
};

/**
 * Same intro motion as the FitLife gym splash:
 * fade + scale in → settle → brief hold → fade out → hand off.
 */
export default function SplashIntro({ onDone }: Props) {
  const scale = useRef(new Animated.Value(0.72)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scale, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.delay(350),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onDone();
      }
    });
  }, [onDone, opacity, scale]);

  return (
    <View style={styles.wrap} accessibilityLabel="Anime Audio Bible intro">
      <Animated.View
        style={[styles.content, { opacity, transform: [{ scale }] }]}
      >
        <Image
          source={require("../../../assets/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <Text style={styles.title}>Anime Audio Bible</Text>
        <Text style={styles.tagline}>See Scripture come to life</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#0F3D3E",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 28,
  },
  title: {
    color: "#F7F0E4",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  tagline: {
    marginTop: 10,
    color: "#F0D78C",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});
