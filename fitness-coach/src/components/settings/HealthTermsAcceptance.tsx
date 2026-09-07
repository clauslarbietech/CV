import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HEALTH_DISCLAIMER_SHORT } from '@/constants/legal';
import { useTheme, radii, spacing, typography } from '@/theme';

type HealthTermsAcceptanceProps = {
  accepted: boolean;
  onChange: (value: boolean) => void;
};

export function HealthTermsAcceptance({
  accepted,
  onChange,
}: HealthTermsAcceptanceProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          gap: spacing.sm,
          alignItems: 'flex-start',
          borderWidth: 1,
          borderColor: accepted ? colors.accent : colors.border,
          borderRadius: radii.lg,
          padding: spacing.md,
          backgroundColor: colors.surface,
        },
        box: {
          width: 22,
          height: 22,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: accepted ? colors.accent : colors.textMuted,
          backgroundColor: accepted ? colors.accent : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        },
        check: {
          color: colors.black,
          fontWeight: '800',
          fontSize: 14,
        },
        copy: {
          flex: 1,
          ...typography.caption,
          color: colors.textSecondary,
        },
        label: {
          ...typography.bodyBold,
          color: colors.textPrimary,
          marginBottom: 4,
        },
      }),
    [colors, accepted],
  );

  return (
    <Pressable
      onPress={() => onChange(!accepted)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: accepted }}
      accessibilityLabel="Accept health and safety terms"
    >
      <View style={styles.row}>
        <View style={styles.box}>{accepted ? <Text style={styles.check}>✓</Text> : null}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>I understand this is not medical advice</Text>
          <Text style={styles.copy}>{HEALTH_DISCLAIMER_SHORT}</Text>
        </View>
      </View>
    </Pressable>
  );
}
