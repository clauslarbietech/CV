import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { StreakState } from '@/types';
import { colors, spacing, typography } from '@/theme';

interface StreakCardProps {
  streaks: StreakState;
  xp: number;
  rank: string;
}

export function StreakCard({ streaks, xp, rank }: StreakCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Consistency</Text>
      <View style={styles.row}>
        <Stat label="Workout streak" value={`${streaks.workoutStreak}`} />
        <Stat label="Longest" value={`${streaks.longestWorkoutStreak}`} />
      </View>
      <View style={styles.row}>
        <Stat label="XP" value={`${xp}`} />
        <Stat label="Rank" value={rank} />
      </View>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  value: {
    ...typography.metric,
    color: colors.accent,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
