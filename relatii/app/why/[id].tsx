import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { DEMO_PROFILES } from '@/features/dna/provisionalDna';
import { useMatchStore } from '@/store/matchStore';
import { useTheme, radii, spacing, typography } from '@/theme';

export default function WhyAlignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const connectProfile = useMatchStore((s) => s.connectProfile);
  const connectedIds = useMatchStore((s) => s.connectedIds);
  const profile = DEMO_PROFILES.find((p) => p.id === id) ?? DEMO_PROFILES[0];
  const connected = connectedIds.includes(profile.id);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        band: {
          ...typography.overline,
          color: colors.success,
          marginBottom: spacing.sm,
        },
        title: {
          ...typography.title,
          color: colors.textPrimary,
          marginBottom: spacing.xs,
        },
        sub: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
        },
        section: {
          marginBottom: spacing.lg,
          padding: spacing.lg,
          borderRadius: radii.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        sectionTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginBottom: spacing.sm,
        },
        item: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        },
        spark: {
          ...typography.body,
          color: colors.textPrimary,
          fontStyle: 'italic',
        },
        note: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.md,
          marginBottom: spacing.xl,
        },
      }),
    [colors],
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Why You Align' }} />
      <Screen>
        <Text style={styles.band}>{profile.alignmentBand}</Text>
        <Text style={styles.title}>
          You & {profile.name}
        </Text>
        <Text style={styles.sub}>
          Grounded in signals you both shared — not chemistry percentages or
          soulmate claims.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared strengths</Text>
          {profile.why.shared.map((s) => (
            <Text key={s} style={styles.item}>
              • {s}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Worth understanding</Text>
          <Text style={styles.item}>{profile.why.difference}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to meet in the middle</Text>
          <Text style={styles.item}>{profile.why.middle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation spark</Text>
          <Text style={styles.spark}>{profile.why.spark}</Text>
        </View>

        <Text style={styles.note}>
          Low-information matches show an alignment band, not a false-precision
          percentage.
        </Text>

        <AppButton
          label={connected ? 'Interest sent' : 'Connect'}
          disabled={connected}
          onPress={() => connectProfile(profile.id)}
        />
        <AppButton
          label="Back to Discover"
          variant="ghost"
          onPress={() => router.back()}
        />
      </Screen>
    </>
  );
}
