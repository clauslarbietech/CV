import { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

import { INTRO_LOGO } from '@/constants/intro';
import { useTheme } from '@/theme';

interface SplashLogoProps {
  onDone: () => void;
}

export function SplashLogo({ onDone }: SplashLogoProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: colors.black,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
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
      if (finished) onDone();
    });
  }, [onDone, opacity, scale]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image source={INTRO_LOGO} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}
