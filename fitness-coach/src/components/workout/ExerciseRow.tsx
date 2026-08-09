import { StyleSheet, Text, View } from 'react-native';

import { DifficultyTier, ExerciseDefinition } from '@/types';
import { formatExerciseTarget } from '@/utils/workout';
import { colors, spacing, typography } from '@/theme';

interface ExerciseRowProps {
  exercise: ExerciseDefinition;
  tier: DifficultyTier;
  index: number;
}

export function ExerciseRow({ exercise, tier, index }: ExerciseRowProps) {
  const target = formatExerciseTarget(exercise, tier);

  return (
    <View style={styles.row}>
      <Text style={styles.index}>{index}</Text>
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        {exercise.notes ? (
          <Text style={styles.notes}>{exercise.notes}</Text>
        ) : null}
      </View>
      <Text style={styles.target}>{target}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  index: {
    ...typography.caption,
    color: colors.textMuted,
    width: 20,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  notes: {
    ...typography.caption,
    color: colors.textMuted,
  },
  target: {
    ...typography.bodyBold,
    color: colors.accent,
  },
});
