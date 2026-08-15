import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DifficultyTier, ExerciseDefinition } from '@/types';
import { formatExerciseTarget } from '@/utils/workout';
import { useTheme, radii, spacing, typography } from '@/theme';

interface ExerciseRowProps {
  exercise: ExerciseDefinition;
  tier: DifficultyTier;
  index: number;
}

export function ExerciseRow({ exercise, tier, index }: ExerciseRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.sm,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          marginBottom: spacing.xs,
          borderWidth: 1,
          borderColor: colors.border,
        },
        indexBadge: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        },
        index: {
          ...typography.caption,
          color: colors.accent,
          fontWeight: '800',
        },
        content: {
          flex: 1,
          gap: 2,
        },
        name: {
          ...typography.bodyBold,
          color: colors.textPrimary,
        },
        meta: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        notes: {
          ...typography.caption,
          color: colors.textMuted,
        },
      }),
    [colors],
  );

  const target = formatExerciseTarget(exercise, tier);

  return (
    <View style={styles.row}>
      <View style={styles.indexBadge}>
        <Text style={styles.index}>{index}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.meta}>
          {target}
          {exercise.perSide ? ' · each side' : ''}
        </Text>
        {exercise.notes ? (
          <Text style={styles.notes}>{exercise.notes}</Text>
        ) : null}
      </View>
    </View>
  );
}
