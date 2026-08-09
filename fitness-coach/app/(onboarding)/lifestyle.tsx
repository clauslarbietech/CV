import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { DIETARY_OPTIONS } from '@/constants/onboarding';
import { COACH_PERSONALITIES } from '@/constants/coach';
import { useProfileStore } from '@/store/profileStore';
import { colors, radii, spacing, typography } from '@/theme';

export default function LifestyleScreen() {
  const draft = useProfileStore((s) => s.draft);
  const updateDraft = useProfileStore((s) => s.updateDraft);

  return (
    <Screen>
      <Text style={styles.step}>STEP 4 OF 5</Text>
      <Text style={styles.title}>Nutrition & coaching</Text>
      <Text style={styles.subtitle}>
        Tell me how you eat and how you want to be coached.
      </Text>

      <Text style={styles.section}>Dietary preference</Text>
      <View style={styles.chips}>
        {DIETARY_OPTIONS.map((option) => (
          <OptionChip
            key={option.id}
            label={option.label}
            selected={draft.dietaryPreference === option.id}
            onPress={() => updateDraft({ dietaryPreference: option.id })}
          />
        ))}
      </View>

      <Text style={styles.section}>Food allergies (comma-separated)</Text>
      <TextInput
        value={draft.foodAllergies}
        onChangeText={(foodAllergies) => updateDraft({ foodAllergies })}
        style={styles.input}
        placeholder="e.g. peanuts, shellfish"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.section}>Physical limitations</Text>
      <TextInput
        value={draft.physicalLimitations}
        onChangeText={(physicalLimitations) =>
          updateDraft({ physicalLimitations })
        }
        style={styles.input}
        placeholder="Optional"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.section}>Injuries</Text>
      <TextInput
        value={draft.injuries}
        onChangeText={(injuries) => updateDraft({ injuries })}
        style={styles.input}
        placeholder="Optional — used for exercise substitutions"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.section}>Coach personality</Text>
      <View style={styles.coachList}>
        {COACH_PERSONALITIES.map((coach) => (
          <OptionChip
            key={coach.id}
            label={coach.name}
            selected={draft.coachPersonality === coach.id}
            onPress={() => updateDraft({ coachPersonality: coach.id })}
          />
        ))}
      </View>
      <Text style={styles.example}>
        {
          COACH_PERSONALITIES.find((c) => c.id === draft.coachPersonality)
            ?.example
        }
      </Text>

      <AppButton
        label="Continue"
        onPress={() => router.push('/(onboarding)/complete')}
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
  coachList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  example: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
    ...typography.body,
  },
});
