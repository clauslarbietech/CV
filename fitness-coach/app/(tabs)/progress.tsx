import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ResearchMilestonesCard } from '@/components/progress/ResearchMilestonesCard';
import { StreakCard } from '@/components/progress/StreakCard';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Screen } from '@/components/ui/Screen';
import { getActiveProgram } from '@/constants/programs';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useTheme, spacing, typography } from '@/theme';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.militaryAccent },
        title: { ...typography.title, color: colors.textPrimary },
        accent: { color: colors.accent },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.sm,
        },
        metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
        row: { ...typography.body, color: colors.textSecondary },
      }),
    [colors],
  );

  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const sessions = useProgramStore((s) => s.sessions);
  const streaks = useProgramStore((s) => s.streaks);
  const program = getActiveProgram(enrollment?.programId);

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
      <Text style={styles.kicker}>{program.name} PROGRESS</Text>
      <Text style={styles.title}>
        Track <Text style={styles.accent}>Progress</Text>
      </Text>

      <View style={styles.metrics}>
        <MetricCard
          label="Missions"
          value={`${completed}`}
          subtitle={`/ ${program.durationDays}`}
          complete={completed > 0}
        />
        <MetricCard label="Minutes" value={`${totalMinutes}`} />
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
      <Card military accentBorder>
        <Text style={styles.row}>
          {enrollment?.completedDayIds.length
            ? enrollment.completedDayIds.map((d) => `Day ${d}`).join(' · ')
            : 'No missions completed yet. Start Day 1.'}
        </Text>
      </Card>

      <ResearchMilestonesCard completedDays={completed} />
    </Screen>
  );
}
