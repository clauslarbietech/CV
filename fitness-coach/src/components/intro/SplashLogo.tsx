import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { INTRO_LOGO } from '@/constants/intro';
import { useTheme } from '@/theme';

interface SplashLogoProps {
  onDone: () => void;
}

/** Web Animated native driver is unreliable — force JS driver there. */
const USE_NATIVE = Platform.OS !== 'web';

export function SplashLogo({ onDone }: SplashLogoProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          ...StyleSheet.absoluteFill,
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        },
        logo: {
          width: 280,
          height: 280,
        },
      }),
    [colors],
  );

  const scale = useRef(new Animated.Value(0.72)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const onDoneRef = useRef(onDone);
  const finishedRef = useRef(false);
  onDoneRef.current = onDone;

  useEffect(() => {
    finishedRef.current = false;

    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 1700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE,
        }),
      ]),
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: USE_NATIVE,
      }),
      Animated.delay(450),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: USE_NATIVE,
      }),
    ]);

    animation.start(({ finished }) => {
      if (!finished || finishedRef.current) return;
      finishedRef.current = true;
      onDoneRef.current();
    });

    // Safety net: never leave users stuck on splash if animation aborts (web/HMR).
    const failSafe = setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onDoneRef.current();
    }, 4500);

    return () => {
      clearTimeout(failSafe);
      animation.stop();
    };
  }, [opacity, scale]);

  return (
    <View style={styles.wrap} accessibilityLabel="FitLife logo intro">
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image source={INTRO_LOGO} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}
