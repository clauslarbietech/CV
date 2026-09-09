import { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme, spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
};

export function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
  edges = ['top', 'left', 'right', 'bottom'],
}: ScreenProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(480, width);

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, { maxWidth }, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixed, { maxWidth }, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        locations={[0, 0.55, 1]}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={edges}>
        <View style={styles.center}>{body}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
    paddingTop: spacing.md,
    flexGrow: 1,
  },
  fixed: {
    width: '100%',
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});
