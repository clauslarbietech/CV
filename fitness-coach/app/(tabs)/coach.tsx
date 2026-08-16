import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AudioDayLog } from '@/components/squad/AudioDayLog';
import { SquadChat } from '@/components/squad/SquadChat';
import { SquadProfiles } from '@/components/squad/SquadProfiles';
import { Screen } from '@/components/ui/Screen';
import { useTheme, spacing, typography } from '@/theme';

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
        stack: { gap: spacing.xl },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.kicker}>SQUAD SHARED APP</Text>
      <Text style={styles.title}>
        Train <Text style={styles.accent}>Together</Text>
      </Text>
      <Text style={styles.subtitle}>
        Profiles, shared missions, motivational chat, and an audio day log —
        so you and a buddy stay accountable on short or long military tracks.
      </Text>

      <View style={styles.stack}>
        <SquadProfiles />
        <SquadChat />
        <AudioDayLog />
      </View>
    </Screen>
  );
}
