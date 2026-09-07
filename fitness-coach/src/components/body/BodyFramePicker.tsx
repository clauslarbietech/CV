import { createElement, useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  BODY_FRAME_LABELS,
  BODY_FRAME_SIZES,
  frameScale,
} from '@/constants/bodyVision';
import { BodyFrameSize } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

type BodyFramePickerProps = {
  value: BodyFrameSize | null;
  onChange: (size: BodyFrameSize) => void;
  title: string;
  hint?: string;
};

export function BodyFramePicker({
  value,
  onChange,
  title,
  hint,
}: BodyFramePickerProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginBottom: spacing.xxs,
        },
        hint: {
          ...typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        row: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
        },
        chip: {
          minWidth: '22%',
          flexGrow: 1,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.xs,
          alignItems: 'center',
          backgroundColor: colors.surface,
          gap: 4,
        },
        chipActive: {
          borderColor: colors.accent,
          backgroundColor: colors.accentSoft,
        },
        dotRow: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 2,
          height: 28,
        },
        dot: {
          width: 6,
          borderRadius: 3,
          backgroundColor: colors.accent,
        },
        label: {
          ...typography.caption,
          color: colors.textPrimary,
          fontWeight: '700',
          fontSize: 11,
        },
      }),
    [colors],
  );

  const renderChip = (size: BodyFrameSize) => {
    const active = value === size;
    const scale = frameScale(size);
    const dotHeight = Math.round(12 + scale * 14);

    const content = (
      <>
        <View style={styles.dotRow}>
          <View style={[styles.dot, { height: dotHeight }]} />
        </View>
        <Text style={styles.label}>{BODY_FRAME_LABELS[size]}</Text>
      </>
    );

    if (Platform.OS === 'web') {
      return createElement(
        'button',
        {
          key: size,
          type: 'button',
          onClick: () => onChange(size),
          'aria-pressed': active,
          style: {
            minWidth: '22%',
            flexGrow: 1,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: active ? colors.accent : colors.border,
            borderRadius: 12,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: active ? colors.accentSoft : colors.surface,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          },
        },
        content,
      );
    }

    return (
      <Pressable
        key={size}
        onPress={() => onChange(size)}
        style={[styles.chip, active && styles.chipActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
      >
        {content}
      </Pressable>
    );
  };

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.row}>{BODY_FRAME_SIZES.map(renderChip)}</View>
    </View>
  );
}
