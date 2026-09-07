import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing, typography } from '@/theme';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  accentColor?: string;
  complete?: boolean;
}

export function MetricCard({
  label,
  value,
  subtitle,
  accentColor,
  complete,
}: MetricCardProps) {
  const { colors } = useTheme();
  const resolvedAccent = accentColor ?? colors.accentText;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          flex: 1,
          minWidth: '45%',
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.md,
          gap: spacing.xxs,
        },
        label: {
          ...typography.caption,
          color: colors.textMuted,
          textTransform: 'uppercase',
        },
        value: {
          ...typography.heading,
        },
        subtitle: {
          ...typography.caption,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );

  return (
    <View
      style={[
        styles.card,
        complete && {
          borderColor: resolvedAccent,
          backgroundColor: colors.accentSoft,
        },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: resolvedAccent }]}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
