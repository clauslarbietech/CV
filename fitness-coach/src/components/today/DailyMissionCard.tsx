import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { DifficultyTier, ProgramDay, WorkoutProgram } from '@/types';
import { formatDuration } from '@/utils/format';
import { formatExerciseTarget } from '@/utils/workout';
import { useTheme, radii, spacing, typography } from '@/theme';

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
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          gap: spacing.sm,
        },
        kicker: {
          ...typography.overline,
          color: colors.accent,
        },
        dayLabel: {
          ...typography.title,
          color: colors.textPrimary,
        },
        program: {
          ...typography.body,
          color: colors.textSecondary,
        },
        roundsPill: {
          alignSelf: 'flex-start',
          backgroundColor: colors.accentSoft,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs,
          marginTop: spacing.xs,
        },
        rounds: {
          ...typography.caption,
          color: colors.accent,
          fontWeight: '700',
        },
        list: {
          gap: spacing.sm,
          marginVertical: spacing.sm,
        },
        exerciseRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spacing.sm,
        },
        bullet: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.accent,
          marginTop: 8,
        },
        exercise: {
          ...typography.body,
          color: colors.textPrimary,
          flex: 1,
        },
        exerciseTarget: {
          color: colors.accent,
          fontWeight: '700',
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
      }),
    [colors],
  );

  return (
    <Card military accentBorder style={styles.card}>
      <Text style={styles.kicker}>TODAY&apos;S MISSION</Text>
      <Text style={styles.dayLabel}>
        DAY {day.day} — {day.title}
      </Text>
      <Text style={styles.program}>{program.name}</Text>
      {day.rounds ? (
        <View style={styles.roundsPill}>
          <Text style={styles.rounds}>{day.rounds} rounds</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {day.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseRow}>
            <View style={styles.bullet} />
            <Text style={styles.exercise}>
              <Text style={styles.exerciseTarget}>
                {formatExerciseTarget(exercise, tier)}{' '}
              </Text>
              {exercise.name}
              {exercise.perSide ? ' per leg' : ''}
            </Text>
          </View>
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
        variant="military"
        onPress={onStart}
        disabled={completed}
      />
    </Card>
  );
}
