import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useTheme, spacing, typography } from '@/theme';

/** Nudge to set body vision once on My Stuff — avoids duplicate full setup here. */
export function BodyVisionPromptCard() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.actionText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        body: {
          ...typography.caption,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>BODY VISION</Text>
      <Text style={styles.title}>Set your Now → Goal guide</Text>
      <Text style={styles.body}>
        Weight, body frames, and photos live on My Stuff — one place to edit.
      </Text>
      <AppButton
        label="Set up on My Stuff"
        variant="action"
        onPress={() => router.push('/(tabs)/today')}
      />
    </Card>
  );
}
