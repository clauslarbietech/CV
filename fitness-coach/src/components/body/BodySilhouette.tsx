import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { BodyFrameSvg } from '@/components/body/BodyFrameSvg';
import { BODY_FRAME_LABELS, frameScale, frameTorso } from '@/constants/bodyVision';
import { INTRO_BODY_IMAGES } from '@/constants/intro';
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
  /**
   * Prefer SVG graphic over user photo.
   * Human guide photo (male/female) still used when no user photo unless forceSvg.
   */
  preferGraphic?: boolean;
  /** Force neon SVG only (skip human guide photo). */
  forceSvg?: boolean;
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
  forceSvg = false,
}: BodySilhouetteProps) {
  const { colors } = useTheme();
  const scale = scaleOverride ?? frameScale(frame);
  const torso = torsoOverride ?? frameTorso(frame);
  const showUserPhoto = Boolean(photoUri) && !preferGraphic;
  const guideSex: 'male' | 'female' = sex === 'female' ? 'female' : 'male';
  const showHumanGuide = !forceSvg && !showUserPhoto;

  // Width stretch tracks frame strongly; height only slightly — reads as size not height.
  const scaleX = 0.72 + (torso - 0.62) * 0.55;
  const scaleY = 0.9 + (scale - 1) * 0.2;

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
          justifyContent: 'flex-end',
        },
        figureWrap: {
          width: '92%',
          height: '96%',
          alignItems: 'center',
          justifyContent: 'flex-end',
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
        {showUserPhoto && photoUri ? (
          <View
            style={[
              styles.figureWrap,
              { transform: [{ scaleX }, { scaleY }] },
            ]}
          >
            <Image
              source={{ uri: photoUri }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={label ?? 'Body photo'}
            />
          </View>
        ) : showHumanGuide ? (
          <View
            style={[
              styles.figureWrap,
              { transform: [{ scaleX }, { scaleY }] },
            ]}
          >
            <Image
              source={INTRO_BODY_IMAGES[guideSex]}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel={`${guideSex} ${frame} body preview`}
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
