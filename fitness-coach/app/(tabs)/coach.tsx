import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SquadProfiles } from '@/components/squad/SquadProfiles';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useTheme, spacing, typography } from '@/theme';

/** Buddy profiles + shared workouts. Chat lives under Notes. */
export default function CoachScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: { ...typography.title, color: colors.textPrimary },
        accent: { color: colors.accentText },
        subtitle: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.kicker}>BUDDIES</Text>
      <Text style={styles.title}>
        Train <Text style={styles.accent}>Together</Text>
      </Text>
      <Text style={styles.subtitle}>
        Link a buddy, share a workout, and check in. Chat and day logs are in
        the Notes tab.
      </Text>

      <AppButton
        label="Open Notes · chat & day log"
        variant="action"
        onPress={() => router.push('/(tabs)/notes')}
      />

      <View style={{ marginTop: spacing.md }}>
        <SquadProfiles />
      </View>
    </Screen>
  );
}
