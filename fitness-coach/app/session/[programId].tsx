import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ExerciseGraphic } from '@/components/workout/ExerciseGraphic';
import { ExerciseStep } from '@/components/workout/ExerciseStep';
import { RestTimer } from '@/components/workout/RestTimer';
import { WorkoutFuelCard } from '@/components/nutrition/WorkoutFuelCard';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { BODY_FRAME_LABELS } from '@/constants/bodyVision';
import { getActiveProgram } from '@/constants/programs';
import {
  ExpressBudget,
  toExpressMission,
} from '@/constants/programs/expressMissions';
import {
  formatClock,
  parseRepTarget,
  phaseLabel,
  resolvedCurrentExercise,
} from '@/features/workouts/sessionEngine';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useSessionStore } from '@/store/sessionStore';
import { useSquadStore } from '@/store/squadStore';
import {
  buildProgramProgressMessage,
  textOrShareProgress,
} from '@/utils/accountabilityShare';
import { formatDuration, formatRest } from '@/utils/format';
import { getProgramDay, resolveExercise } from '@/utils/workout';
import { useTheme, spacing, typography } from '@/theme';

function parseExpressBudget(value?: string): ExpressBudget | undefined {
  const n = Number(value);
  if (n === 8 || n === 10 || n === 15) return n;
  return undefined;
}

export default function WorkoutSessionScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        centered: { flexGrow: 1, justifyContent: 'center' },
        kicker: { ...typography.overline, color: colors.militaryAccent },
        title: { ...typography.title, color: colors.textPrimary },
        meta: { ...typography.body, color: colors.textSecondary },
        body: { ...typography.body, color: colors.textSecondary },
        sectionLabel: {
          ...typography.overline,
          color: colors.textMuted,
          marginTop: spacing.sm,
        },
        moveRow: { ...typography.body, color: colors.textPrimary },
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
        holdRing: {
          width: 220,
          height: 220,
          borderRadius: 110,
          borderWidth: 8,
          borderColor: colors.action,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          backgroundColor: colors.surface,
          marginVertical: spacing.lg,
        },
        holdTimer: {
          fontSize: 56,
          fontWeight: '800',
          color: colors.textPrimary,
          textAlign: 'center',
        },
        row: { flexDirection: 'row', gap: spacing.sm },
        flex: { flex: 1 },
        ratings: {
          flexDirection: 'row',
          gap: spacing.xs,
          marginVertical: spacing.md,
        },
        rateBtn: { flex: 1, minHeight: 48, paddingHorizontal: 0 },
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
      }),
    [colors],
  );

  const {
    programId,
    day: dayParam,
    express: expressParam,
  } = useLocalSearchParams<{
    programId: string;
    day?: string;
    express?: string;
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

  const program = getActiveProgram(programId);
  const dayNumber = Number(dayParam ?? enrollment?.currentDay ?? 1);
  const expressMinutes = parseExpressBudget(expressParam);
  const baseDay = getProgramDay(program, dayNumber);
  const day = useMemo(() => {
    if (!baseDay) return undefined;
    return expressMinutes
      ? toExpressMission(baseDay, expressMinutes)
      : baseDay;
  }, [baseDay, expressMinutes]);
  const tier = enrollment?.difficulty ?? 'recruit';
  const [savedNextDay, setSavedNextDay] = useState<number | null>(null);

  useEffect(() => {
    if (!day || programId !== program.id) return;
    resumeOrBegin({
      programId: program.id,
      day,
      difficulty: tier,
      expressMinutes,
    });
  }, [dayNumber, programId, tier, program.id, expressMinutes]);

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
  }, [active?.phase, dayNumber, expressMinutes]);

  const resolved = useMemo(() => {
    if (!day || !active) return undefined;
    return resolvedCurrentExercise(day, active);
  }, [day, active]);

  if (!day || programId !== program.id) {
    return (
      <Screen>
        <EmptyState
          title="Workout unavailable"
          description="Could not load this workout day."
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
          description="Start the 30-Day Home Plan from Discover."
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
    completeWorkout({
      day: day.day,
      durationSec: Math.max(active.elapsedSec, 30),
      rating: active.difficultyRating,
      exerciseLogs: active.exerciseLogs,
      roundsCompleted: active.currentRound,
      sessionId: active.id,
      startedAt: active.startedAt,
    });
    markComplete();
    const unlocked =
      useProgramStore.getState().enrollment?.currentDay ?? day.day;
    setSavedNextDay(unlocked);
  };

  if (active.phase === 'complete' || (isDayCompleted(day.day) && savedNextDay)) {
    const nextDay = savedNextDay ?? enrollment.currentDay;
    const completedCount =
      useProgramStore.getState().enrollment?.completedDayIds.length ?? day.day;
    const challengeDone = completedCount >= program.durationDays;

    return (
      <Screen>
        <Text style={styles.kicker}>MISSION COMPLETE</Text>
        <Text style={styles.title}>
          {challengeDone
            ? `${program.name} COMPLETE`
            : `Day ${day.day} complete`}
        </Text>
        <Card military accentBorder>
          <Text style={styles.stat}>
            {completedCount} / {program.durationDays} Workouts
          </Text>
          <Text style={styles.stat}>Duration: {formatClock(active.elapsedSec)}</Text>
          <Text style={styles.stat}>Sets logged: {active.exerciseLogs.length}</Text>
          <Text style={styles.stat}>+100 XP earned</Text>
          <Text style={styles.badge}>
            {challengeDone ? 'CHALLENGE BADGE unlocked' : `Day ${nextDay} unlocked`}
          </Text>
        </Card>

        <WorkoutFuelCard
          expressMinutes={expressMinutes ?? active.expressMinutes}
          estimatedMinutes={day.estimatedMinutes}
          postWorkout
        />

        <AppButton
          label="Text buddy this win"
          variant="action"
          onPress={async () => {
            const squad = useSquadStore.getState().profile;
            const profile = useProfileStore.getState().profile;
            const message = buildProgramProgressMessage({
              userName: profile?.firstName ?? 'Athlete',
              buddyName: squad?.accountabilityName,
              programName: program.name,
              day: day.day,
              totalDays: program.durationDays,
              completedDays: completedCount,
              currentFrame: profile?.bodyVision?.currentFrame
                ? BODY_FRAME_LABELS[profile.bodyVision.currentFrame]
                : undefined,
              goalFrame: profile?.bodyVision?.goalFrame
                ? BODY_FRAME_LABELS[profile.bodyVision.goalFrame]
                : undefined,
              currentWeightKg: profile?.currentWeightKg,
              goalWeightKg: profile?.goalWeightKg,
            });
            await textOrShareProgress({
              phone: squad?.accountabilityPhone,
              message,
            });
          }}
        />
        {!challengeDone && nextDay > day.day ? (
          <AppButton
            label={`Start Day ${nextDay}`}
            variant="military"
            onPress={() => {
              clearSession();
              router.replace({
                pathname: '/session/[programId]',
                params: { programId: program.id, day: String(nextDay) },
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
          {program.name} · {tier.toUpperCase()}
          {expressMinutes ? ` · ${expressMinutes} MIN EXPRESS` : ''}
        </Text>
        <Text style={styles.title}>
          DAY {day.day} — {day.title}
        </Text>
        {day.subtitle ? <Text style={styles.meta}>{day.subtitle}</Text> : null}
        <Text style={styles.meta}>
          {formatDuration(day.estimatedMinutes)}
          {day.rounds ? ` · ${day.rounds} rounds` : ''}
          {formatRest(day.restSec) ? ` · Rest ${formatRest(day.restSec)}` : ''}
        </Text>

        <Card military accentBorder>
          <Text style={styles.sectionLabel}>
            {expressMinutes
              ? 'EXPRESS WORKOUT STRATEGY'
              : 'NO EQUIPMENT MISSION'}
          </Text>
          <Text style={styles.body}>
            {expressMinutes
              ? 'Quick bodyweight session to keep your streak.'
              : 'Bodyweight — fat loss, tone, and fitness.'}
          </Text>
        </Card>

        <WorkoutFuelCard
          expressMinutes={expressMinutes}
          estimatedMinutes={day.estimatedMinutes}
        />

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
        {day.exercises[0] ? (
          <ExerciseGraphic exerciseName={day.exercises[0].name} compact />
        ) : null}
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
      <Screen contentStyle={styles.centered}>
        <Text style={styles.kicker}>
          ROUND {active.currentRound}/{active.totalRounds}
        </Text>
        <Text style={styles.title}>{resolved.name}</Text>
        <ExerciseGraphic exerciseName={resolved.name} compact />
        <View style={styles.holdRing}>
          <Text style={styles.holdTimer}>
            {formatClock(active.holdRemainingSec)}
          </Text>
        </View>
        <Text style={styles.meta}>Hold strong. Completes automatically.</Text>
        <View style={styles.row}>
          <AppButton
            label="Complete now"
            variant="action"
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
        <Text style={styles.meta}>1 = easy · 5 = extremely hard</Text>
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
        description="Could not render this workout phase."
        actionLabel="Restart workout"
        onAction={() => {
          clearSession();
          resumeOrBegin({ programId: program.id, day, difficulty: tier });
        }}
      />
    </Screen>
  );
}
