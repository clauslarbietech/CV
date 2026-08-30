import { Switch, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme';
import { spacing, typography } from '@/theme';

/** Day / night appearance toggle for Profile → Settings. */
export function AppearanceToggle() {
  const { colors, isDay, setMode } = useTheme();

  return (
    <Card accentBorder>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Appearance
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isDay
              ? 'Daytime mode — light field for outdoor / daytime use'
              : 'Nighttime mode — neon on black (default)'}
          </Text>
        </View>
        <View style={styles.toggleCol}>
          <Text style={[styles.modeLabel, { color: colors.accentText }]}>
            {isDay ? 'Day' : 'Night'}
          </Text>
          <Switch
            accessibilityLabel="Toggle daytime and nighttime mode"
            value={isDay}
            onValueChange={(on) => setMode(on ? 'day' : 'night')}
            trackColor={{
              false: colors.surfaceHover,
              true: colors.accentMuted,
            }}
            thumbColor={isDay ? colors.accent : colors.textMuted}
            ios_backgroundColor={colors.surfaceHover}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    ...typography.subheading,
  },
  subtitle: {
    ...typography.caption,
  },
  toggleCol: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  modeLabel: {
    ...typography.overline,
  },
});
