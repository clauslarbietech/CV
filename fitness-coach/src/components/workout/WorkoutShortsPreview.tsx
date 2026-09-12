import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { getPoseImage } from '@/constants/exercises/poseImages';
import { useProfileStore } from '@/store/profileStore';
import { DifficultyTier, ProgramDay, Sex, WorkoutProgram } from '@/types';
import {
  buildShortPanels,
  shortsHeadline,
  shortsSubcopy,
  ShortPanel,
} from '@/utils/workoutShorts';
import { useTheme, radii, spacing, typography } from '@/theme';

type Slot = 'morning' | 'evening';

interface WorkoutShortsPreviewProps {
  program: WorkoutProgram;
  day: ProgramDay;
  tier?: DifficultyTier;
  /** Constrained card on Today / program; fullscreen for Shorts player */
  variant?: 'card' | 'fullscreen';
  slot?: Slot;
  minutes?: number;
  onOpen?: () => void;
  onStart: () => void;
  style?: ViewStyle;
}

function SketchPanel({
  panel,
  active,
  sex,
}: {
  panel: ShortPanel;
  active: boolean;
  sex?: Sex | null;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: active ? 1.06 : 1,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
  }, [active, scale]);

  return (
    <Animated.View
      style={[
        styles.panel,
        active && styles.panelActive,
        { transform: [{ scale }] },
      ]}
    >
      <Image
        source={getPoseImage(panel.pose, sex)}
        style={[
          styles.panelImage,
          Platform.OS === 'web'
            ? ({
                // Blue ink / sketch vibe for web Shorts preview
                filter:
                  'grayscale(0.35) contrast(1.35) brightness(0.85) sepia(0.55) hue-rotate(175deg) saturate(2.4)',
              } as object)
            : null,
        ]}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          'rgba(8, 36, 72, 0.15)',
          'rgba(12, 58, 110, 0.45)',
          'rgba(4, 18, 40, 0.75)',
        ]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inkWash} pointerEvents="none" />
      <Text style={styles.badge}>{panel.badge}</Text>
    </Animated.View>
  );
}

export function WorkoutShortsPreview({
  program,
  day,
  tier = 'recruit',
  variant = 'card',
  slot = 'morning',
  minutes,
  onOpen,
  onStart,
  style,
}: WorkoutShortsPreviewProps) {
  const { colors } = useTheme();
  const sex = useProfileStore((s) => s.profile?.sex);
  const panels = useMemo(
    () => buildShortPanels(day, tier),
    [day, tier],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const headlineOpacity = useRef(new Animated.Value(0.85)).current;

  const midMinutes =
    minutes ??
    Math.round((day.estimatedMinutes.min + day.estimatedMinutes.max) / 2);

  useEffect(() => {
    if (panels.length === 0) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % panels.length);
    }, 1400);
    return () => clearInterval(id);
  }, [panels.length]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(headlineOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(headlineOpacity, {
          toValue: 0.78,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [headlineOpacity]);

  const shell = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          borderRadius: variant === 'card' ? radii.xl : 0,
          overflow: 'hidden',
          borderWidth: variant === 'card' ? 1 : 0,
          borderColor: colors.border,
          backgroundColor: '#061525',
          aspectRatio: variant === 'card' ? 9 / 14 : undefined,
          minHeight: variant === 'fullscreen' ? undefined : 320,
          flex: variant === 'fullscreen' ? 1 : undefined,
        },
        pressed: { opacity: 0.96 },
      }),
    [colors.border, variant],
  );

  if (panels.length === 0) return null;

  const content = (
    <View style={[shell.wrap, style]}>
      <View style={styles.grid}>
        {panels.map((panel, index) => (
          <SketchPanel
            key={panel.id}
            panel={panel}
            active={index === activeIndex}
            sex={sex}
          />
        ))}
      </View>

      <LinearGradient
        colors={[
          'rgba(2, 12, 28, 0.2)',
          'rgba(2, 12, 28, 0.35)',
          'rgba(2, 8, 20, 0.82)',
        ]}
        style={styles.vignette}
        pointerEvents="none"
      />

      <View style={styles.topChrome} pointerEvents="none">
        <Text style={styles.formatTag}>SHORT</Text>
        <Text style={styles.subcopy}>{shortsSubcopy(program.name)}</Text>
      </View>

      <Animated.View style={[styles.headlineWrap, { opacity: headlineOpacity }]}>
        <Text style={styles.headline}>
          {shortsHeadline({
            minutes: midMinutes,
            slot,
            dayTitle: day.title,
          })}
        </Text>
      </Animated.View>

      <View style={styles.bottomBar}>
        <View style={styles.brandBlock}>
          <Text style={styles.brand}>FitLife</Text>
          <Text style={styles.caption} numberOfLines={1}>
            Day {day.day} · {day.title}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start this workout"
          onPress={onStart}
          style={({ pressed }) => [
            styles.cta,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={styles.ctaText}>Start</Text>
        </Pressable>
      </View>
    </View>
  );

  if (onOpen) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open workout Short preview"
        onPress={onOpen}
        style={({ pressed }) => pressed && shell.pressed}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  grid: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  panel: {
    width: '33.333%',
    height: '50%',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(120, 190, 255, 0.25)',
  },
  panelActive: {
    borderColor: 'rgba(180, 230, 255, 0.85)',
    zIndex: 2,
  },
  panelImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  inkWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 90, 160, 0.22)',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  vignette: {
    ...StyleSheet.absoluteFill,
  },
  topChrome: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    gap: 4,
  },
  formatTag: {
    alignSelf: 'flex-start',
    ...typography.caption,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#061525',
    backgroundColor: '#C0FF00',
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
    borderRadius: 4,
  },
  subcopy: {
    ...typography.caption,
    color: 'rgba(210, 230, 255, 0.85)',
    fontWeight: '600',
  },
  headlineWrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    top: '28%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(2, 10, 22, 0.45)',
  },
  headline: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(4, 14, 28, 0.88)',
  },
  brandBlock: { flex: 1, gap: 2 },
  brand: {
    ...typography.subheading,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  caption: {
    ...typography.caption,
    color: 'rgba(190, 220, 255, 0.85)',
  },
  cta: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill ?? 999,
    minHeight: 40,
    justifyContent: 'center',
  },
  ctaText: {
    ...typography.caption,
    color: '#061525',
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});
