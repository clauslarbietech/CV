import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing, typography } from '@/theme';

type OptionChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  hint?: string;
  accessibilityLabel?: string;
};

export function OptionChip({
  label,
  selected = false,
  onPress,
  hint,
  accessibilityLabel,
}: OptionChipProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        chip: {
          minHeight: 52,
          borderRadius: radii.lg,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          borderWidth: 1.5,
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primarySoft : colors.surfaceSoft,
          marginBottom: spacing.sm,
        },
        label: {
          ...typography.bodyBold,
          color: colors.textPrimary,
        },
        hint: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: 2,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        mark: {
          ...typography.caption,
          color: selected ? colors.primary : colors.textMuted,
          fontFamily: typography.bodyBold.fontFamily,
        },
      }),
    [colors, selected],
  );

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && { opacity: 0.88 }]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{label}</Text>
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
        <Text style={styles.mark}>{selected ? 'Selected' : 'Tap'}</Text>
      </View>
    </Pressable>
  );
}
