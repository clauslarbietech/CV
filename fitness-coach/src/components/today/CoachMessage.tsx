import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing, typography } from '@/theme';

interface CoachMessageProps {
  message: string;
  personalityLabel?: string;
}

export function CoachMessage({ message, personalityLabel }: CoachMessageProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          color: colors.accentText,
        },
        message: {
          ...typography.body,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        AI COACH{personalityLabel ? ` · ${personalityLabel}` : ''}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
