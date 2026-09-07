import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, radii, spacing } from '@/theme';

import { MetricStatus } from './ringChartUtils';

type VitalTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  unit: string;
  status?: MetricStatus;
};

export function VitalTile({ icon, value, unit, status = 'normal' }: VitalTileProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        tile: {
          flex: 1,
          minWidth: 58,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.xxs,
          alignItems: 'center',
          gap: 2,
        },
        value: {
          fontSize: 16,
          fontWeight: '800',
          color: colors.textPrimary,
        },
        unit: {
          fontSize: 10,
          fontWeight: '600',
          color: colors.textMuted,
        },
        dot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          marginTop: 2,
        },
      }),
    [colors],
  );

  const dotColor =
    status === 'good'
      ? colors.accentText
      : status === 'normal'
        ? colors.actionText
        : colors.warning;

  return (
    <View style={styles.tile}>
      <Ionicons name={icon} size={16} color={colors.textPrimary} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
    </View>
  );
}
