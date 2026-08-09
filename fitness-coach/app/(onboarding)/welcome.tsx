import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/theme';

export default function OnboardingWelcome() {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>AI FITNESS ASSESSMENT</Text>
        <Text style={styles.headline}>
          Let&apos;s build the strongest version of you.
        </Text>
        <Text style={styles.support}>
          I&apos;ll help you train, eat better, stay accountable, and adjust your
          plan as you progress.
        </Text>
      </View>
      <AppButton label="Begin assessment" onPress={() => router.push('/(onboarding)/basics')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.huge,
    paddingBottom: spacing.xxl,
  },
  hero: {
    gap: spacing.md,
  },
  kicker: {
    ...typography.overline,
    color: colors.accent,
  },
  headline: {
    ...typography.hero,
    color: colors.textPrimary,
  },
  support: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
