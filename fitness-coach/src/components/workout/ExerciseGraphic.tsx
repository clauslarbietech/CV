import { StyleSheet, Text, View } from 'react-native';

import { ExercisePoseSvg } from '@/components/workout/ExercisePoseSvg';
import { MuscleMapSvg } from '@/components/workout/MuscleMapSvg';
import {
  getExerciseVisual,
  muscleLabel,
} from '@/constants/exercises/exerciseVisuals';
import { colors, radii, spacing, typography } from '@/theme';

interface ExerciseGraphicProps {
  exerciseName: string;
  compact?: boolean;
}

export function ExerciseGraphic({
  exerciseName,
  compact = false,
}: ExerciseGraphicProps) {
  const visual = getExerciseVisual(exerciseName);

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>FORM GUIDE</Text>
        </View>
        <Text style={styles.hint}>Neon = working muscles</Text>
      </View>

      <View style={styles.art}>
        <ExercisePoseSvg
          pose={visual.pose}
          muscles={visual.muscles}
          width={compact ? 220 : 280}
          height={compact ? 140 : 180}
        />
      </View>

      <Text style={styles.cue}>{visual.cue}</Text>

      <View style={styles.muscleRow}>
        {visual.muscles.map((muscle) => (
          <View key={muscle} style={styles.chip}>
            <Text style={styles.chipText}>{muscleLabel(muscle)}</Text>
          </View>
        ))}
      </View>

      {!compact ? (
        <View style={styles.mapBlock}>
          <Text style={styles.mapLabel}>Muscle recovery map</Text>
          <MuscleMapSvg muscles={visual.muscles} />
          <View style={styles.tips}>
            {visual.formTips.map((tip) => (
              <Text key={tip} style={styles.tip}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  compact: {
    padding: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  badgeText: {
    ...typography.caption,
    color: colors.black,
    fontWeight: '800',
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  art: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: radii.xl,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  cue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: 'rgba(192,255,0,0.12)',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  chipText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
  },
  mapBlock: {
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  mapLabel: {
    ...typography.overline,
    color: colors.textMuted,
    alignSelf: 'flex-start',
  },
  tips: {
    alignSelf: 'stretch',
    gap: 2,
  },
  tip: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
