import { StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { Card } from '@/components/ui/Card';
import { useProfileStore } from '@/store/profileStore';
import { WeightUnit } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

type WeightUnitToggleProps = {
  /** Compact row for inline use (e.g. weight goals card). */
  compact?: boolean;
  /** When set, parent handles unit change (e.g. convert in-progress field values). */
  onUnitChange?: (unit: WeightUnit) => void;
};

/** kg / lb preference — weights are always stored in kg internally. */
export function WeightUnitToggle({
  compact = false,
  onUnitChange,
}: WeightUnitToggleProps) {
  const { colors } = useTheme();
  const weightUnit = useProfileStore((s) => s.profile?.weightUnit ?? 'kg');
  const setWeightUnit = useProfileStore((s) => s.setWeightUnit);

  const onSelect = (unit: WeightUnit) => {
    if (onUnitChange) onUnitChange(unit);
    else setWeightUnit(unit);
  };

  if (compact) {
    return (
      <View style={styles.compactRow}>
        {(['kg', 'lb'] as const).map((unit) => (
          <OptionChip
            key={unit}
            label={unit.toUpperCase()}
            selected={weightUnit === unit}
            onPress={() => onSelect(unit)}
          />
        ))}
      </View>
    );
  }

  return (
    <Card accentBorder>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Weight units</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Choose kg or lb for weight fields. We save in both formats behind the scenes.
      </Text>
      <View style={styles.chips}>
        {(['kg', 'lb'] as const).map((unit) => (
          <OptionChip
            key={unit}
            label={unit === 'kg' ? 'Kilograms (kg)' : 'Pounds (lb)'}
            selected={weightUnit === unit}
            onPress={() => onSelect(unit)}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subheading,
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing.xxs,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  compactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
