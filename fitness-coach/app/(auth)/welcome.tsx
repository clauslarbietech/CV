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
        colors={['#000000', '#0A1A00', '#000000']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.hero}>
        <Text style={styles.brand}>FITLIFE</Text>
        <Text style={styles.promise}>YOUR FITNESS LIFE. ONE AI COACH.</Text>
        <Text style={styles.headline}>
          Personalized <Text style={styles.accentWord}>Workouts</Text>
          {'\n'}That Fit Your Goals.
        </Text>
        <Text style={styles.support}>
          Train, eat better, stay accountable — and shred with OPERATION IRON 14.
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
  accentWord: {
    color: colors.accent,
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
