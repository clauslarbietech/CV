import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme, radii, spacing } from '@/theme';

interface LoadingSkeletonProps {
  height?: number;
  count?: number;
}

export function LoadingSkeleton({ height = 72, count = 3 }: LoadingSkeletonProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          gap: spacing.md,
        },
        block: {
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          opacity: 0.7,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrap}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.block, { height }]} />
      ))}
    </View>
  );
}
