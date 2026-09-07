import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing } from '@/theme';

type DistributionBarProps = {
  label: string;
  valueLabel: string;
  percent: number;
  fillColor: string;
  optimalMin?: number;
  optimalMax?: number;
};

export function DistributionBar({
  label,
  valueLabel,
  percent,
  fillColor,
  optimalMin = 70,
  optimalMax = 100,
}: DistributionBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          gap: spacing.xxs,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        label: {
          fontSize: 13,
          fontWeight: '700',
          color: colors.textPrimary,
        },
        value: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.textSecondary,
        },
        track: {
          height: 10,
          borderRadius: radii.pill,
          backgroundColor: colors.borderSubtle,
          overflow: 'hidden',
          position: 'relative',
        },
        optimal: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          backgroundColor: colors.surfaceHover,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: colors.border,
        },
        fill: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          borderRadius: radii.pill,
        },
        footer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        pct: {
          fontSize: 12,
          fontWeight: '700',
          color: fillColor,
        },
      }),
    [colors, fillColor],
  );

  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{valueLabel}</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.optimal,
            { left: `${optimalMin}%`, width: `${optimalMax - optimalMin}%` },
          ]}
        />
        <View
          style={[styles.fill, { width: `${Math.max(2, clamped)}%`, backgroundColor: fillColor }]}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.pct}>{Math.round(clamped)}%</Text>
      </View>
    </View>
  );
}
