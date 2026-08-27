import { createElement, useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { useTheme, radii, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'military' | 'action' | 'danger';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  accessibilityHint,
}: AppButtonProps) {
  const { colors } = useTheme();

  const styles = useMemo(() => {
    const labelByVariant: Record<Variant, string> = {
      primary: colors.onAccent,
      military: colors.onAccent,
      action: colors.onAction,
      danger: colors.onDanger,
      secondary: colors.textPrimary,
      ghost: colors.accentText,
    };

    return StyleSheet.create({
      base: {
        minHeight: 54,
        borderRadius: radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
      },
      primary: {
        backgroundColor: colors.accent,
      },
      military: {
        backgroundColor: colors.accent,
      },
      action: {
        backgroundColor: colors.action,
      },
      danger: {
        backgroundColor: colors.danger,
      },
      secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.985 }],
      },
      disabled: {
        opacity: 0.45,
      },
      label: {
        ...typography.bodyBold,
        fontSize: 16,
        color: labelByVariant[variant],
      },
    });
  }, [colors, variant]);

  // Native <button> on web — RN Pressable often misses taps in Chrome / automation.
  if (Platform.OS === 'web') {
    const bg =
      variant === 'primary' || variant === 'military'
        ? colors.accent
        : variant === 'action'
          ? colors.action
          : variant === 'danger'
            ? colors.danger
            : variant === 'secondary'
              ? colors.surface
              : 'transparent';
    const fg =
      variant === 'primary' || variant === 'military'
        ? colors.onAccent
        : variant === 'action'
          ? colors.onAction
          : variant === 'danger'
            ? colors.onDanger
            : variant === 'ghost'
              ? colors.accentText
              : colors.textPrimary;

    return createElement(
      'button',
      {
        type: 'button',
        disabled,
        onClick: disabled ? undefined : onPress,
        'aria-label': label,
        'aria-disabled': disabled,
        title: accessibilityHint,
        style: {
          minHeight: 54,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: spacing.xl,
          paddingRight: spacing.xl,
          paddingTop: 12,
          paddingBottom: 12,
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          borderStyle: 'solid',
          borderColor: colors.border,
          backgroundColor: bg,
          color: fg,
          fontWeight: 700,
          fontSize: 16,
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.45 : 1,
          width: style?.alignSelf === 'stretch' ? '100%' : undefined,
          marginTop: typeof style?.marginTop === 'number' ? style.marginTop : undefined,
        },
      },
      label,
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
