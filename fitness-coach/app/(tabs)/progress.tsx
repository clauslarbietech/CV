import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DayCompletionStrip } from '@/components/charts/DayCompletionStrip';
import { MissionDashboard } from '@/components/charts/MissionDashboard';
import { ResearchMilestonesCard } from '@/components/progress/ResearchMilestonesCard';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { getActiveProgram } from '@/constants/programs';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useTheme, spacing, typography } from '@/theme';

export default function ProgressScreen() {
  const [showResearch, setShowResearch] = useState(false);
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.militaryAccent },
        title: { ...typography.title, color: colors.textPrimary },
        accent: { color: colors.accentText },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.sm,
        },
        hint: {
          ...typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        more: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '700',
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const sessions = useProgramStore((s) => s.sessions);
  const streaks = useProgramStore((s) => s.streaks);
  const daily = useProgramStore((s) => s.daily);
  const program = getActiveProgram(enrollment?.programId);

  const completed = enrollment?.completedDayIds.length ?? 0;
  const totalMinutes = Math.round(
    sessions.reduce((sum, s) => sum + (s.durationSec ?? 0), 0) / 60,
  );
  const programProgress =
    program.durationDays > 0 ? completed / program.durationDays : 0;

  return (
    <Screen>
      <Text style={styles.kicker}>{program.name} PROGRESS</Text>
      <Text style={styles.title}>
        Track <Text style={styles.accent}>Progress</Text>
      </Text>

      <MissionDashboard
        compact
        programLabel={`${program.name} · ${completed}/${program.durationDays} missions`}
        programProgress={programProgress}
        currentDay={enrollment?.currentDay ?? 1}
        totalDays={program.durationDays}
        streakDays={streaks.workoutStreak}
        longestStreak={streaks.longestWorkoutStreak}
        medsDone={daily.medicationsLogged ? 1 : 0}
        medsTotal={1}
        sessionsCount={sessions.length}
        totalMinutes={totalMinutes}
        daily={daily}
        completedDays={completed}
      />

      <Text style={styles.section}>Completed days</Text>
      <Text style={styles.hint}>
        Each dot is a program day — filled = done, blue = today.
      </Text>
      <Card military accentBorder>
        <DayCompletionStrip
          totalDays={program.durationDays}
          completedDayIds={enrollment?.completedDayIds ?? []}
          currentDay={enrollment?.currentDay ?? 1}
        />
      </Card>

      <Pressable onPress={() => setShowResearch((v) => !v)} accessibilityRole="button">
        <Text style={styles.more}>
          {showResearch ? 'Hide research briefs ↑' : 'View research briefs & milestones →'}
        </Text>
      </Pressable>

      {showResearch ? <ResearchMilestonesCard completedDays={completed} /> : null}
    </Screen>
  );
}
