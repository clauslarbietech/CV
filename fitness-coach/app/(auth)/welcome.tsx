import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { OPERATION_IRON_30 } from '@/constants/programs';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { colors, radii, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const quickStart = useProfileStore((s) => s.quickStart);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);
  const [name, setName] = useState('');

  const enterApp = (startMission = false) => {
    const firstName = name.trim() || 'Athlete';
    continueAsGuest(firstName);
    const userId = useAuthStore.getState().userId ?? `guest-${Date.now()}`;
    quickStart({ userId, firstName });
    enrollInProgram(OPERATION_IRON_30.id, 'soldier');
    if (startMission) {
      router.replace({
        pathname: '/session/[programId]',
        params: { programId: OPERATION_IRON_30.id, day: '1' },
      });
      return;
    }
    router.replace('/(tabs)/today');
  };

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
          What&apos;s your <Text style={styles.accentWord}>name</Text>?
        </Text>
        <Text style={styles.support}>
          Jump straight into OPERATION IRON 30 — 30 days, no equipment, military
          bodyweight shred + fasting fuel plan.
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
          autoFocus
          autoCapitalize="words"
          returnKeyType="go"
          onSubmitEditing={() => enterApp(true)}
          style={styles.input}
          accessibilityLabel="Your name"
        />
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Start Day 1 now"
          onPress={() => enterApp(true)}
        />
        <AppButton
          label="Go to Today dashboard"
          variant="secondary"
          onPress={() => enterApp(false)}
        />
        <Text style={styles.hint}>
          Name in → Day 1 mission. Meds + work notes are pinned on Today.
        </Text>
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
    maxWidth: 360,
  },
  input: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderAccent,
    borderRadius: radii.lg,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
    ...typography.subheading,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
