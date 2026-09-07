import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useProfileStore } from '@/store/profileStore';
import { Sex, WorkoutProgram } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

const HERO_IMAGES: Record<string, ImageSourcePropType> = {
  'operation-iron-30': require('../../../assets/exercises/burpee.png'),
  'operation-iron-14': require('../../../assets/exercises/pushup.png'),
  'operation-long-train': require('../../../assets/exercises/squat.png'),
  'operation-calisthenics': require('../../../assets/exercises/pike.png'),
};

const MILITARY_HERO_BY_SEX = {
  male: require('../../../assets/programs/military-calisthenics-male.png'),
  female: require('../../../assets/programs/military-calisthenics-female.png'),
} as const;

function heroForProgram(
  programId: string,
  sex?: Sex | null,
): ImageSourcePropType {
  if (programId === 'operation-military-calisthenics') {
    return sex === 'female'
      ? MILITARY_HERO_BY_SEX.female
      : MILITARY_HERO_BY_SEX.male;
  }
  return (
    HERO_IMAGES[programId] ?? require('../../../assets/exercises/generic.png')
  );
}

interface HeroProgramCardProps {
  program: WorkoutProgram;
  locationLabel?: string;
  enrolled?: boolean;
  currentDay?: number;
  onGetStarted: () => void;
  onPlay: () => void;
}

export function HeroProgramCard({
  program,
  locationLabel = 'Home · No equipment',
  enrolled,
  currentDay,
  onGetStarted,
  onPlay,
}: HeroProgramCardProps) {
  const { colors, isDay } = useTheme();
  const sex = useProfileStore((s) => s.profile?.sex);
  const image = heroForProgram(program.id, sex);
  const isMilitary = program.id === 'operation-military-calisthenics';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          height: isMilitary ? 240 : 200,
          borderRadius: radii.xl,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: isDay ? colors.border : colors.borderSubtle,
        },
        pressed: { opacity: 0.94, transform: [{ scale: 0.99 }] },
        image: { flex: 1, justifyContent: 'flex-end' },
        overlay: {
          ...StyleSheet.absoluteFill,
        },
        topRow: {
          position: 'absolute',
          top: spacing.md,
          right: spacing.md,
          zIndex: 2,
        },
        getStarted: {
          backgroundColor: colors.action,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radii.sm,
        },
        getStartedText: {
          ...typography.caption,
          color: colors.onAction,
          fontWeight: '800',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        },
        bottom: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: spacing.lg,
          gap: spacing.md,
        },
        copy: { flex: 1, gap: 4 },
        title: {
          ...typography.title,
          color: colors.white,
          fontSize: 22,
          lineHeight: 26,
        },
        subtitle: {
          ...typography.caption,
          color: 'rgba(255,255,255,0.85)',
        },
        play: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.action,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors, isDay, isMilitary],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${program.name}. ${enrolled ? `Continue day ${currentDay}` : 'Get started'}`}
      onPress={onGetStarted}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ImageBackground source={image} style={styles.image} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.88)']}
          style={styles.overlay}
        />
        <View style={styles.topRow}>
          <Pressable
            onPress={onGetStarted}
            style={styles.getStarted}
            hitSlop={8}
          >
            <Text style={styles.getStartedText}>
              {enrolled ? 'Continue' : 'Get started'}
            </Text>
          </Pressable>
        </View>
        <View style={styles.bottom}>
          <View style={styles.copy}>
            <Text style={styles.title} numberOfLines={2}>
              {program.name.replace('OPERATION ', '')}
            </Text>
            <Text style={styles.subtitle}>
              {locationLabel}
              {enrolled && currentDay ? ` · Day ${currentDay}` : ''}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Start workout"
            onPress={onPlay}
            style={styles.play}
          >
            <Ionicons name="play" size={22} color={colors.onAction} />
          </Pressable>
        </View>
      </ImageBackground>
    </Pressable>
  );
}
