import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AudioDayLog } from '@/components/squad/AudioDayLog';
import { SquadChat } from '@/components/squad/SquadChat';
import { RemindersPanel } from '@/components/today/RemindersPanel';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useTheme, spacing, typography } from '@/theme';

/**
 * Notes hub: meds/work notes + motivational chat + audio day log.
 * Keeps My Stuff short by owning the long reminder forms.
 */
export default function NotesScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: { ...typography.title, color: colors.textPrimary },
        subtitle: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        stack: { gap: spacing.xl },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.kicker}>NOTES · CHAT</Text>
      <Text style={styles.title}>Notes</Text>
      <Text style={styles.subtitle}>
        Meds, work and training notes, plus coach/buddy chat and your audio day
        log — all in one place.
      </Text>

      <AppButton
        label="Open squad profiles"
        variant="secondary"
        onPress={() => router.push('/(tabs)/coach')}
      />

      <View style={styles.stack}>
        <RemindersPanel />
        <Text style={styles.section}>Chat</Text>
        <SquadChat />
        <AudioDayLog />
      </View>
    </Screen>
  );
}
