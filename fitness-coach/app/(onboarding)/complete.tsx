import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { OPERATION_IRON_14 } from '@/constants/programs';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { DifficultyTier } from '@/types';
import { colors, spacing, typography } from '@/theme';

const TIERS: Array<{ id: DifficultyTier; label: string }> = [
  { id: 'recruit', label: 'Recruit · Beginner' },
  { id: 'soldier', label: 'Soldier · Intermediate' },
  { id: 'elite', label: 'Elite · Advanced' },
];

export default function CompleteOnboardingScreen() {
  const draft = useProfileStore((s) => s.draft);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const userId = useAuthStore((s) => s.userId);
  const email = useAuthStore((s) => s.email);
  const enrollInIron14 = useProgramStore((s) => s.enrollInIron14);

  const suggestedTier = useMemo<DifficultyTier>(() => {
    if (draft.experienceLevel === 'beginner') return 'recruit';
    if (draft.experienceLevel === 'advanced') return 'elite';
    return 'soldier';
  }, [draft.experienceLevel]);

  const [tier, setTier] = useState<DifficultyTier>(suggestedTier);

  useEffect(() => {
    setTier(suggestedTier);
  }, [suggestedTier]);

  const finish = (startMission: boolean) => {
    completeOnboarding(userId ?? `user-${Date.now()}`, email ?? undefined);
    enrollInIron14(tier);

    if (startMission) {
      router.replace({
        pathname: '/session/[programId]',
        params: {
          programId: OPERATION_IRON_14.id,
          day: '1',
        },
      });
      return;
    }

    router.replace('/(tabs)/today');
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.step}>STEP 5 OF 5</Text>
        <Text style={styles.title}>Day 1 is ready</Text>
        <Text style={styles.subtitle}>
          You&apos;re enrolled into OPERATION IRON 14 — a 14-day military
          bodyweight fat-shred protocol. Complete Day 1 to unlock Day 2.
        </Text>

        <Text style={styles.section}>Difficulty</Text>
        <View style={styles.chips}>
          {TIERS.map((item) => (
            <OptionChip
              key={item.id}
              label={item.label}
              selected={tier === item.id}
              onPress={() => setTier(item.id)}
            />
          ))}
        </View>
        <Text style={styles.note}>
          Suggested: {suggestedTier.toUpperCase()} based on your experience.
        </Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          label="START DAY 1 MISSION"
          variant="military"
          onPress={() => finish(true)}
        />
        <AppButton
          label="Go to Today first"
          variant="secondary"
          onPress={() => finish(false)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
  },
  hero: {
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  step: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.sm,
  },
});
