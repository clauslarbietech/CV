import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

interface OptionChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  tone?: 'green' | 'blue';
}

export function OptionChip({
  label,
  selected,
  onPress,
  tone = 'green',
}: OptionChipProps) {
  const selectedBg = tone === 'blue' ? colors.action : colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        selected && { backgroundColor: selectedBg, borderColor: selectedBg },
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  selectedLabel: {
    color: colors.black,
  },
});
