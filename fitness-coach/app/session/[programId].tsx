import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ExerciseStep } from '@/components/workout/ExerciseStep';
import { RestTimer } from '@/components/workout/RestTimer';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { OPERATION_IRON_14 } from '@/constants/programs';
import {
  formatClock,
  parseRepTarget,
  phaseLabel,
  resolvedCurrentExercise,
} from '@/features/workouts/sessionEngine';
import { useProgramStore } from '@/store/programStore';
import { useSessionStore } from '@/store/sessionStore';
import { formatDuration, formatRest } from '@/utils/format';
import { getProgramDay, resolveExercise } from '@/utils/workout';
import { colors, spacing, typography } from '@/theme';

export default function WorkoutSessionScreen() {
  const { programId, day: dayParam } = useLocalSearchParams<{
    programId: string;
    day?: string;
  }>();

  const enrollment = useProgramStore((s) => s.enrollment);
  const completeWorkout = useProgramStore((s) => s.completeWorkout);
  const isDayCompleted = useProgramStore((s) => s.isDayCompleted);

  const active = useSessionStore((s) => s.active);
  const resumeOrBegin = useSessionStore((s) => s.resumeOrBegin);
  const launch = useSessionStore((s) => s.launch);
  const completeExercise = useSessionStore((s) => s.completeExercise);
  const skipExercise = useSessionStore((s) => s.skipExercise);
  const finishRest = useSessionStore((s) => s.finishRest);
  const setRating = useSessionStore((s) => s.setRating);
  const markComplete = useSessionStore((s) => s.markComplete);
  const clearSession = useSessionStore((s) => s.clear);
  const tick = useSessionStore((s) => s.tick);

  const dayNumber = Number(dayParam ?? enrollment?.currentDay ?? 1);
  const day = getProgramDay(OPERATION_IRON_14, dayNumber);
  const tier = enrollment?.difficulty ?? 'soldier';
  const [savedNextDay, setSavedNextDay] = useState<number | null>(null);

  useEffect(() => {
    if (!day || programId !== OPERATION_IRON_14.id) return;
    resumeOrBegin({
      programId: OPERATION_IRON_14.id,
      day,
      difficulty: tier,
    });
  }, [dayNumber, programId, tier]);

  useEffect(() => {
    if (!day || !active) return;
    if (
      active.phase === 'briefing' ||
      active.phase === 'rating' ||
      active.phase === 'complete'
    ) {
      return;
    }
    const id = setInterval(() => tick(day), 1000);
    return () => clearInterval(id);
  }, [active?.phase, dayNumber]);

  const resolved = useMemo(() => {
    if (!day || !active) return undefined;
    return resolvedCurrentExercise(day, active);
  }, [day, active]);

  if (programId !== OPERATION_IRON_14.id || !day) {
    return (
      <Screen>
        <EmptyState
          title="Mission unavailable"
          description="Phase 1 only runs OPERATION IRON 14."
          actionLabel="Back to Today"
          onAction={() => router.replace('/(tabs)/today')}
        />
      </Screen>
    );
  }

  if (!enrollment) {
    return (
      <Screen>
        <EmptyState
          title="Not enrolled"
          description="Enroll in OPERATION IRON 14 to start missions."
          actionLabel="Go to Workouts"
          onAction={() => router.replace('/(tabs)/workouts')}
        />
      </Screen>
    );
  }

  if (!active || active.day !== day.day) {
    return (
      <Screen>
        <Text style={styles.kicker}>LOADING MISSION</Text>
        <Text style={styles.title}>Preparing Day {day.day}…</Text>
      </Screen>
    );
  }

  const finishAndSave = () => {
    const next = completeWorkout({
      day: day.day,
      durationSec: Math.max(active.elapsedSec, 30),
      rating: active.difficultyRating,
      exerciseLogs: active.exerciseLogs,
      roundsCompleted: active.currentRound,
      sessionId: active.id,
      startedAt: active.startedAt,
    });

    markComplete();
    const unlocked = useProgramStore.getState().enrollment?.currentDay ?? day.day;
    setSavedNextDay(unlocked);
    return next;
  };

  if (active.phase === 'complete' || (isDayCompleted(day.day) && savedNextDay)) {
    const nextDay = savedNextDay ?? enrollment.currentDay;
    const challengeDone =
      (useProgramStore.getState().enrollment?.completedDayIds.length ?? 0) >= 14;

    return (
      <Screen>
        <Text style={styles.kicker}>MISSION COMPLETE</Text>
        <Text style={styles.title}>
          {challengeDone && day.day === 14
            ? 'OPERATION IRON 14 COMPLETE'
            : `Day ${day.day} complete`}
        </Text>
        <Card military>
          <Text style={styles.stat}>
            {useProgramStore.getState().enrollment?.completedDayIds.length ?? day.day}{' '}
            / 14 Missions
          </Text>
          <Text style={styles.stat}>Duration: {formatClock(active.elapsedSec)}</Text>
          <Text style={styles.stat}>
            Sets logged: {active.exerciseLogs.length}
          </Text>
          <Text style={styles.stat}>+100 XP earned</Text>
          {day.day === 14 && challengeDone ? (
            <Text style={styles.badge}>IRON 14 BADGE unlocked</Text>
          ) : (
            <Text style={styles.badge}>Day {nextDay} unlocked</Text>
          )}
        </Card>
        {!challengeDone && nextDay > day.day ? (
          <AppButton
            label={`Start Day ${nextDay}`}
            variant="military"
            onPress={() => {
              clearSession();
              router.replace({
                pathname: '/session/[programId]',
                params: {
                  programId: OPERATION_IRON_14.id,
                  day: String(nextDay),
                },
              });
            }}
          />
        ) : null}
        <AppButton
          label="Back to Today"
          variant="secondary"
          onPress={() => {
            clearSession();
            router.replace('/(tabs)/today');
          }}
        />
      </Screen>
    );
  }

  if (active.phase === 'briefing') {
    return (
      <Screen>
        <Text style={styles.kicker}>
          OPERATION IRON 14 · {tier.toUpperCase()}
        </Text>
        <Text style={styles.title}>
          DAY {day.day} — {day.title}
        </Text>
        <Text style={styles.meta}>
          {formatDuration(day.estimatedMinutes)}
          {day.rounds ? ` · ${day.rounds} rounds` : ''}
          {formatRest(day.restSec) ? ` · Rest ${formatRest(day.restSec)}` : ''}
        </Text>

        <Card military>
          <Text style={styles.sectionLabel}>TRANSFORMATION MISSION</Text>
          <Text style={styles.body}>
            Visual fat loss · muscle definition · conditioning. Complete every
            prescribed set for today&apos;s stimulus.
          </Text>
        </Card>

        {day.extraBlocks?.map((block) => (
          <Card key={block.title} military>
            <Text style={styles.blockTitle}>{block.title}</Text>
            <Text style={styles.body}>{block.description}</Text>
          </Card>
        ))}

        {day.coachMessage ? (
          <Text style={styles.coach}>{day.coachMessage}</Text>
        ) : null}

        <Text style={styles.sectionLabel}>Today&apos;s movements</Text>
        {day.exercises.map((exercise, index) => {
          const r = resolveExercise(exercise, tier);
          return (
            <Text key={exercise.id} style={styles.moveRow}>
              {index + 1}. {r.name} —{' '}
              {r.durationSec
                ? `${r.durationSec}s`
                : `${r.reps ?? ''}${exercise.perSide ? ' / side' : ''}`}
            </Text>
          );
        })}

        {isDayCompleted(day.day) ? (
          <AppButton
            label="Already complete — go to Today"
            variant="secondary"
            onPress={() => router.replace('/(tabs)/today')}
          />
        ) : (
          <AppButton
            label="START MISSION"
            variant="military"
            onPress={() => launch(day)}
          />
        )}
      </Screen>
    );
  }

  if (active.phase === 'rest') {
    return (
      <Screen scroll={false} contentStyle={styles.centered}>
        <Text style={styles.kicker}>{phaseLabel(active.phase)}</Text>
        <Text style={styles.meta}>
          Round {active.currentRound}/{active.totalRounds} · Session{' '}
          {formatClock(active.elapsedSec)}
        </Text>
        <RestTimer
          seconds={active.restRemainingSec}
          onSkip={() => finishRest(day)}
        />
      </Screen>
    );
  }

  if (active.phase === 'hold' && resolved) {
    return (
      <Screen scroll={false} contentStyle={styles.centered}>
        <Text style={styles.kicker}>
          ROUND {active.currentRound}/{active.totalRounds}
        </Text>
        <Text style={styles.title}>{resolved.name}</Text>
        <Text style={styles.holdTimer}>{formatClock(active.holdRemainingSec)}</Text>
        <Text style={styles.meta}>Hold strong. Completes automatically.</Text>
        <View style={styles.row}>
          <AppButton
            label="Complete now"
            variant="military"
            onPress={() => completeExercise(day)}
            style={styles.flex}
          />
          <AppButton
            label="Skip"
            variant="secondary"
            onPress={() => skipExercise(day)}
            style={styles.flex}
          />
        </View>
      </Screen>
    );
  }

  if (active.phase === 'exercise' && resolved) {
    return (
      <Screen>
        <Text style={styles.kicker}>
          DAY {day.day} · {formatClock(active.elapsedSec)}
        </Text>
        <ExerciseStep
          exercise={resolved}
          tier={tier}
          round={active.currentRound}
          totalRounds={active.totalRounds}
          index={active.exerciseIndex + 1}
          totalExercises={day.exercises.length}
          onComplete={() => completeExercise(day)}
          onSkip={() => skipExercise(day)}
          onModify={() => {
            const target = parseRepTarget(resolved.reps) ?? 0;
            const reduced = Math.max(1, Math.floor(target * 0.7));
            completeExercise(day, { modified: true, completedReps: reduced });
          }}
        />
      </Screen>
    );
  }

  if (active.phase === 'rating') {
    return (
      <Screen>
        <Text style={styles.kicker}>RATE MISSION</Text>
        <Text style={styles.title}>How hard was Day {day.day}?</Text>
        <Text style={styles.meta}>
          This feeds adaptive difficulty later. 1 = easy, 5 = extremely hard.
        </Text>
        <View style={styles.ratings}>
          {[1, 2, 3, 4, 5].map((value) => (
            <AppButton
              key={value}
              label={`${value}`}
              variant={active.difficultyRating === value ? 'primary' : 'secondary'}
              onPress={() => setRating(value)}
              style={styles.rateBtn}
            />
          ))}
        </View>
        <AppButton
          label="Save & unlock next day"
          variant="military"
          onPress={finishAndSave}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <EmptyState
        title="Session error"
        description="Could not render this mission phase."
        actionLabel="Restart mission"
        onAction={() => {
          clearSession();
          resumeOrBegin({
            programId: OPERATION_IRON_14.id,
            day,
            difficulty: tier,
          });
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  sectionLabel: {
    ...typography.overline,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  moveRow: {
    ...typography.body,
    color: colors.textPrimary,
  },
  blockTitle: {
    ...typography.subheading,
    color: colors.militaryAccent,
    marginBottom: spacing.xs,
  },
  coach: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  holdTimer: {
    fontSize: 72,
    fontWeight: '800',
    color: colors.accent,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  ratings: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginVertical: spacing.md,
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
