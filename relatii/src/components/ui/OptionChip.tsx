import { createElement, useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

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

  if (Platform.OS === 'web') {
    return createElement(
      'button',
      {
        type: 'button',
        onClick: (e: { stopPropagation?: () => void }) => {
          e?.stopPropagation?.();
          onPress();
        },
        'aria-label': accessibilityLabel ?? label,
        'aria-checked': selected,
        role: 'checkbox',
        style: {
          minHeight: 52,
          borderRadius: radii.lg,
          paddingLeft: spacing.lg,
          paddingRight: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          borderWidth: 1.5,
          borderStyle: 'solid',
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primarySoft : colors.surfaceSoft,
          marginBottom: spacing.sm,
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
          position: 'relative',
          zIndex: 5,
          pointerEvents: 'auto',
        },
      },
      createElement(
        'div',
        { style: { flex: 1 } },
        createElement(
          'div',
          {
            style: {
              fontFamily: typography.bodyBold.fontFamily,
              fontWeight: 700,
              fontSize: typography.bodyBold.fontSize,
              color: colors.textPrimary,
            },
          },
          label,
        ),
        hint
          ? createElement(
              'div',
              {
                style: {
                  fontFamily: typography.caption.fontFamily,
                  fontSize: typography.caption.fontSize,
                  color: colors.textMuted,
                  marginTop: 2,
                },
              },
              hint,
            )
          : null,
      ),
      createElement(
        'span',
        {
          style: {
            fontFamily: typography.bodyBold.fontFamily,
            fontSize: typography.caption.fontSize,
            color: selected ? colors.primary : colors.textMuted,
          },
        },
        selected ? 'Selected' : 'Tap',
      ),
    );
  }

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
