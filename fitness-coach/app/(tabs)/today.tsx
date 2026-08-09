import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { DailyMissionCard } from '@/components/today/DailyMissionCard';
import { AppButton } from '@/components/ui/AppButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { Screen } from '@/components/ui/Screen';
import { OPERATION_IRON_14 } from '@/constants/programs';
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
  const enrollInIron14 = useProgramStore((s) => s.enrollInIron14);
  const active = useSessionStore((s) => s.active);

  if (!enrollment || enrollment.programId !== OPERATION_IRON_14.id) {
    return (
      <Screen>
        <Text style={styles.kicker}>TRANSFORMATION ENGINE</Text>
        <Text style={styles.title}>OPERATION IRON 14</Text>
        <Text style={styles.body}>
          14 days. Visual fat loss. Muscle definition. Athletic shredding. Your
          first mission starts now.
        </Text>
        <AppButton
          label="Start OPERATION IRON 14"
          variant="military"
          onPress={() => {
            enrollInIron14(
              profile?.experienceLevel === 'beginner'
                ? 'recruit'
                : profile?.experienceLevel === 'advanced'
                  ? 'elite'
                  : 'soldier',
            );
          }}
        />
      </Screen>
    );
  }

  const day =
    getProgramDay(OPERATION_IRON_14, enrollment.currentDay) ??
    OPERATION_IRON_14.days[0];
  const dayCompleted = enrollment.completedDayIds.includes(day.day);
  const completedCount = enrollment.completedDayIds.length;
  const lastSession = sessions.find((s) => s.day === day.day);
  const resumable =
    active &&
    active.programId === OPERATION_IRON_14.id &&
    active.day === day.day &&
    active.phase !== 'complete' &&
    active.phase !== 'briefing';

  const openMission = () => {
    router.push({
      pathname: '/session/[programId]',
      params: {
        programId: OPERATION_IRON_14.id,
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
        {completedCount}/14 missions · Streak {streaks.workoutStreak} ·{' '}
        {profile?.xp ?? 0} XP
      </Text>

      <DailyMissionCard
        program={OPERATION_IRON_14}
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

      {dayCompleted ? (
        <View style={styles.nextBox}>
          <Text style={styles.nextTitle}>Day {day.day} secured</Text>
          <Text style={styles.body}>
            {completedCount >= 14
              ? 'OPERATION IRON 14 complete. Badge earned.'
              : `Day ${enrollment.currentDay} is unlocked. Keep the shredding streak alive.`}
          </Text>
          {completedCount < 14 ? (
            <AppButton
              label={`Start Day ${enrollment.currentDay}`}
              variant="military"
              onPress={openMission}
            />
          ) : null}
        </View>
      ) : null}

      <Text style={styles.section}>Mission metrics</Text>
      <View style={styles.metrics}>
        <MetricCard
          label="Program day"
          value={`${day.day}`}
          subtitle="of 14"
          complete={!dayCompleted}
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
          subtitle="minutes"
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
  nextBox: {
    gap: spacing.sm,
  },
  nextTitle: {
    ...typography.subheading,
    color: colors.accent,
  },
});
