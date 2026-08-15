import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DailyMissionCard } from '@/components/today/DailyMissionCard';
import { ExpressTimeCard } from '@/components/today/ExpressTimeCard';
import { RemindersPanel } from '@/components/today/RemindersPanel';
import { AppButton } from '@/components/ui/AppButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { Screen } from '@/components/ui/Screen';
import { ExpressBudget } from '@/constants/programs/expressMissions';
import { getActiveProgram, OPERATION_IRON_30 } from '@/constants/programs';
import { useNotesStore } from '@/store/notesStore';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useSessionStore } from '@/store/sessionStore';
import { getProgramDay } from '@/utils/workout';
import { useTheme, spacing, typography } from '@/theme';

export default function TodayScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: {
          ...typography.overline,
          color: colors.militaryAccent,
        },
        greeting: {
          ...typography.caption,
          color: colors.textMuted,
        },
        title: {
          ...typography.title,
          color: colors.textPrimary,
        },
        accent: {
          color: colors.accent,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
        },
        progressLine: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: spacing.xs,
        },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.sm,
        },
        metrics: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
        },
      }),
    [colors],
  );

  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const streaks = useProgramStore((s) => s.streaks);
  const sessions = useProgramStore((s) => s.sessions);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);
  const active = useSessionStore((s) => s.active);
  const meds = useNotesStore((s) => s.meds);
  const isMedTakenToday = useNotesStore((s) => s.isMedTakenToday);

  const startIron30 = () => {
    enrollInProgram(OPERATION_IRON_30.id, 'soldier');
    router.push({
      pathname: '/session/[programId]',
      params: { programId: OPERATION_IRON_30.id, day: '1' },
    });
  };

  if (!enrollment) {
    return (
      <Screen>
        <Text style={styles.kicker}>READY TO TRAIN</Text>
        <Text style={styles.title}>
          Start <Text style={styles.accent}>Day 1</Text>
        </Text>
        <Text style={styles.body}>
          OPERATION IRON 30 — no equipment. Tap below to begin testing the
          workout engine.
        </Text>
        <AppButton
          label="START DAY 1 MISSION"
          variant="military"
          onPress={startIron30}
        />
        <AppButton
          label="View nutrition & fasting"
          variant="secondary"
          onPress={() => router.push('/(tabs)/nutrition')}
        />
        <RemindersPanel />
      </Screen>
    );
  }

  const program = getActiveProgram(enrollment.programId);
  const day =
    getProgramDay(program, enrollment.currentDay) ?? program.days[0];
  const dayCompleted = enrollment.completedDayIds.includes(day.day);
  const completedCount = enrollment.completedDayIds.length;
  const lastSession = sessions.find((s) => s.day === day.day);
  const medsDone = meds.filter((m) => isMedTakenToday(m.id)).length;
  const clearSession = useSessionStore((s) => s.clear);
  const resumable =
    active &&
    active.programId === program.id &&
    active.day === day.day &&
    active.phase !== 'complete' &&
    active.phase !== 'briefing';

  const openMission = (express?: ExpressBudget) => {
    // Restart if switching between full day and an express budget (or between budgets).
    if (
      active &&
      active.programId === program.id &&
      active.day === day.day &&
      active.expressMinutes !== express
    ) {
      clearSession();
    }
    router.push({
      pathname: '/session/[programId]',
      params: {
        programId: program.id,
        day: String(day.day),
        ...(express ? { express: String(express) } : {}),
      },
    });
  };

  return (
    <Screen>
      <Text style={styles.kicker}>TODAY&apos;S MISSION</Text>
      <Text style={styles.greeting}>
        {profile?.firstName ?? 'Athlete'} · {enrollment.difficulty.toUpperCase()}
      </Text>
      <Text style={styles.progressLine}>
        {completedCount}/{program.durationDays} missions · Streak{' '}
        {streaks.workoutStreak} · Meds {medsDone}/{meds.length}
      </Text>

      <DailyMissionCard
        program={program}
        day={day}
        tier={enrollment.difficulty}
        completed={dayCompleted}
        onStart={() => openMission()}
      />

      {resumable ? (
        <AppButton
          label={
            active.expressMinutes
              ? `Resume ${active.expressMinutes}-min express`
              : 'Resume active mission'
          }
          variant="military"
          onPress={() => openMission(active.expressMinutes)}
        />
      ) : null}

      <ExpressTimeCard
        disabled={dayCompleted}
        onSelect={(budget) => openMission(budget)}
      />

      <AppButton
        label="Open nutrition & fasting plan"
        variant="secondary"
        onPress={() => router.push('/(tabs)/nutrition')}
      />

      <Text style={styles.section}>Mission metrics</Text>
      <View style={styles.metrics}>
        <MetricCard
          label="Program day"
          value={`${day.day}`}
          subtitle={`of ${program.durationDays}`}
        />
        <MetricCard
          label="Completed"
          value={`${completedCount}`}
          subtitle="missions"
          complete={completedCount > 0}
        />
        <MetricCard
          label="Last duration"
          value={
            lastSession?.durationSec
              ? `${Math.round(lastSession.durationSec / 60)}m`
              : '—'
          }
        />
        <MetricCard
          label="Meds today"
          value={`${medsDone}/${meds.length}`}
          complete={meds.length > 0 && medsDone === meds.length}
        />
      </View>

      <RemindersPanel />
    </Screen>
  );
}
