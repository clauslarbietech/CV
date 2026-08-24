import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing } from '@/theme';

import { StatusLabel } from './StatusLabel';
import { MetricStatus } from './ringChartUtils';

type ComparisonItem = {
  label: string;
  value: number;
  status: MetricStatus;
};

type ComparisonBarsProps = {
  title: string;
  items: [ComparisonItem, ComparisonItem];
};

export function ComparisonBars({ title, items }: ComparisonBarsProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          gap: spacing.sm,
        },
        title: {
          fontSize: 15,
          fontWeight: '800',
          color: colors.textPrimary,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: spacing.xl,
          minHeight: 120,
          paddingTop: spacing.sm,
        },
        col: {
          alignItems: 'center',
          gap: spacing.xs,
          flex: 1,
        },
        barTrack: {
          width: 56,
          height: 96,
          borderRadius: radii.lg,
          backgroundColor: colors.borderSubtle,
          justifyContent: 'flex-end',
          overflow: 'hidden',
        },
        barFill: {
          width: '100%',
          borderRadius: radii.lg,
          backgroundColor: colors.steps,
        },
        value: {
          fontSize: 22,
          fontWeight: '800',
          color: colors.textPrimary,
          marginBottom: spacing.xs,
        },
        label: {
          fontSize: 12,
          fontWeight: '700',
          color: colors.textSecondary,
          textAlign: 'center',
        },
      }),
    [colors],
  );

  const max = Math.max(items[0].value, items[1].value, 1);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        {items.map((item) => {
          const heightPct = Math.max(12, (item.value / max) * 100);
          return (
            <View key={item.label} style={styles.col}>
              <Text style={styles.value}>{item.value}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${heightPct}%` }]} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
              <StatusLabel status={item.status} />
            </View>
          );
        })}
      </View>
    </View>
  );
}
