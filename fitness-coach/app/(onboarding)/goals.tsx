import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import {
  ACTIVITY_LEVELS,
  EXPERIENCE_LEVELS,
  FITNESS_GOALS,
} from '@/constants/onboarding';
import { useProfileStore } from '@/store/profileStore';
import { colors, spacing, typography } from '@/theme';

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
      <Text style={styles.title}>Your goal</Text>
      <Text style={styles.subtitle}>
        This shapes programs, nutrition targets, and coaching tone.
      </Text>

      <Text style={styles.section}>Primary fitness goal</Text>
      <View style={styles.chips}>
        {FITNESS_GOALS.map((goal) => (
          <OptionChip
            key={goal.id}
            label={goal.label}
            selected={draft.primaryGoal === goal.id}
            onPress={() => updateDraft({ primaryGoal: goal.id })}
          />
        ))}
      </View>

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
});
