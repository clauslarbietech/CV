import { StyleSheet, Text, View } from 'react-native';

import { StreakCard } from '@/components/progress/StreakCard';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Screen } from '@/components/ui/Screen';
import { OPERATION_IRON_14 } from '@/constants/programs';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { colors, spacing, typography } from '@/theme';

export default function ProgressScreen() {
  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const sessions = useProgramStore((s) => s.sessions);
  const streaks = useProgramStore((s) => s.streaks);

  const completed = enrollment?.completedDayIds.length ?? 0;
  const totalMinutes = Math.round(
    sessions.reduce((sum, s) => sum + (s.durationSec ?? 0), 0) / 60,
  );

  return (
    <Screen>
      <Text style={styles.kicker}>PROGRESS CENTER</Text>
      <Text style={styles.title}>Track what compounds</Text>

      <Text style={styles.section}>Body</Text>
      <View style={styles.metrics}>
        <MetricCard
          label="Weight"
          value={
            profile?.currentWeightKg != null
              ? `${profile.currentWeightKg} kg`
              : '—'
          }
          subtitle={
            profile?.goalWeightKg != null
              ? `Goal ${profile.goalWeightKg} kg`
              : 'Set in profile'
          }
        />
        <MetricCard label="Waist" value="—" subtitle="Log soon" />
      </View>

      <Text style={styles.section}>Performance</Text>
      <Card>
        <Text style={styles.row}>
          Workouts completed: {sessions.length}
        </Text>
        <Text style={styles.row}>Total minutes: {totalMinutes}</Text>
        <Text style={styles.row}>
          {OPERATION_IRON_14.name}: {completed} / {OPERATION_IRON_14.durationDays}
        </Text>
      </Card>

      <Text style={styles.section}>Consistency</Text>
      <StreakCard
        streaks={streaks}
        xp={profile?.xp ?? 0}
        rank={profile?.rank ?? 'Recruit'}
      />

      <Text style={styles.section}>Achievements</Text>
      <Card military>
        <Text style={styles.badgeTitle}>IRON 14 BADGE</Text>
        <Text style={styles.row}>
          {completed >= 14
            ? 'Earned — OPERATION IRON 14 COMPLETE'
            : `Progress ${completed}/14 missions`}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
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
  row: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  badgeTitle: {
    ...typography.subheading,
    color: colors.militaryAccent,
    marginBottom: spacing.xs,
  },
});
