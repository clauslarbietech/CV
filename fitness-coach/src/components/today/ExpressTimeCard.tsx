import { Linking, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  EXPRESS_OPTIONS,
  EXPRESS_SOURCES,
  ExpressBudget,
} from '@/constants/programs/expressMissions';
import { colors, spacing, typography } from '@/theme';

interface ExpressTimeCardProps {
  onSelect: (budget: ExpressBudget) => void;
  disabled?: boolean;
}

export function ExpressTimeCard({ onSelect, disabled }: ExpressTimeCardProps) {
  return (
    <Card accentBorder>
      <Text style={styles.kicker}>SHORT ON TIME?</Text>
      <Text style={styles.title}>Military express strategies</Text>
      <Text style={styles.body}>
        Don&apos;t have 20–30 minutes? Convert today&apos;s mission using tactical
        Tabata density or condensed Army PRT-style sessions. Research shows short
        high-intensity blocks can still raise aerobic power and work capacity —
        see Progress for Day 10 / 14 / 30 expectations.
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

      {EXPRESS_OPTIONS.map((option) => (
        <Text key={option.strategy} style={styles.meta}>
          {option.label}: {option.strategy} — {option.description}
        </Text>
      ))}

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
    </Card>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.accent,
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
    color: colors.accent,
    marginBottom: 4,
    fontWeight: '700',
  },
});
