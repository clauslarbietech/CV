import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { OptionChip } from '@/components/ui/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import {
  CHILDREN_OPTIONS,
  INTENTION_OPTIONS,
  ONBOARDING_COPY,
  PRIORITY_OPTIONS,
} from '@/constants/onboarding';
import { useMatchStore } from '@/store/matchStore';
import { useTheme, spacing, typography } from '@/theme';

export default function ThreeTapsScreen() {
  const { colors } = useTheme();
  const step = useMatchStore((s) => s.onboardingStep);
  const answers = useMatchStore((s) => s.answers);
  const setStep = useMatchStore((s) => s.setStep);
  const toggleIntention = useMatchStore((s) => s.toggleIntention);
  const setChildrenFuture = useMatchStore((s) => s.setChildrenFuture);
  const togglePriority = useMatchStore((s) => s.togglePriority);
  const completeOnboarding = useMatchStore((s) => s.completeOnboarding);

  const activeTap = Math.min(Math.max(step, 1), 3);

  const copy =
    activeTap === 1
      ? ONBOARDING_COPY.tap1
      : activeTap === 2
        ? ONBOARDING_COPY.tap2
        : ONBOARDING_COPY.tap3;

  const canContinue =
    activeTap === 1
      ? answers.intentions.length > 0
      : activeTap === 2
        ? answers.childrenFuture != null
        : answers.priorities.length > 0;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        progressRow: {
          flexDirection: 'row',
          gap: spacing.xs,
          marginBottom: spacing.xl,
        },
        bar: {
          flex: 1,
          height: 4,
          borderRadius: 999,
          backgroundColor: colors.borderSubtle,
        },
        barActive: {
          backgroundColor: colors.primary,
        },
        stepLabel: {
          ...typography.overline,
          color: colors.dna,
          marginBottom: spacing.sm,
        },
        heading: {
          ...typography.hero,
          color: colors.textPrimary,
          marginBottom: spacing.sm,
        },
        support: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
        },
        footer: {
          marginTop: spacing.xl,
          gap: spacing.sm,
        },
      }),
    [colors],
  );

  const onContinue = () => {
    if (activeTap < 3) {
      setStep(activeTap + 1);
      return;
    }
    completeOnboarding();
    router.push('/(onboarding)/dna');
  };

  const onBack = () => {
    if (activeTap <= 1) {
      setStep(0);
      router.replace('/(onboarding)/welcome');
      return;
    }
    setStep(activeTap - 1);
  };

  return (
    <Screen>
      <View style={styles.progressRow} accessibilityLabel={`Step ${activeTap} of 3`}>
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            style={[styles.bar, n <= activeTap && styles.barActive]}
          />
        ))}
      </View>

      <Text style={styles.stepLabel}>Tap {activeTap} of 3</Text>
      <Text style={styles.heading}>{copy.heading}</Text>
      <Text style={styles.support}>{copy.support}</Text>

      {activeTap === 1
        ? INTENTION_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              hint={opt.hint}
              selected={answers.intentions.includes(opt.id)}
              onPress={() => toggleIntention(opt.id)}
            />
          ))
        : null}

      {activeTap === 2
        ? CHILDREN_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              selected={answers.childrenFuture === opt.id}
              onPress={() => setChildrenFuture(opt.id)}
            />
          ))
        : null}

      {activeTap === 3
        ? PRIORITY_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              selected={answers.priorities.includes(opt.id)}
              onPress={() => togglePriority(opt.id)}
              hint={
                answers.priorities.includes(opt.id)
                  ? undefined
                  : answers.priorities.length >= 3
                    ? 'Limit reached (3)'
                    : undefined
              }
            />
          ))
        : null}

      <View style={styles.footer}>
        <AppButton
          label={activeTap === 3 ? 'View provisional DNA' : 'Continue'}
          onPress={onContinue}
          disabled={!canContinue}
        />
        <AppButton label="Back" variant="ghost" onPress={onBack} />
      </View>
    </Screen>
  );
}
