import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { BODY_FRAME_LABELS } from '@/constants/bodyVision';
import { BodyFrameSize } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

type WeightGoalsCardProps = {
  currentWeightKg?: number;
  goalWeightKg?: number;
  currentFrame?: BodyFrameSize | null;
  goalFrame?: BodyFrameSize | null;
  primaryGoal?: string;
  programId?: string;
};

function goalLabel(goal?: string): string {
  switch (goal) {
    case 'lose_fat':
      return 'Lose fat';
    case 'build_muscle':
      return 'Get stronger';
    case 'endurance':
      return 'Build stamina';
    case 'recomposition':
      return 'Recompose';
    default:
      return 'Feel healthier';
  }
}

export function WeightGoalsCard({
  currentWeightKg,
  goalWeightKg,
  currentFrame,
  goalFrame,
  primaryGoal,
  programId,
}: WeightGoalsCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: spacing.sm,
          marginTop: spacing.sm,
        },
        cell: { flex: 1 },
        label: {
          ...typography.caption,
          color: colors.textMuted,
        },
        value: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: 2,
        },
        hint: {
          ...typography.caption,
          color: colors.textSecondary,
          marginTop: spacing.sm,
        },
        link: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '700',
          marginTop: spacing.xs,
        },
      }),
    [colors],
  );

  const hasAny =
    currentWeightKg != null ||
    goalWeightKg != null ||
    currentFrame ||
    goalFrame;

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>YOUR GOALS</Text>
      <Text style={styles.title}>{goalLabel(primaryGoal)}</Text>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.label}>Weight now</Text>
          <Text style={styles.value}>
            {currentWeightKg != null ? `${currentWeightKg} kg` : '—'}
          </Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Goal weight</Text>
          <Text style={styles.value}>
            {goalWeightKg != null ? `${goalWeightKg} kg` : '—'}
          </Text>
        </View>
      </View>
      {(currentFrame || goalFrame) && (
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Body now</Text>
            <Text style={styles.value}>
              {currentFrame ? BODY_FRAME_LABELS[currentFrame] : '—'}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Aim for</Text>
            <Text style={styles.value}>
              {goalFrame ? BODY_FRAME_LABELS[goalFrame] : '—'}
            </Text>
          </View>
        </View>
      )}
      <Text style={styles.hint}>
        {hasAny
          ? 'Update anytime in Progress or when you open a program.'
          : 'Set your weight and body goals when you pick a plan — takes a minute.'}
      </Text>
      <Pressable
        onPress={() =>
          programId
            ? router.push({ pathname: '/program/[id]', params: { id: programId } })
            : router.push('/(tabs)/progress')
        }
      >
        <Text style={styles.link}>
          {hasAny ? 'Edit weight & goals →' : 'Set weight & goals →'}
        </Text>
      </Pressable>
    </Card>
  );
}
