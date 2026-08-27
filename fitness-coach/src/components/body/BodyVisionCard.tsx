import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BodySilhouette } from '@/components/body/BodySilhouette';
import { Card } from '@/components/ui/Card';
import {
  BODY_FRAME_LABELS,
  interpolateBodyScale,
  interpolateBodyTorso,
  journeyProgress,
  nearestFrameFromTorso,
} from '@/constants/bodyVision';
import { BodyFrameSize } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

type BodyVisionCardProps = {
  sex?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  currentFrame: BodyFrameSize;
  goalFrame: BodyFrameSize;
  currentWeightKg?: number;
  goalWeightKg?: number;
  startWeightKg?: number;
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
  startWeightKg,
  currentPhotoUri,
  programProgress,
  programLabel,
}: BodyVisionCardProps) {
  const { colors } = useTheme();
  const journey = journeyProgress({
    programProgress,
    startWeightKg: startWeightKg ?? currentWeightKg,
    currentWeightKg,
    goalWeightKg,
  });
  const journeyScale = interpolateBodyScale(
    currentFrame,
    goalFrame,
    journey.progress,
  );
  const journeyTorso = interpolateBodyTorso(
    currentFrame,
    goalFrame,
    journey.progress,
  );
  const journeyFrame = nearestFrameFromTorso(journeyTorso);
  const sameFrame = currentFrame === goalFrame;

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
        warn: {
          ...typography.caption,
          color: colors.warning,
          marginBottom: spacing.sm,
          fontWeight: '700',
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
          flexWrap: 'wrap',
          gap: spacing.xs,
        },
        weight: {
          ...typography.caption,
          color: colors.textMuted,
        },
        bars: {
          width: '100%',
          gap: 6,
          marginTop: spacing.xs,
        },
        barTrack: {
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.borderSubtle,
          overflow: 'hidden',
        },
        barFill: {
          height: '100%',
          backgroundColor: colors.accent,
        },
        barLabel: {
          ...typography.caption,
          color: colors.textMuted,
          fontSize: 11,
        },
        photoNote: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  const pct = Math.round(journey.progress * 100);
  const programPct = Math.round(programProgress * 100);
  const weightPct =
    journey.weightShare != null ? Math.round(journey.weightShare * 100) : null;

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>BODY VISION</Text>
      <Text style={styles.title}>Now → Goal</Text>
      <Text style={styles.body}>
        Your Now → Goal body guide. Edit frames on My Stuff.
        {programLabel ? ` · ${programLabel}` : ''}
      </Text>
      {sameFrame ? (
        <Text style={styles.warn}>
          Now and Goal match — change one on My Stuff.
        </Text>
      ) : null}

      <View style={styles.row}>
        <View style={styles.col}>
          <BodySilhouette
            sex={sex}
            frame={currentFrame}
            label="Now"
            compact
            forceSvg
          />
        </View>
        <View style={styles.col}>
          <BodySilhouette
            sex={sex}
            frame={goalFrame}
            label="Goal"
            compact
            forceSvg
          />
        </View>
      </View>
      {currentPhotoUri ? (
        <Text style={styles.photoNote}>
          Photo saved below. Guides stay full-body.
        </Text>
      ) : null}

      {(currentWeightKg != null || goalWeightKg != null || startWeightKg != null) && (
        <View style={styles.weightRow}>
          <Text style={styles.weight}>
            Start: {startWeightKg != null ? `${startWeightKg} kg` : '—'}
          </Text>
          <Text style={styles.weight}>
            Now: {currentWeightKg != null ? `${currentWeightKg} kg` : '—'}
          </Text>
          <Text style={styles.weight}>
            Target: {goalWeightKg != null ? `${goalWeightKg} kg` : '—'}
          </Text>
        </View>
      )}

      <View style={styles.bars}>
        <Text style={styles.barLabel}>Program · {programPct}%</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${programPct}%` }]} />
        </View>
        {weightPct != null ? (
          <>
            <Text style={styles.barLabel}>Weight toward goal · {weightPct}%</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${weightPct}%` }]} />
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.journeyBox}>
        <Text style={styles.journeyLabel}>
          Journey · {pct}% · {journey.source}
        </Text>
        <BodySilhouette
          sex={sex}
          frame={journeyFrame}
          scaleOverride={journeyScale}
          torsoOverride={journeyTorso}
          forceSvg
          compact
        />
        <Text style={styles.journeyMeta}>
          {BODY_FRAME_LABELS[currentFrame]} → {BODY_FRAME_LABELS[goalFrame]}
          {` · nearest frame now: ${BODY_FRAME_LABELS[journeyFrame]}`}
        </Text>
      </View>
    </Card>
  );
}
