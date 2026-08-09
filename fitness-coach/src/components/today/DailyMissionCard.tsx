import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { DifficultyTier, ProgramDay, WorkoutProgram } from '@/types';
import { formatDuration } from '@/utils/format';
import { formatExerciseTarget } from '@/utils/workout';
import { colors, spacing, typography } from '@/theme';

interface DailyMissionCardProps {
  program: WorkoutProgram;
  day: ProgramDay;
  tier: DifficultyTier;
  completed?: boolean;
  onStart: () => void;
}

export function DailyMissionCard({
  program,
  day,
  tier,
  completed,
  onStart,
}: DailyMissionCardProps) {
  return (
    <Card military={program.militaryThemed} style={styles.card}>
      <Text style={styles.kicker}>TODAY&apos;S MISSION</Text>
      <Text style={styles.dayLabel}>
        DAY {day.day} — {day.title}
      </Text>
      <Text style={styles.program}>{program.name}</Text>
      {day.rounds ? (
        <Text style={styles.rounds}>{day.rounds} rounds</Text>
      ) : null}

      <View style={styles.list}>
        {day.exercises.map((exercise) => (
          <Text key={exercise.id} style={styles.exercise}>
            {formatExerciseTarget(exercise, tier)} {exercise.name}
            {exercise.perSide ? ' per leg' : ''}
          </Text>
        ))}
        {day.extraBlocks?.map((block) => (
          <Text key={block.title} style={styles.exercise}>
            {block.title}: {block.description}
          </Text>
        ))}
      </View>

      <Text style={styles.eta}>
        Estimated time: {formatDuration(day.estimatedMinutes)}
      </Text>

      {day.coachMessage ? (
        <Text style={styles.coach}>{day.coachMessage}</Text>
      ) : null}

      <AppButton
        label={completed ? 'MISSION COMPLETE' : 'START MISSION'}
        variant={program.militaryThemed ? 'military' : 'primary'}
        onPress={onStart}
        disabled={completed}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  kicker: {
    ...typography.overline,
    color: colors.militaryAccent,
  },
  dayLabel: {
    ...typography.title,
    color: colors.textPrimary,
  },
  program: {
    ...typography.body,
    color: colors.textSecondary,
  },
  rounds: {
    ...typography.subheading,
    color: colors.accent,
    marginTop: spacing.xs,
  },
  list: {
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  exercise: {
    ...typography.body,
    color: colors.textPrimary,
  },
  eta: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  coach: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
});
