import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { SEX_OPTIONS } from '@/constants/onboarding';
import { useProfileStore } from '@/store/profileStore';
import { Sex } from '@/types';
import { colors, radii, spacing, typography } from '@/theme';

export default function BasicsScreen() {
  const draft = useProfileStore((s) => s.draft);
  const updateDraft = useProfileStore((s) => s.updateDraft);

  const canContinue =
    draft.firstName.trim().length > 0 &&
    Number(draft.age) > 0 &&
    Number(draft.heightCm) > 0 &&
    Number(draft.currentWeightKg) > 0;

  return (
    <Screen>
      <Text style={styles.step}>STEP 1 OF 5</Text>
      <Text style={styles.title}>About you</Text>
      <Text style={styles.subtitle}>
        Basics help calibrate targets and safe recommendations.
      </Text>

      <Field label="First name">
        <TextInput
          value={draft.firstName}
          onChangeText={(firstName) => updateDraft({ firstName })}
          style={styles.input}
          placeholder="Alex"
          placeholderTextColor={colors.textMuted}
        />
      </Field>
      <Field label="Age">
        <TextInput
          keyboardType="number-pad"
          value={draft.age}
          onChangeText={(age) => updateDraft({ age })}
          style={styles.input}
          placeholder="28"
          placeholderTextColor={colors.textMuted}
        />
      </Field>
      <Field label="Sex">
        <View style={styles.chips}>
          {SEX_OPTIONS.map((option) => (
            <OptionChip
              key={option.id}
              label={option.label}
              selected={draft.sex === option.id}
              onPress={() => updateDraft({ sex: option.id as Sex })}
            />
          ))}
        </View>
      </Field>
      <Field label="Height (cm)">
        <TextInput
          keyboardType="decimal-pad"
          value={draft.heightCm}
          onChangeText={(heightCm) => updateDraft({ heightCm })}
          style={styles.input}
          placeholder="175"
          placeholderTextColor={colors.textMuted}
        />
      </Field>
      <Field label="Current weight (kg)">
        <TextInput
          keyboardType="decimal-pad"
          value={draft.currentWeightKg}
          onChangeText={(currentWeightKg) => updateDraft({ currentWeightKg })}
          style={styles.input}
          placeholder="80"
          placeholderTextColor={colors.textMuted}
        />
      </Field>
      <Field label="Goal weight (kg)">
        <TextInput
          keyboardType="decimal-pad"
          value={draft.goalWeightKg}
          onChangeText={(goalWeightKg) => updateDraft({ goalWeightKg })}
          style={styles.input}
          placeholder="75"
          placeholderTextColor={colors.textMuted}
        />
      </Field>

      <AppButton
        label="Continue"
        disabled={!canContinue}
        onPress={() => router.push('/(onboarding)/goals')}
      />
    </Screen>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
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
    marginBottom: spacing.sm,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
