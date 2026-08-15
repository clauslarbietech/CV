import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { MuscleMapSvg } from '@/components/workout/MuscleMapSvg';
import {
  getExerciseVisual,
  muscleLabel,
} from '@/constants/exercises/exerciseVisuals';
import { getPoseImage } from '@/constants/exercises/poseImages';
import { useProfileStore } from '@/store/profileStore';
import { useTheme, radii, spacing, typography } from '@/theme';

interface ExerciseGraphicProps {
  exerciseName: string;
  compact?: boolean;
}

export function ExerciseGraphic({
  exerciseName,
  compact = false,
}: ExerciseGraphicProps) {
  const { colors } = useTheme();
  const sex = useProfileStore((s) => s.profile?.sex);
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          backgroundColor: '#0A0A0A',
          borderRadius: radii.xl,
          overflow: 'hidden',
          aspectRatio: 1,
          width: '100%',
        },
        artCompact: {
          aspectRatio: 1.15,
        },
        image: {
          width: '100%',
          height: '100%',
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
      }),
    [colors],
  );

  const visual = getExerciseVisual(exerciseName);
  const image = getPoseImage(visual.pose, sex);
  const bodyLabel = sex === 'female' ? 'Female form' : 'Male form';

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>FORM GUIDE</Text>
        </View>
        <Text style={styles.hint}>
          {bodyLabel} · Neon = working muscles
        </Text>
      </View>

      <View style={[styles.art, compact && styles.artCompact]}>
        <Image
          source={image}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`${exerciseName} ${bodyLabel.toLowerCase()} illustration`}
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
          <MuscleMapSvg muscles={visual.muscles} sex={sex} />
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
