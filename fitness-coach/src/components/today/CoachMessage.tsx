import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

interface CoachMessageProps {
  message: string;
  personalityLabel?: string;
}

export function CoachMessage({ message, personalityLabel }: CoachMessageProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        AI COACH{personalityLabel ? ` · ${personalityLabel}` : ''}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  label: {
    ...typography.overline,
    color: colors.accent,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
