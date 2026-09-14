import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { generateMotivationalLine } from '@/constants/coach/voiceCoach';
import { CoachPersonality } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

type MotivationalCoachCardProps = {
  personality: CoachPersonality;
  personalityLabel: string;
  firstName?: string;
  programName: string;
  day: number;
};

/**
 * Scripted coach pep talks (beta) — not a live AI model.
 * Full conversation lives under Notes → Coach (beta).
 */
export function MotivationalCoachCard({
  personality,
  personalityLabel,
  firstName,
  programName,
  day,
}: MotivationalCoachCardProps) {
  const { colors } = useTheme();
  const [line, setLine] = useState(() =>
    generateMotivationalLine({
      personality,
      firstName,
      programName,
      day,
    }),
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        body: {
          ...typography.body,
          color: colors.textPrimary,
          marginVertical: spacing.sm,
          lineHeight: 22,
        },
        meta: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: spacing.sm,
        },
        hint: {
          ...typography.caption,
          color: colors.textSecondary,
          marginTop: spacing.xs,
        },
      }),
    [colors],
  );

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>
        COACH (TIPS) · {personalityLabel.toUpperCase()}
      </Text>
      <Text style={styles.title}>Today’s pep talk</Text>
      <Text style={styles.body}>“{line}”</Text>
      <AppButton
        label="New pep talk"
        variant="secondary"
        onPress={() =>
          setLine(
            generateMotivationalLine({
              personality,
              firstName,
              programName,
              day,
            }),
          )
        }
      />
      <Text style={styles.hint}>
        Scripted replies · Chat in Notes · Trainer inbox is local-only
      </Text>
    </Card>
  );
}
