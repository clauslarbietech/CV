import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { StreakState } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

interface StreakCardProps {
  streaks: StreakState;
  xp: number;
  rank: string;
}

export function StreakCard({ streaks, xp, rank }: StreakCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          color: colors.accentText,
        },
        label: {
          ...typography.caption,
          color: colors.textMuted,
        },
      }),
    [colors],
  );

  return (
    <Card>
      <Text style={styles.title}>Consistency</Text>
      <View style={styles.row}>
        <Stat label="Workout streak" value={`${streaks.workoutStreak}`} styles={styles} />
        <Stat label="Longest" value={`${streaks.longestWorkoutStreak}`} styles={styles} />
      </View>
      <View style={styles.row}>
        <Stat label="XP" value={`${xp}`} styles={styles} />
        <Stat label="Rank" value={rank} styles={styles} />
      </View>
    </Card>
  );
}

function Stat({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: {
    stat: object;
    value: object;
    label: object;
  };
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
