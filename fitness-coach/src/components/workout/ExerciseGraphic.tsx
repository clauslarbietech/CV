import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { MuscleMapSvg } from '@/components/workout/MuscleMapSvg';
import {
  getExerciseVisual,
  muscleLabel,
} from '@/constants/exercises/exerciseVisuals';
import { getPoseImage } from '@/constants/exercises/poseImages';
import { useProfileStore } from '@/store/profileStore';
import { Sex } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

interface ExerciseGraphicProps {
  exerciseName: string;
  compact?: boolean;
}

type FormBody = 'male' | 'female';

function resolveFormBody(sex?: Sex | null): FormBody {
  return sex === 'female' ? 'female' : 'male';
}

export function ExerciseGraphic({
  exerciseName,
  compact = false,
}: ExerciseGraphicProps) {
  const { colors } = useTheme();
  const profileSex = useProfileStore((s) => s.profile?.sex);
  const setSex = useProfileStore((s) => s.setSex);
  const [overrideBody, setOverrideBody] = useState<FormBody | null>(null);
  const [motionOn, setMotionOn] = useState(true);
  const formBody = overrideBody ?? resolveFormBody(profileSex);

  const phase = useSharedValue(0);

  useEffect(() => {
    if (!motionOn) {
      phase.value = withTiming(0, { duration: 200 });
      return;
    }
    phase.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [motionOn, phase]);

  const motionStyle = useAnimatedStyle(() => {
    const t = phase.value;
    return {
      transform: [
        { perspective: 900 },
        { rotateY: `${(-12 + t * 24).toFixed(2)}deg` },
        { rotateX: `${(4 - t * 8).toFixed(2)}deg` },
        { scale: 1 + t * 0.04 },
        { translateY: t * -6 },
      ],
    };
  });

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
          gap: spacing.sm,
        },
        badge: {
          backgroundColor: colors.accent,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs,
        },
        badgeText: {
          ...typography.caption,
          color: colors.onAccent,
          fontWeight: '800',
        },
        hint: {
          ...typography.caption,
          color: colors.textMuted,
          flexShrink: 1,
          textAlign: 'right',
        },
        bodyToggle: {
          flexDirection: 'row',
          gap: spacing.xs,
        },
        bodyChip: {
          flex: 1,
          minHeight: 40,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.backgroundElevated,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.sm,
        },
        bodyChipOn: {
          borderColor: colors.accent,
          backgroundColor: colors.accent,
        },
        bodyChipText: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        },
        bodyChipTextOn: {
          color: colors.onAccent,
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
          color: colors.accentText,
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
        motionMeta: {
          ...typography.caption,
          color: colors.textMuted,
        },
      }),
    [colors],
  );

  const visual = getExerciseVisual(exerciseName);
  const image = getPoseImage(visual.pose, formBody);
  const bodyLabel = formBody === 'female' ? 'Female form' : 'Male form';

  const selectBody = (next: FormBody) => {
    setOverrideBody(next);
    setSex(next);
  };

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {motionOn ? '3D MOTION DEMO' : 'FORM GUIDE'}
          </Text>
        </View>
        <Text style={styles.hint}>Neon = working muscles</Text>
      </View>

      <View style={styles.bodyToggle}>
        {(['male', 'female'] as FormBody[]).map((option) => {
          const on = formBody === option;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${option} form guide`}
              onPress={() => selectBody(option)}
              style={[styles.bodyChip, on && styles.bodyChipOn]}
            >
              <Text
                style={[styles.bodyChipText, on && styles.bodyChipTextOn]}
              >
                {option === 'female' ? 'Women' : 'Men'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bodyToggle}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: motionOn }}
          onPress={() => setMotionOn(true)}
          style={[styles.bodyChip, motionOn && styles.bodyChipOn]}
        >
          <Text style={[styles.bodyChipText, motionOn && styles.bodyChipTextOn]}>
            Motion on
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: !motionOn }}
          onPress={() => setMotionOn(false)}
          style={[styles.bodyChip, !motionOn && styles.bodyChipOn]}
        >
          <Text
            style={[styles.bodyChipText, !motionOn && styles.bodyChipTextOn]}
          >
            Still
          </Text>
        </Pressable>
      </View>

      <View style={[styles.art, compact && styles.artCompact]}>
        <Animated.View style={[{ width: '100%', height: '100%' }, motionStyle]}>
          <Image
            key={`pose-${formBody}-${visual.pose}`}
            source={image}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`${exerciseName} ${bodyLabel.toLowerCase()} illustration`}
          />
        </Animated.View>
      </View>

      <Text style={styles.cue}>{visual.cue}</Text>
      <Text style={styles.motionMeta}>
        Animated depth demo of the movement path — true mesh 3D can plug in here
        later without changing the session flow.
      </Text>

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
          <MuscleMapSvg muscles={visual.muscles} sex={formBody} />
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
