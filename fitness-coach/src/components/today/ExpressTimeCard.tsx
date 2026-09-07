import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  EXPRESS_OPTIONS,
  EXPRESS_SOURCES,
  ExpressBudget,
} from '@/constants/programs/expressMissions';
import { useTheme, spacing, typography } from '@/theme';

interface ExpressTimeCardProps {
  onSelect: (budget: ExpressBudget) => void;
  disabled?: boolean;
}

export function ExpressTimeCard({ onSelect, disabled }: ExpressTimeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: {
          ...typography.overline,
          color: colors.accentText,
        },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xs,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        row: {
          flexDirection: 'row',
          gap: spacing.xs,
          marginBottom: spacing.sm,
        },
        btn: {
          flex: 1,
          paddingHorizontal: spacing.sm,
          minHeight: 48,
        },
        more: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '700',
          marginTop: spacing.xs,
        },
        meta: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: 4,
        },
        sourceLabel: {
          ...typography.overline,
          color: colors.textMuted,
          marginTop: spacing.md,
          marginBottom: spacing.xs,
        },
        link: {
          ...typography.caption,
          color: colors.accentText,
          marginBottom: 4,
          fontWeight: '700',
        },
      }),
    [colors],
  );

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>SHORT ON TIME?</Text>
      <Text style={styles.title}>Quick workout</Text>
      <Text style={styles.body}>
        Short on time? Pick a quicker workout.
      </Text>

      <View style={styles.row}>
        {EXPRESS_OPTIONS.map((option) => (
          <AppButton
            key={option.budget}
            label={option.label}
            variant="secondary"
            disabled={disabled}
            onPress={() => onSelect(option.budget)}
            style={styles.btn}
          />
        ))}
      </View>

      <Pressable onPress={() => setExpanded((v) => !v)} accessibilityRole="button">
        <Text style={styles.more}>{expanded ? 'Show less ↑' : 'View research & details →'}</Text>
      </Pressable>

      {expanded
        ? EXPRESS_OPTIONS.map((option) => (
            <Text key={option.strategy} style={styles.meta}>
              {option.label}: {option.strategy} — {option.description}
            </Text>
          ))
        : null}

      {expanded ? (
        <>
          <Text style={styles.sourceLabel}>Sources</Text>
          {EXPRESS_SOURCES.map((source) => (
            <Text
              key={source.url}
              style={styles.link}
              onPress={() => Linking.openURL(source.url)}
            >
              {source.title} →
            </Text>
          ))}
        </>
      ) : null}
    </Card>
  );
}
