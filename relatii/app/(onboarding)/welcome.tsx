import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useMatchStore } from '@/store/matchStore';
import { useTheme, radii, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  const { colors, isDay } = useTheme();
  const confirmAge = useMatchStore((s) => s.confirmAge);
  const setStep = useMatchStore((s) => s.setStep);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        brand: {
          ...typography.brand,
          color: colors.textPrimary,
          marginTop: spacing.xxxl,
        },
        tag: {
          ...typography.overline,
          color: colors.primary,
          marginTop: spacing.sm,
        },
        heroBlock: {
          marginTop: spacing.xxxl,
          marginBottom: spacing.xl,
        },
        headline: {
          ...typography.hero,
          color: colors.textPrimary,
          marginBottom: spacing.md,
        },
        support: {
          ...typography.body,
          color: colors.textSecondary,
          maxWidth: 340,
        },
        orb: {
          height: 220,
          borderRadius: radii.xxl,
          marginTop: spacing.xl,
          marginBottom: spacing.xxl,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
          justifyContent: 'flex-end',
          padding: spacing.xl,
        },
        orbLabel: {
          ...typography.heading,
          color: '#FFF9F5',
        },
        orbSub: {
          ...typography.caption,
          color: 'rgba(255,249,245,0.85)',
          marginTop: 6,
        },
        footer: {
          marginTop: 'auto',
          gap: spacing.sm,
          paddingBottom: spacing.md,
        },
        legal: {
          ...typography.caption,
          color: colors.textMuted,
          textAlign: 'center',
        },
      }),
    [colors],
  );

  const start = () => {
    confirmAge();
    setStep(1);
    router.push('/(onboarding)/taps');
  };

  return (
    <Screen scroll={false} contentStyle={{ justifyContent: 'space-between' }}>
      <View>
        <Text style={styles.brand} accessibilityRole="header">
          Relatii
        </Text>
        <Text style={styles.tag}>Fewer questions. Clearer connection.</Text>

        <View style={styles.heroBlock}>
          <Text style={styles.headline}>
            Build relationships capable of lasting.
          </Text>
          <Text style={styles.support}>
            Three taps. A provisional Relationship DNA. Matches you can
            understand — not endless swiping.
          </Text>
        </View>

        <LinearGradient
          colors={
            isDay
              ? ['#F13C78', '#8D6BFF']
              : ['#3A1230', '#8D6BFF', '#FF5F6D']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.orb}
        >
          <Text style={styles.orbLabel}>Relationship DNA</Text>
          <Text style={styles.orbSub}>
            Explainable signals that grow with you
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.footer}>
        <AppButton label="Start matching" onPress={start} />
        <Text style={styles.legal}>
          18+ only. Relatii is not therapy or a diagnosis. You approve every
          message before it is sent.
        </Text>
      </View>
    </Screen>
  );
}
