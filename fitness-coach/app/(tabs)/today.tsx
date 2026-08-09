import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { DailyMissionCard } from '@/components/today/DailyMissionCard';
import { AppButton } from '@/components/ui/AppButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { Screen } from '@/components/ui/Screen';
import { getActiveProgram, OPERATION_IRON_30 } from '@/constants/programs';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useSessionStore } from '@/store/sessionStore';
import { getProgramDay } from '@/utils/workout';
import { colors, spacing, typography } from '@/theme';

export default function TodayScreen() {
  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const streaks = useProgramStore((s) => s.streaks);
  const sessions = useProgramStore((s) => s.sessions);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);
  const active = useSessionStore((s) => s.active);

  if (!enrollment) {
    return (
      <Screen>
        <Text style={styles.kicker}>TRANSFORMATION ENGINE</Text>
        <Text style={styles.title}>
          OPERATION <Text style={styles.accent}>IRON 30</Text>
        </Text>
        <Text style={styles.body}>
          30 days. No equipment. Military bodyweight shred. Start now.
        </Text>
        <AppButton
          label="Start OPERATION IRON 30"
          variant="military"
          onPress={() => enrollInProgram(OPERATION_IRON_30.id, 'soldier')}
        />
      </Screen>
    );
  }

  const program = getActiveProgram(enrollment.programId);
  const day =
    getProgramDay(program, enrollment.currentDay) ?? program.days[0];
  const dayCompleted = enrollment.completedDayIds.includes(day.day);
  const completedCount = enrollment.completedDayIds.length;
  const lastSession = sessions.find((s) => s.day === day.day);
  const resumable =
    active &&
    active.programId === program.id &&
    active.day === day.day &&
    active.phase !== 'complete' &&
    active.phase !== 'briefing';

  const openMission = () => {
    router.push({
      pathname: '/session/[programId]',
      params: {
        programId: program.id,
        day: String(day.day),
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
        {streaks.workoutStreak} · {profile?.xp ?? 0} XP
      </Text>

      <DailyMissionCard
        program={program}
        day={day}
        tier={enrollment.difficulty}
        completed={dayCompleted}
        onStart={openMission}
      />

      {resumable ? (
        <AppButton
          label="Resume active mission"
          variant="military"
          onPress={openMission}
        />
      ) : null}

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
          label="Rank"
          value={profile?.rank ?? 'Recruit'}
          subtitle={`${profile?.xp ?? 0} XP`}
          accentColor={colors.militaryAccent}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
});
