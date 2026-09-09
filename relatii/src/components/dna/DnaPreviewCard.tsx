import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing, typography } from '@/theme';

type Props = {
  label: string;
  clarity: number;
  clarityLabel: string;
  insight: string;
};

export function DnaPreviewCard({
  label,
  clarity,
  clarityLabel,
  insight,
}: Props) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderRadius: radii.xl,
          padding: spacing.xl,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        },
        eyebrow: {
          ...typography.overline,
          color: colors.dna,
          marginBottom: spacing.sm,
        },
        title: {
          ...typography.hero,
          color: colors.textPrimary,
          marginBottom: spacing.md,
        },
        meterTrack: {
          height: 10,
          borderRadius: radii.pill,
          backgroundColor: colors.surfaceSoft,
          overflow: 'hidden',
          marginBottom: spacing.xs,
        },
        meterFill: {
          height: '100%',
          width: `${Math.max(8, Math.min(100, clarity))}%`,
          borderRadius: radii.pill,
          backgroundColor: colors.dna,
        },
        meterRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: spacing.lg,
        },
        meterText: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        insight: {
          ...typography.body,
          color: colors.textSecondary,
        },
        note: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.md,
        },
      }),
    [colors, clarity],
  );

  return (
    <View style={styles.card} accessibilityRole="summary">
      <Text style={styles.eyebrow}>Your DNA is forming</Text>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.meterTrack}>
        <View style={styles.meterFill} />
      </View>
      <View style={styles.meterRow}>
        <Text style={styles.meterText}>
          {clarityLabel} · ~{clarity}% clarity
        </Text>
        <Text style={styles.meterText}>Early read</Text>
      </View>
      <Text style={styles.insight}>{insight}</Text>
      <Text style={styles.note}>
        This is an early sketch you can correct — not a diagnosis or prediction.
      </Text>
    </View>
  );
}
