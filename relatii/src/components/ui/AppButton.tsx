import { createElement, useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme, radii, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dna';

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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          minHeight: 52,
          minWidth: 44,
          borderRadius: radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.xl,
          overflow: 'hidden',
        },
        secondary: {
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: colors.border,
        },
        ghost: {
          backgroundColor: 'transparent',
        },
        dna: {
          backgroundColor: colors.dna,
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
          color:
            variant === 'secondary'
              ? colors.textPrimary
              : variant === 'ghost'
                ? colors.primary
                : colors.onPrimary,
        },
      }),
    [colors, variant],
  );

  if (Platform.OS === 'web') {
    const isGradient = variant === 'primary';
    const bg =
      variant === 'dna'
        ? colors.dna
        : variant === 'secondary'
          ? colors.surface
          : variant === 'ghost'
            ? 'transparent'
            : colors.primary;
    const fg =
      variant === 'secondary'
        ? colors.textPrimary
        : variant === 'ghost'
          ? colors.primary
          : colors.onPrimary;

    return createElement(
      'button',
      {
        type: 'button',
        disabled,
        onClick: disabled
          ? undefined
          : (e: { stopPropagation?: () => void }) => {
              e?.stopPropagation?.();
              onPress();
            },
        'aria-label': label,
        'aria-disabled': disabled,
        title: accessibilityHint,
        style: {
          minHeight: 52,
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
          background: isGradient
            ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryEnd})`
            : bg,
          color: fg,
          fontFamily: typography.bodyBold.fontFamily,
          fontWeight: 700,
          fontSize: 16,
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.45 : 1,
          width: '100%',
          marginTop: typeof style?.marginTop === 'number' ? style.marginTop : undefined,
          position: 'relative',
          zIndex: 5,
          pointerEvents: 'auto',
        },
      },
      label,
    );
  }

  if (variant === 'primary') {
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
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.label}>{label}</Text>
      </Pressable>
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
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'dna' && styles.dna,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
