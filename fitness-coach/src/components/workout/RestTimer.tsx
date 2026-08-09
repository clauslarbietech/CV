import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { colors, spacing, typography } from '@/theme';
import { formatClock } from '@/features/workouts/sessionEngine';

interface RestTimerProps {
  seconds: number;
  onSkip: () => void;
  label?: string;
}

export function RestTimer({ seconds, onSkip, label = 'REST' }: RestTimerProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.timer}>{formatClock(seconds)}</Text>
      <Text style={styles.hint}>Breathe. Next movement loads automatically.</Text>
      <AppButton label="Skip rest" variant="secondary" onPress={onSkip} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  label: {
    ...typography.overline,
    color: colors.militaryAccent,
  },
  timer: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  hint: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
