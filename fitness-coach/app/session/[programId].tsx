import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ExerciseRow } from '@/components/workout/ExerciseRow';
import { getProgramById } from '@/constants/programs';
import { useProgramStore } from '@/store/programStore';
import { formatDuration, formatRest } from '@/utils/format';
import { getProgramDay } from '@/utils/workout';
import { colors, spacing, typography } from '@/theme';

export default function WorkoutSessionScreen() {
  const { programId, day: dayParam } = useLocalSearchParams<{
    programId: string;
    day?: string;
  }>();
  const program = getProgramById(programId);
  const enrollment = useProgramStore((s) => s.enrollment);
  const completeWorkout = useProgramStore((s) => s.completeWorkout);
  const dayNumber = Number(dayParam ?? enrollment?.currentDay ?? 1);
  const day = program ? getProgramDay(program, dayNumber) : undefined;
  const tier = enrollment?.difficulty ?? 'soldier';

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [rating, setRating] = useState<number | undefined>();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const clock = useMemo(() => {
    const m = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, '0');
    const s = (elapsed % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [elapsed]);

  if (!program || !day) {
    return (
      <Screen>
        <EmptyState
          title="Mission unavailable"
          description="Could not load this workout day."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  if (finished || (day.isFinalTest && enrollment?.completedDayIds.includes(14))) {
    const isComplete =
      (enrollment?.completedDayIds.length ?? 0) >= program.durationDays ||
      day.isFinalTest;
    return (
      <Screen>
        <Text style={styles.kicker}>MISSION COMPLETE</Text>
        <Text style={styles.title}>
          {isComplete && day.day === 14
            ? 'OPERATION IRON 14 COMPLETE'
            : `Day ${day.day} complete`}
        </Text>
        <Card military>
          <Text style={styles.stat}>
            {enrollment?.completedDayIds.length ?? day.day} / {program.durationDays}{' '}
            Missions
          </Text>
          <Text style={styles.stat}>Duration: {clock}</Text>
          <Text style={styles.stat}>+100 XP earned</Text>
          {day.day === 14 ? (
            <Text style={styles.badge}>IRON 14 BADGE unlocked</Text>
          ) : null}
        </Card>
        <AppButton label="Back to Today" onPress={() => router.replace('/(tabs)/today')} />
      </Screen>
    );
  }

  const onComplete = () => {
    setRunning(false);
    completeWorkout(day.day, elapsed || 60, rating);
    setFinished(true);
  };

  return (
    <Screen>
      <Text style={styles.kicker}>
        DAY {day.day} · {tier.toUpperCase()}
      </Text>
      <Text style={styles.title}>{day.title}</Text>
      <Text style={styles.meta}>
        {formatDuration(day.estimatedMinutes)}
        {day.rounds ? ` · ${day.rounds} rounds` : ''}
        {formatRest(day.restSec) ? ` · Rest ${formatRest(day.restSec)}` : ''}
      </Text>

      <Card>
        <Text style={styles.timerLabel}>SESSION TIMER</Text>
        <Text style={styles.timer}>{clock}</Text>
        <View style={styles.timerActions}>
          <AppButton
            label={running ? 'Pause' : 'Start timer'}
            variant="secondary"
            onPress={() => setRunning((r) => !r)}
            style={styles.flexBtn}
          />
        </View>
      </Card>

      {day.extraBlocks?.map((block) => (
        <Card key={block.title} military>
          <Text style={styles.blockTitle}>{block.title}</Text>
          <Text style={styles.blockBody}>{block.description}</Text>
        </Card>
      ))}

      {day.coachMessage ? (
        <Text style={styles.coach}>{day.coachMessage}</Text>
      ) : null}

      <Text style={styles.section}>Exercises</Text>
      {day.exercises.map((exercise, index) => (
        <ExerciseRow
          key={exercise.id}
          exercise={exercise}
          tier={tier}
          index={index + 1}
        />
      ))}

      <Text style={styles.section}>How hard was this?</Text>
      <View style={styles.ratings}>
        {[1, 2, 3, 4, 5].map((value) => (
          <AppButton
            key={value}
            label={`${value}`}
            variant={rating === value ? 'primary' : 'secondary'}
            onPress={() => setRating(value)}
            style={styles.rateBtn}
          />
        ))}
      </View>

      <AppButton
        label={day.isFinalTest ? 'Finish final test' : 'Complete mission'}
        variant="military"
        onPress={onComplete}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.militaryAccent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.body,
    color: colors.textSecondary,
  },
  timerLabel: {
    ...typography.overline,
    color: colors.textMuted,
  },
  timer: {
    ...typography.hero,
    color: colors.accent,
    marginVertical: spacing.sm,
  },
  timerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flexBtn: {
    flex: 1,
  },
  blockTitle: {
    ...typography.subheading,
    color: colors.militaryAccent,
  },
  blockBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
  coach: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  section: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  ratings: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  rateBtn: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 0,
  },
  stat: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  badge: {
    ...typography.subheading,
    color: colors.militaryAccent,
    marginTop: spacing.sm,
  },
});
