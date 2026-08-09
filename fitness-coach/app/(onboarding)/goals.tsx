import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ACTIVITY_LEVELS, EXPERIENCE_LEVELS } from '@/constants/onboarding';
import { useProfileStore } from '@/store/profileStore';
import { FitnessGoal } from '@/types';
import { colors, spacing, typography } from '@/theme';

const PHASE1_GOALS: Array<{ id: FitnessGoal; label: string; detail: string }> = [
  {
    id: 'lose_fat',
    label: 'Lose fat',
    detail: 'Primary path for visual shredding in 14 days.',
  },
  {
    id: 'recomposition',
    label: 'Recomposition',
    detail: 'Burn fat while retaining / building lean muscle.',
  },
];

export default function GoalsScreen() {
  const draft = useProfileStore((s) => s.draft);
  const updateDraft = useProfileStore((s) => s.updateDraft);

  const canContinue =
    Boolean(draft.primaryGoal) &&
    Boolean(draft.experienceLevel) &&
    Boolean(draft.activityLevel);

  return (
    <Screen>
      <Text style={styles.step}>STEP 2 OF 5</Text>
      <Text style={styles.title}>Transformation goal</Text>
      <Text style={styles.subtitle}>
        OPERATION IRON 14 is built for visual fat loss and athletic
        recomposition. Pick your primary target.
      </Text>

      <Card military>
        <Text style={styles.cardTitle}>14-DAY SHRED FOCUS</Text>
        <Text style={styles.cardBody}>
          Reduce visible body fat · improve definition · keep lean muscle · raise
          conditioning.
        </Text>
      </Card>

      <Text style={styles.section}>Primary goal</Text>
      <View style={styles.goalList}>
        {PHASE1_GOALS.map((goal) => (
          <OptionChip
            key={goal.id}
            label={goal.label}
            selected={draft.primaryGoal === goal.id}
            onPress={() => updateDraft({ primaryGoal: goal.id })}
          />
        ))}
      </View>
      {draft.primaryGoal ? (
        <Text style={styles.detail}>
          {PHASE1_GOALS.find((g) => g.id === draft.primaryGoal)?.detail}
        </Text>
      ) : null}

      <Text style={styles.section}>Experience level</Text>
      <View style={styles.chips}>
        {EXPERIENCE_LEVELS.map((level) => (
          <OptionChip
            key={level.id}
            label={level.label}
            selected={draft.experienceLevel === level.id}
            onPress={() => updateDraft({ experienceLevel: level.id })}
          />
        ))}
      </View>

      <Text style={styles.section}>Activity level</Text>
      <View style={styles.chips}>
        {ACTIVITY_LEVELS.map((level) => (
          <OptionChip
            key={level.id}
            label={level.label}
            selected={draft.activityLevel === level.id}
            onPress={() => updateDraft({ activityLevel: level.id })}
          />
        ))}
      </View>

      <AppButton
        label="Continue"
        disabled={!canContinue}
        onPress={() => router.push('/(onboarding)/training')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cardTitle: {
    ...typography.overline,
    color: colors.militaryAccent,
    marginBottom: spacing.xs,
  },
  cardBody: {
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
  goalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  detail: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
