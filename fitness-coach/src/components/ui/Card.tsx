import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radii, spacing } from '@/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  military?: boolean;
  accentBorder?: boolean;
}

export function Card({
  children,
  style,
  military = false,
  accentBorder = false,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        military && styles.military,
        accentBorder && styles.accentBorder,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  military: {
    backgroundColor: colors.militarySurface,
    borderColor: colors.militaryBorder,
  },
  accentBorder: {
    borderColor: colors.borderAccent,
    borderWidth: 1.5,
  },
});
