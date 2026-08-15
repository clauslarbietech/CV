import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing, typography } from '@/theme';

type StepAction = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

type Step = {
  number: number;
  title: string;
  actions: StepAction[];
};

interface ProgramStartStepsProps {
  steps: Step[];
}

export function ProgramStartSteps({ steps }: ProgramStartStepsProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { gap: spacing.md },
        stepCard: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.lg,
          backgroundColor: colors.surface,
          gap: spacing.sm,
        },
        stepTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        action: {
          minHeight: 52,
          borderRadius: radii.md,
          backgroundColor: colors.action,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
        },
        actionPressed: { opacity: 0.9 },
        actionLabel: {
          ...typography.bodyBold,
          color: colors.white,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrap}>
      {steps.map((step) => (
        <View key={step.number} style={styles.stepCard}>
          <Text style={styles.stepTitle}>
            STEP #{step.number}: {step.title}
          </Text>
          {step.actions.map((action) => (
            <Pressable
              key={action.id}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.actionPressed,
              ]}
            >
              <Ionicons name={action.icon} size={20} color={colors.white} />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}
