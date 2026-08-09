import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

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
  accentColor = colors.accent,
  complete,
}: MetricCardProps) {
  return (
    <View
      style={[
        styles.card,
        complete && { borderColor: accentColor, backgroundColor: colors.accentSoft },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
