import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

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
      secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
      },
      ghost: {
        backgroundColor: 'transparent',
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
