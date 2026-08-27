import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import {
  WorkoutFuelPlan,
  getWorkoutFuelPlan,
} from '@/constants/nutrition/workoutFuel';
import { useTheme, spacing, typography } from '@/theme';

type WorkoutFuelCardProps = {
  expressMinutes?: number | null;
  estimatedMinutes?: { min: number; max: number } | null;
  /** When true, lead with after-session recovery emphasis. */
  postWorkout?: boolean;
  planOverride?: WorkoutFuelPlan;
};

export function WorkoutFuelCard({
  expressMinutes,
  estimatedMinutes,
  postWorkout = false,
  planOverride,
}: WorkoutFuelCardProps) {
  const { colors } = useTheme();
  const plan =
    planOverride ??
    getWorkoutFuelPlan({
      expressMinutes,
      estimated: estimatedMinutes,
    });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        principle: {
          ...typography.caption,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        chips: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginBottom: spacing.sm,
        },
        chip: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 999,
          paddingHorizontal: spacing.sm,
          paddingVertical: 4,
        },
        chipText: {
          ...typography.caption,
          color: colors.textMuted,
          fontWeight: '700',
        },
        section: {
          ...typography.bodyBold,
          color: colors.textPrimary,
          marginTop: spacing.sm,
          marginBottom: spacing.xs,
        },
        item: {
          marginBottom: spacing.xs,
        },
        itemLabel: {
          ...typography.body,
          color: colors.textPrimary,
          fontWeight: '600',
        },
        itemWhy: {
          ...typography.caption,
          color: colors.textMuted,
        },
        avoid: {
          ...typography.caption,
          color: colors.warning,
          marginTop: 2,
        },
        hydrate: {
          ...typography.caption,
          color: colors.actionText,
          marginTop: spacing.sm,
          fontWeight: '600',
        },
      }),
    [colors],
  );

  const primaryList = postWorkout ? plan.after : plan.before;
  const secondaryList = postWorkout ? plan.before : plan.after;
  const primaryTitle = postWorkout ? 'Eat after this workout' : 'Eat before this workout';
  const secondaryTitle = postWorkout ? 'Next time · before' : 'Eat after this workout';

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>FUEL · THIS WORKOUT</Text>
      <Text style={styles.title}>{plan.label}</Text>
      <Text style={styles.principle}>{plan.principle}</Text>

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{plan.durationHint}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>Carbs · {plan.carbLevel}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>Fat · {plan.fatLevel}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{plan.proteinFocus}</Text>
        </View>
      </View>

      <Text style={styles.section}>{primaryTitle}</Text>
      {primaryList.map((item) => (
        <Text key={item.label} style={styles.itemLabel}>
          • {item.label}
        </Text>
      ))}

      <Text style={styles.section}>{secondaryTitle}</Text>
      {secondaryList.map((item) => (
        <Text key={item.label} style={styles.itemLabel}>
          • {item.label}
        </Text>
      ))}

      <Text style={styles.section}>Skip</Text>
      {plan.avoid.map((line) => (
        <Text key={line} style={styles.avoid}>
          • {line}
        </Text>
      ))}

      <Text style={styles.hydrate}>{plan.hydration}</Text>
    </Card>
  );
}
