import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/Card';
import { HEALTH_DISCLAIMER_FULL, HEALTH_DISCLAIMER_SHORT } from '@/constants/legal';
import { useTheme, spacing, typography } from '@/theme';

type HealthDisclaimerCardProps = {
  compact?: boolean;
};

export function HealthDisclaimerCard({ compact = false }: HealthDisclaimerCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.danger, fontWeight: '700' },
        body: {
          ...typography.body,
          color: colors.textSecondary,
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>HEALTH & SAFETY</Text>
      <Text style={styles.body}>
        {compact ? HEALTH_DISCLAIMER_SHORT : HEALTH_DISCLAIMER_FULL}
      </Text>
    </Card>
  );
}
