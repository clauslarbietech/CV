import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ExerciseGraphic } from '@/components/workout/ExerciseGraphic';
import { DifficultyTier, ExerciseDefinition } from '@/types';
import { formatExerciseTarget } from '@/utils/workout';
import { colors, spacing, typography } from '@/theme';

interface ExerciseStepProps {
  exercise: ExerciseDefinition;
  tier: DifficultyTier;
  round: number;
  totalRounds: number;
  index: number;
  totalExercises: number;
  onComplete: () => void;
  onSkip: () => void;
  onModify: () => void;
}

export function ExerciseStep({
  exercise,
  tier,
  round,
  totalRounds,
  index,
  totalExercises,
  onComplete,
  onSkip,
  onModify,
}: ExerciseStepProps) {
  const target = formatExerciseTarget(exercise, tier);

  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        ROUND {round}/{totalRounds} · MOVE {index}/{totalExercises}
      </Text>

      <ExerciseGraphic exerciseName={exercise.name} />

      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.target}>{target}</Text>
      <Text style={styles.setLine}>
        Current set · Round {round}/{totalRounds}
      </Text>

      {exercise.perSide ? (
        <Text style={styles.note}>Complete the listed reps on each side.</Text>
      ) : null}
      {exercise.notes ? <Text style={styles.note}>{exercise.notes}</Text> : null}

      <AppButton label="Complete set" variant="action" onPress={onComplete} />
      <View style={styles.row}>
        <AppButton
          label="Modify"
          variant="secondary"
          onPress={onModify}
          style={styles.flex}
        />
        <AppButton
          label="Skip"
          variant="ghost"
          onPress={onSkip}
          style={styles.flex}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  meta: {
    ...typography.overline,
    color: colors.accent,
  },
  name: {
    ...typography.hero,
    color: colors.textPrimary,
  },
  target: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: -1.5,
  },
  setLine: {
    ...typography.caption,
    color: colors.textMuted,
  },
  note: {
    ...typography.body,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
