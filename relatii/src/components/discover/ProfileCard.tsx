import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { bandColor } from '@/features/dna/provisionalDna';
import type { DiscoverProfile } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

type Props = {
  profile: DiscoverProfile;
  onOpen: () => void;
  connected?: boolean;
};

export function ProfileCard({ profile, onOpen, connected }: Props) {
  const { colors } = useTheme();
  const accent = bandColor(profile.alignmentBand);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderRadius: radii.xl,
          overflow: 'hidden',
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        photo: {
          height: 220,
          justifyContent: 'flex-end',
          padding: spacing.lg,
        },
        name: {
          ...typography.title,
          color: '#FFF9F5',
        },
        meta: {
          ...typography.caption,
          color: 'rgba(255,249,245,0.85)',
          marginTop: 4,
        },
        body: {
          padding: spacing.lg,
          gap: spacing.sm,
        },
        band: {
          alignSelf: 'flex-start',
          paddingHorizontal: spacing.sm,
          paddingVertical: 6,
          borderRadius: radii.pill,
          backgroundColor: `${accent}33`,
          borderWidth: 1,
          borderColor: accent,
        },
        bandText: {
          ...typography.caption,
          color: colors.textPrimary,
          fontFamily: typography.bodyBold.fontFamily,
        },
        chips: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
        },
        chip: {
          paddingHorizontal: spacing.sm,
          paddingVertical: 6,
          borderRadius: radii.pill,
          backgroundColor: colors.chipBg,
        },
        chipText: {
          ...typography.caption,
          color: colors.chipText,
        },
        bio: {
          ...typography.body,
          color: colors.textSecondary,
        },
        status: {
          ...typography.caption,
          color: connected ? colors.success : colors.textMuted,
        },
      }),
    [colors, accent, connected],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${profile.name}, ${profile.age}. ${profile.alignmentBand}`}
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.94 }]}
    >
      <LinearGradient
        colors={profile.photoGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.photo}
      >
        <Text style={styles.name}>
          {profile.name}, {profile.age}
        </Text>
        <Text style={styles.meta}>
          {profile.verified ? 'Verified profile' : 'Verification pending'}
        </Text>
      </LinearGradient>
      <View style={styles.body}>
        <View style={styles.band}>
          <Text style={styles.bandText}>{profile.alignmentBand}</Text>
        </View>
        <View style={styles.chips}>
          {profile.values.map((v) => (
            <View key={v} style={styles.chip}>
              <Text style={styles.chipText}>{v}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.bio} numberOfLines={3}>
          {profile.bio}
        </Text>
        <Text style={styles.status}>
          {connected ? 'Interest sent' : 'Tap to see why you align'}
        </Text>
      </View>
    </Pressable>
  );
}
