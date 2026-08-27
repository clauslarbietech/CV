import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { BodyFrameSvg } from '@/components/body/BodyFrameSvg';
import { BODY_FRAME_LABELS, frameScale } from '@/constants/bodyVision';
import { BodyFrameSize, Sex } from '@/types';
import { useTheme, radii, typography } from '@/theme';

type BodySilhouetteProps = {
  sex?: Sex | null;
  frame: BodyFrameSize;
  /** Override frame scale — e.g. interpolated journey progress. */
  scaleOverride?: number;
  /** Override torso width for dedicated SVG journey blend. */
  torsoOverride?: number;
  photoUri?: string | null;
  label?: string;
  compact?: boolean;
  /** Prefer photo when set; otherwise dedicated frame graphic. */
  preferGraphic?: boolean;
};

export function BodySilhouette({
  sex,
  frame,
  scaleOverride,
  torsoOverride,
  photoUri,
  label,
  compact = false,
  preferGraphic = false,
}: BodySilhouetteProps) {
  const { colors } = useTheme();
  const scale = scaleOverride ?? frameScale(frame);
  const showPhoto = Boolean(photoUri) && !preferGraphic;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          flex: 1,
          alignItems: 'center',
          gap: 6,
        },
        stage: {
          width: '100%',
          aspectRatio: compact ? 0.72 : 0.65,
          borderRadius: radii.lg,
          backgroundColor: '#070707',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        },
        figureWrap: {
          width: '90%',
          height: '94%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        image: {
          width: '100%',
          height: '100%',
        },
        caption: {
          ...typography.caption,
          color: colors.textMuted,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        },
        sizeTag: {
          ...typography.caption,
          color: colors.accentText,
          fontWeight: '800',
        },
      }),
    [colors, compact],
  );

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.caption}>{label}</Text> : null}
      <View style={styles.stage}>
        {showPhoto && photoUri ? (
          <View
            style={[
              styles.figureWrap,
              { transform: [{ scaleX: scale }, { scaleY: scale }] },
            ]}
          >
            <Image
              source={{ uri: photoUri }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={label ?? 'Body photo'}
            />
          </View>
        ) : (
          <View style={styles.figureWrap}>
            <BodyFrameSvg
              frame={frame}
              torsoOverride={torsoOverride}
              sex={sex}
              width={compact ? 100 : 120}
              height={compact ? 168 : 200}
            />
          </View>
        )}
      </View>
      <Text style={styles.sizeTag}>{BODY_FRAME_LABELS[frame]}</Text>
    </View>
  );
}
