import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
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
  const updateDraft = useProfileStore((s) => s.updateDraft);
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

  const finish = () => {
    completeOnboarding(userId ?? `user-${Date.now()}`, email ?? undefined);
    enrollInIron14(tier);
    router.replace('/(tabs)/today');
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.step}>STEP 5 OF 5</Text>
        <Text style={styles.title}>You&apos;re ready for Day 1</Text>
        <Text style={styles.subtitle}>
          I&apos;ll enroll you in OPERATION IRON 14 — the featured 14-day military
          calisthenics challenge — and build today&apos;s mission around it.
        </Text>

        <Text style={styles.section}>Notifications</Text>
        <View style={styles.chips}>
          <OptionChip
            label="On"
            selected={draft.notificationEnabled}
            onPress={() => updateDraft({ notificationEnabled: true })}
          />
          <OptionChip
            label="Off"
            selected={!draft.notificationEnabled}
            onPress={() => updateDraft({ notificationEnabled: false })}
          />
        </View>

        <Text style={styles.section}>Starting difficulty</Text>
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
          Suggested for your experience: {suggestedTier.toUpperCase()}. You can
          change this anytime.
        </Text>
      </View>

      <AppButton label="Start my plan" onPress={finish} />
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
});
