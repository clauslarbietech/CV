import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BodySilhouette } from '@/components/body/BodySilhouette';
import { Card } from '@/components/ui/Card';
import {
  BODY_FRAME_LABELS,
  interpolateBodyScale,
} from '@/constants/bodyVision';
import { BodyFrameSize } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

type BodyVisionCardProps = {
  sex?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  currentFrame: BodyFrameSize;
  goalFrame: BodyFrameSize;
  currentWeightKg?: number;
  goalWeightKg?: number;
  currentPhotoUri?: string | null;
  programProgress: number;
  programLabel?: string;
};

export function BodyVisionCard({
  sex,
  currentFrame,
  goalFrame,
  currentWeightKg,
  goalWeightKg,
  currentPhotoUri,
  programProgress,
  programLabel,
}: BodyVisionCardProps) {
  const { colors } = useTheme();
  const journeyScale = interpolateBodyScale(currentFrame, goalFrame, programProgress);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        body: {
          ...typography.caption,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        row: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        col: { flex: 1 },
        journeyBox: {
          marginTop: spacing.md,
          backgroundColor: colors.surfaceHover,
          borderRadius: 12,
          padding: spacing.md,
          alignItems: 'center',
          gap: spacing.sm,
        },
        journeyLabel: {
          ...typography.overline,
          color: colors.textMuted,
        },
        journeyMeta: {
          ...typography.caption,
          color: colors.textSecondary,
          textAlign: 'center',
        },
        weightRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: spacing.sm,
        },
        weight: {
          ...typography.caption,
          color: colors.textMuted,
        },
      }),
    [colors],
  );

  const pct = Math.round(programProgress * 100);

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>BODY VISION</Text>
      <Text style={styles.title}>Now → Goal</Text>
      <Text style={styles.body}>
        Pick silhouettes or a photo for where you are, and a target frame for
        where you&apos;re headed. Your journey view blends toward the goal as
        you complete missions{programLabel ? ` on ${programLabel}` : ''}.
      </Text>

      <View style={styles.row}>
        <View style={styles.col}>
          <BodySilhouette
            sex={sex}
            frame={currentFrame}
            photoUri={currentPhotoUri}
            label="Now"
            compact
          />
        </View>
        <View style={styles.col}>
          <BodySilhouette sex={sex} frame={goalFrame} label="Goal" compact />
        </View>
      </View>

      {(currentWeightKg != null || goalWeightKg != null) && (
        <View style={styles.weightRow}>
          <Text style={styles.weight}>
            Weight now: {currentWeightKg != null ? `${currentWeightKg} kg` : '—'}
          </Text>
          <Text style={styles.weight}>
            Target: {goalWeightKg != null ? `${goalWeightKg} kg` : '—'}
          </Text>
        </View>
      )}

      <View style={styles.journeyBox}>
        <Text style={styles.journeyLabel}>Journey · {pct}%</Text>
        <BodySilhouette
          sex={sex}
          frame={currentFrame}
          scaleOverride={journeyScale}
          photoUri={currentPhotoUri && programProgress > 0 ? currentPhotoUri : null}
          compact
        />
        <Text style={styles.journeyMeta}>
          {BODY_FRAME_LABELS[currentFrame]} → {BODY_FRAME_LABELS[goalFrame]}
          {pct > 0 ? ` · ${pct}% of program complete` : ' · start your first mission'}
        </Text>
      </View>
    </Card>
  );
}
