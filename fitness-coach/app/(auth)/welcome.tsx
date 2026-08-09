import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  return (
    <Screen contentStyle={styles.content}>
      <LinearGradient
        colors={['#0A0B0D', '#122018', '#0A0B0D']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.hero}>
        <Text style={styles.brand}>FITLIFE</Text>
        <Text style={styles.promise}>YOUR FITNESS LIFE. ONE AI COACH.</Text>
        <Text style={styles.headline}>
          Let&apos;s build the strongest version of you.
        </Text>
        <Text style={styles.support}>
          I&apos;ll help you train, eat better, stay accountable, and adjust your
          plan as you progress.
        </Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Get started"
          onPress={() => router.push('/(auth)/sign-up')}
        />
        <AppButton
          label="I already have an account"
          variant="secondary"
          onPress={() => router.push('/(auth)/sign-in')}
        />
        <AppButton
          label="Continue as guest"
          variant="ghost"
          onPress={() => {
            continueAsGuest('Athlete');
            router.replace('/(onboarding)/welcome');
          }}
        />
        <Link href="/(auth)/sign-in" style={styles.link}>
          <Text style={styles.linkText}>Secure sign-in with email</Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.xxxl,
  },
  hero: {
    gap: spacing.md,
    paddingTop: spacing.huge,
  },
  brand: {
    ...typography.overline,
    color: colors.accent,
  },
  promise: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  headline: {
    ...typography.hero,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  support: {
    ...typography.body,
    color: colors.textSecondary,
    maxWidth: 340,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  link: {
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
  linkText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
