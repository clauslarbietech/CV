import { useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

import { INTRO_BODY_IMAGES, IntroBodySex } from '@/constants/intro';
import { frameScale } from '@/constants/bodyVision';
import { BodyFrameSize, Sex } from '@/types';
import { useTheme, radii, typography } from '@/theme';

type BodySilhouetteProps = {
  sex?: Sex | null;
  frame: BodyFrameSize;
  /** Override frame scale — e.g. interpolated journey progress. */
  scaleOverride?: number;
  photoUri?: string | null;
  label?: string;
  compact?: boolean;
};

function resolveSex(sex?: Sex | null): IntroBodySex {
  return sex === 'female' ? 'female' : 'male';
}

export function BodySilhouette({
  sex,
  frame,
  scaleOverride,
  photoUri,
  label,
  compact = false,
}: BodySilhouetteProps) {
  const { colors } = useTheme();
  const bodySex = resolveSex(sex);
  const scale = scaleOverride ?? frameScale(frame);

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
          width: '78%',
          height: '92%',
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

  const source: ImageSourcePropType | { uri: string } = photoUri
    ? { uri: photoUri }
    : INTRO_BODY_IMAGES[bodySex];

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.caption}>{label}</Text> : null}
      <View style={styles.stage}>
        <View
          style={[
            styles.figureWrap,
            { transform: [{ scaleX: scale }, { scaleY: scale }] },
          ]}
        >
          <Image
            source={source}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={label ?? 'Body reference'}
          />
        </View>
      </View>
      {!photoUri ? <Text style={styles.sizeTag}>{frame.toUpperCase()}</Text> : null}
    </View>
  );
}
