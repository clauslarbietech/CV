import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing } from '@/theme';

type SegmentOption<T extends string> = {
  id: T;
  label: string;
};

type SegmentToggleProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentToggle<T extends string>({
  options,
  value,
  onChange,
}: SegmentToggleProps<T>) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          backgroundColor: colors.borderSubtle,
          borderRadius: radii.pill,
          padding: 3,
          gap: 2,
        },
        pill: {
          flex: 1,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          borderRadius: radii.pill,
          alignItems: 'center',
        },
        pillActive: {
          backgroundColor: colors.action,
        },
        label: {
          fontSize: 12,
          fontWeight: '700',
          color: colors.textSecondary,
        },
        labelActive: {
          color: colors.onAction,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => onChange(option.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
