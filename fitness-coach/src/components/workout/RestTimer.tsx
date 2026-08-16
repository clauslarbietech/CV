import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { formatClock } from '@/features/workouts/sessionEngine';
import { useTheme, radii, spacing, typography } from '@/theme';

interface RestTimerProps {
  seconds: number;
  onSkip: () => void;
  label?: string;
}

export function RestTimer({ seconds, onSkip, label = 'REST' }: RestTimerProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          alignItems: 'center',
          gap: spacing.md,
          paddingVertical: spacing.xxl,
        },
        label: {
          ...typography.overline,
          color: colors.accentText,
        },
        ring: {
          width: 220,
          height: 220,
          borderRadius: 110,
          borderWidth: 8,
          borderColor: colors.action,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
        },
        timer: {
          fontSize: 56,
          fontWeight: '800',
          color: colors.textPrimary,
          letterSpacing: -1,
        },
        hint: {
          ...typography.body,
          color: colors.textSecondary,
          textAlign: 'center',
          paddingHorizontal: spacing.xl,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.ring}>
        <Text style={styles.timer}>{formatClock(seconds)}</Text>
      </View>
      <Text style={styles.hint}>Breathe. Next movement loads automatically.</Text>
      <AppButton label="Skip rest" variant="secondary" onPress={onSkip} />
    </View>
  );
}
