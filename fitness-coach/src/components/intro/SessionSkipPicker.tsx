import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { SKIP_SESSIONS, SkipSessionOption } from '@/constants/intro';
import { useTheme, spacing, typography } from '@/theme';

interface SessionSkipPickerProps {
  selectedId: string | null;
  onSelect: (option: SkipSessionOption) => void;
  onStart: () => void;
  onBack: () => void;
}

export function SessionSkipPicker({
  selectedId,
  onSelect,
  onStart,
  onBack,
}: SessionSkipPickerProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          gap: spacing.md,
          paddingTop: spacing.lg,
        },
        brand: {
          ...typography.overline,
          color: colors.accentText,
        },
        title: {
          ...typography.hero,
          color: colors.textPrimary,
        },
        accent: {
          color: colors.accentText,
        },
        support: {
          ...typography.body,
          color: colors.textSecondary,
        },
        list: {
          gap: spacing.sm,
          marginTop: spacing.sm,
        },
        row: {
          paddingVertical: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        rowActive: {
          borderBottomColor: colors.accent,
        },
        rowTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        rowTitleActive: {
          color: colors.accentText,
        },
        rowSub: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: 4,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.brand}>JUMP IN</Text>
      <Text style={styles.title}>
        Pick a <Text style={styles.accent}>session</Text>
      </Text>
      <Text style={styles.support}>
        Skip setup — jump into a workout.
      </Text>

      <View style={styles.list}>
        {SKIP_SESSIONS.map((option) => {
          const active = selectedId === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option)}
              style={[styles.row, active && styles.rowActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.rowTitle, active && styles.rowTitleActive]}>
                {option.title}
              </Text>
              <Text style={styles.rowSub}>{option.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>

      <AppButton
        label="Start selected workout"
        disabled={!selectedId}
        onPress={onStart}
      />
      <AppButton label="Back" variant="ghost" onPress={onBack} />
    </View>
  );
}
