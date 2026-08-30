import { createElement, useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme, radii, spacing, typography } from '@/theme';

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
  const { colors } = useTheme();
  const selectedBg = tone === 'blue' ? colors.action : colors.accent;
  const selectedLabelColor = tone === 'blue' ? colors.onAction : colors.onAccent;

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          color: selectedLabelColor,
        },
      }),
    [colors, selectedLabelColor],
  );

  if (Platform.OS === 'web') {
    return createElement(
      'button',
      {
        type: 'button',
        onClick: onPress,
        'aria-pressed': Boolean(selected),
        'aria-label': label,
        style: {
          minHeight: 48,
          paddingLeft: spacing.md,
          paddingRight: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          borderRadius: radii.md,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: selected ? selectedBg : colors.border,
          backgroundColor: selected ? selectedBg : colors.surface,
          color: selected ? selectedLabelColor : colors.textPrimary,
          fontWeight: 700,
          fontSize: 15,
          cursor: 'pointer',
        },
      },
      label,
    );
  }

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
