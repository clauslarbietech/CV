import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ProfileCard } from '@/components/discover/ProfileCard';
import { Screen } from '@/components/ui/Screen';
import { DEMO_PROFILES } from '@/features/dna/provisionalDna';
import { useMatchStore } from '@/store/matchStore';
import { useTheme, spacing, typography } from '@/theme';

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const connectedIds = useMatchStore((s) => s.connectedIds);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        brand: {
          ...typography.overline,
          color: colors.primary,
          marginBottom: spacing.xs,
        },
        title: {
          ...typography.title,
          color: colors.textPrimary,
          marginBottom: spacing.xs,
        },
        support: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
        },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.brand}>Relatii</Text>
      <Text style={styles.title}>Today’s curated set</Text>
      <Text style={styles.support}>
        Three to five intentional introductions — not an infinite feed. Open a
        profile to see why you align.
      </Text>

      <View>
        {DEMO_PROFILES.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            connected={connectedIds.includes(profile.id)}
            onOpen={() => router.push(`/why/${profile.id}`)}
          />
        ))}
      </View>
    </Screen>
  );
}
