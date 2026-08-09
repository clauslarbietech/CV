import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CoachMessage } from '@/components/today/CoachMessage';
import { DailyMissionCard } from '@/components/today/DailyMissionCard';
import { AppButton } from '@/components/ui/AppButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { Screen } from '@/components/ui/Screen';
import { COACH_PERSONALITIES, coachTipForDay } from '@/constants/coach';
import { OPERATION_IRON_14 } from '@/constants/programs';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { getProgramDay } from '@/utils/workout';
import { colors, spacing, typography } from '@/theme';

export default function TodayScreen() {
  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const daily = useProgramStore((s) => s.daily);
  const streaks = useProgramStore((s) => s.streaks);
  const completeCheckIn = useProgramStore((s) => s.completeCheckIn);
  const enrollInIron14 = useProgramStore((s) => s.enrollInIron14);

  if (!enrollment) {
    return (
      <Screen>
        <Text style={styles.greeting}>
          Hey {profile?.firstName ?? 'Athlete'}
        </Text>
        <Text style={styles.title}>No active mission</Text>
        <Text style={styles.body}>
          Enroll in OPERATION IRON 14 to get today&apos;s coaching plan.
        </Text>
        <AppButton
          label="Start OPERATION IRON 14"
          variant="military"
          onPress={() => enrollInIron14('soldier')}
        />
      </Screen>
    );
  }

  const day =
    getProgramDay(OPERATION_IRON_14, enrollment.currentDay) ??
    OPERATION_IRON_14.days[0];
  const completed = enrollment.completedDayIds.includes(day.day);
  const proteinShortfall = Math.max(0, daily.proteinTarget - daily.proteinG);
  const personality =
    COACH_PERSONALITIES.find((c) => c.id === profile?.coachPersonality)?.name ??
    'Coach';

  const tip = coachTipForDay({
    personality: profile?.coachPersonality ?? 'motivator',
    day: day.day,
    programName: OPERATION_IRON_14.name,
    proteinShortfallG: proteinShortfall,
  });

  return (
    <Screen>
      <Text style={styles.greeting}>
        Hey {profile?.firstName ?? 'Athlete'} · Day {day.day}
      </Text>
      <Text style={styles.streak}>
        Streak {streaks.workoutStreak} · {profile?.rank ?? 'Recruit'} ·{' '}
        {profile?.xp ?? 0} XP
      </Text>

      <DailyMissionCard
        program={OPERATION_IRON_14}
        day={day}
        tier={enrollment.difficulty}
        completed={completed}
        onStart={() =>
          router.push({
            pathname: '/session/[programId]',
            params: {
              programId: OPERATION_IRON_14.id,
              day: String(day.day),
            },
          })
        }
      />

      <Text style={styles.section}>Daily progress</Text>
      <View style={styles.metrics}>
        <MetricCard
          label="Workout"
          value={daily.workoutCompleted || completed ? 'Done' : 'Pending'}
          complete={daily.workoutCompleted || completed}
        />
        <MetricCard
          label="Steps"
          value={`${daily.steps}`}
          subtitle={`/ ${daily.stepsTarget}`}
          accentColor={colors.steps}
        />
        <MetricCard
          label="Protein"
          value={`${daily.proteinG}g`}
          subtitle={`/ ${daily.proteinTarget}g`}
          accentColor={colors.protein}
        />
        <MetricCard
          label="Calories"
          value={`${daily.calories}`}
          subtitle={`/ ${daily.calorieTarget}`}
          accentColor={colors.warning}
        />
        <MetricCard
          label="Water"
          value={`${(daily.waterMl / 1000).toFixed(1)}L`}
          subtitle={`/ ${(daily.waterTarget / 1000).toFixed(1)}L`}
          accentColor={colors.water}
        />
        <MetricCard
          label="Check-in"
          value={daily.checkInCompleted ? 'Done' : 'Open'}
          complete={daily.checkInCompleted}
        />
      </View>

      {!daily.checkInCompleted ? (
        <AppButton
          label="Complete daily check-in"
          variant="secondary"
          onPress={completeCheckIn}
        />
      ) : null}

      <CoachMessage message={tip} personalityLabel={personality} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  streak: {
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
