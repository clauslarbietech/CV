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
  const totalSets = sessions.reduce(
    (sum, s) => sum + (s.exerciseLogs?.length ?? 0),
    0,
  );

  return (
    <Screen>
      <Text style={styles.kicker}>IRON 14 PROGRESS</Text>
      <Text style={styles.title}>Transformation tracking</Text>
      <Text style={styles.subtitle}>
        Basic progress only — enough to prove Day 1 → Day 14 completion.
      </Text>

      <View style={styles.metrics}>
        <MetricCard
          label="Missions"
          value={`${completed}`}
          subtitle={`/ ${OPERATION_IRON_14.durationDays}`}
          complete={completed > 0}
        />
        <MetricCard
          label="Minutes"
          value={`${totalMinutes}`}
          subtitle="trained"
        />
        <MetricCard label="Sets logged" value={`${totalSets}`} />
        <MetricCard
          label="Current day"
          value={`${enrollment?.currentDay ?? 1}`}
          accentColor={colors.militaryAccent}
        />
      </View>

      <StreakCard
        streaks={streaks}
        xp={profile?.xp ?? 0}
        rank={profile?.rank ?? 'Recruit'}
      />

      <Text style={styles.section}>Completed days</Text>
      <Card military>
        <Text style={styles.row}>
          {(enrollment?.completedDayIds.length
            ? enrollment.completedDayIds.map((d) => `Day ${d}`).join(' · ')
            : 'No missions completed yet. Start Day 1.')}
        </Text>
      </Card>

      <Text style={styles.section}>Achievement</Text>
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
    color: colors.militaryAccent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
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
  },
  badgeTitle: {
    ...typography.subheading,
    color: colors.militaryAccent,
    marginBottom: spacing.xs,
  },
});
