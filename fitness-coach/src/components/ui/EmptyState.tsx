import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme, spacing, typography } from '@/theme';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          gap: spacing.sm,
          paddingVertical: spacing.xxl,
          alignItems: 'flex-start',
        },
        title: {
          ...typography.heading,
          color: colors.textPrimary,
        },
        description: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}
