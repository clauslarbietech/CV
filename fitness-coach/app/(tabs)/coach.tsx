import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/theme';

export default function CoachScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>LOCKED UNTIL PHASE 1 COMPLETE</Text>
      <Text style={styles.title}>AI Coach</Text>
      <Text style={styles.subtitle}>
        Conversational coaching stays deferred until OPERATION IRON 14 works
        end-to-end: onboard → Day 1 session → save → Day 2 unlock.
      </Text>
      <Card>
        <Text style={styles.body}>
          Your coach personality is already saved from onboarding and will drive
          tone once the chat engine ships.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.warning,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
