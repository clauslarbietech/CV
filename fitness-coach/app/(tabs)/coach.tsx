import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/theme';

const SAMPLE_PROMPTS = [
  'What should I train today?',
  "I'm sore from yesterday.",
  'I only have 15 minutes.',
  "I can't get to the gym.",
  'How am I doing this week?',
];

export default function CoachScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>AI COACH</Text>
      <Text style={styles.title}>Your coach remembers the plan</Text>
      <Text style={styles.subtitle}>
        Conversational coaching arrives in Phase 6. All AI requests will run
        through a secure backend context builder — never with exposed API keys.
      </Text>

      <Card>
        <Text style={styles.cardTitle}>Coming next</Text>
        <Text style={styles.body}>
          Ask about today&apos;s mission, convert workouts for home, adjust
          difficulty, and get weekly analysis grounded in your history.
        </Text>
      </Card>

      <Text style={styles.section}>You&apos;ll be able to ask</Text>
      <View style={styles.prompts}>
        {SAMPLE_PROMPTS.map((prompt) => (
          <View key={prompt} style={styles.prompt}>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cardTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  prompts: {
    gap: spacing.xs,
  },
  prompt: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  promptText: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
