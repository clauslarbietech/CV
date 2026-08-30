import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useTheme, spacing, typography } from '@/theme';

export type NutritionExperimentalGateProps = {
  /** Section heading shown above the warning card */
  sectionTitle: string;
  /** Short label on the warning card */
  warningTitle: string;
  /** Bullet lines — keep plain language */
  warningLines: string[];
  acknowledgeLabel?: string;
  children: React.ReactNode;
};

/**
 * Collapses experimental / non-evidence nutrition content behind an explicit
 * acknowledgment so users see the warning before protocol details.
 */
export function NutritionExperimentalGate({
  sectionTitle,
  warningTitle,
  warningLines,
  acknowledgeLabel = 'I understand — show details',
  children,
}: NutritionExperimentalGateProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.md,
        },
        warnCard: {
          borderColor: colors.danger,
          backgroundColor: colors.surface,
        },
        warnKicker: {
          ...typography.overline,
          color: colors.danger,
          fontWeight: '700',
        },
        warnTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        warnLine: {
          ...typography.body,
          color: colors.textSecondary,
          marginTop: spacing.xs,
        },
        notAdvice: {
          ...typography.caption,
          color: colors.danger,
          fontWeight: '700',
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <>
      <Text style={styles.section}>{sectionTitle}</Text>
      <Card accentBorder style={styles.warnCard}>
        <Text style={styles.warnKicker}>⚠ NOT RECOMMENDED FOR TRAINING DAYS</Text>
        <Text style={styles.warnTitle}>{warningTitle}</Text>
        {warningLines.map((line) => (
          <Text key={line} style={styles.warnLine}>
            · {line}
          </Text>
        ))}
        <Text style={styles.notAdvice}>
          Not medical advice. Ask a clinician before restrictive diets if you
          have kidney disease, gout, hypertension, or take prescription meds.
        </Text>
        {!expanded ? (
          <AppButton
            label={acknowledgeLabel}
            variant="secondary"
            onPress={() => setExpanded(true)}
            style={{ marginTop: spacing.md }}
          />
        ) : null}
      </Card>
      {expanded ? <View style={{ marginTop: spacing.sm }}>{children}</View> : null}
    </>
  );
}

/** Shared warning copy for nutrition audit flags */
export const SARDINE_PROTOCOL_WARNING = {
  warningTitle: '5-day sardine + egg protocol — not evidence-based',
  warningLines: [
    'No clinical trial supports this exact sardine + egg + electrolyte combo for fat loss.',
    'Early scale drops are usually water and glycogen — not proof of fat loss.',
    'Low variety can miss fiber, vitamins, and minerals if extended beyond a few days.',
    'Sardine-heavy meals can push sodium high — caution with blood pressure or kidney issues.',
    'Use only as a short optional reset, then return to balanced fuel tracks above.',
  ],
} as const;

export const VIRAL_MILITARY_DIET_WARNING = {
  warningTitle: '3-day viral “military diet” — unofficial and under-fueled',
  warningLines: [
    'Not affiliated with the U.S. military or any official armed-forces nutrition program.',
    'Roughly 1,100–1,400 calories per day — too low to safely fuel hard workouts.',
    'Most weight change is water; rebound is common when calories normalize.',
    'Never combine with intense training days — prefer Short-Block or Everyday 16:8 fuel instead.',
    'Ice-cream / hot-dog menu items are internet folklore, not performance nutrition.',
  ],
} as const;

export const FOOD_SCAN_WARNING =
  'Estimates come from your photo filename, not computer vision. Do not use for medical, allergy, or prescription decisions.';
