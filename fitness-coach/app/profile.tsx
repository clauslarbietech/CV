import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppearanceToggle } from '@/components/settings/AppearanceToggle';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { COACH_PERSONALITIES } from '@/constants/coach';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { CoachPersonality, Sex } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const profile = useProfileStore((s) => s.profile);
  const setCoachPersonality = useProfileStore((s) => s.setCoachPersonality);
  const setSex = useProfileStore((s) => s.setSex);
  const resetOnboarding = useProfileStore((s) => s.resetOnboarding);
  const signOut = useAuthStore((s) => s.signOut);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: {
          ...typography.overline,
          color: colors.accentText,
        },
        title: {
          ...typography.hero,
          color: colors.textPrimary,
        },
        subtitle: {
          ...typography.body,
          color: colors.textSecondary,
        },
        row: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
        },
        chips: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
        },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.kicker}>SETTINGS</Text>
      <Text style={styles.title}>{profile?.firstName ?? 'Athlete'}</Text>
      <Text style={styles.subtitle}>{profile?.email ?? 'Guest athlete'}</Text>

      <Text style={styles.section}>Appearance</Text>
      <AppearanceToggle />

      <Text style={styles.section}>Body · form guide</Text>
      <Text style={styles.subtitle}>
        Mission graphics switch to a male or female anatomical model.
      </Text>
      <View style={styles.chips}>
        {(['male', 'female'] as const).map((option) => (
          <OptionChip
            key={option}
            label={option === 'male' ? 'Male' : 'Female'}
            selected={profile?.sex === option}
            onPress={() => setSex(option as Sex)}
          />
        ))}
      </View>

      <Card>
        <Text style={styles.row}>Rank: {profile?.rank ?? 'Recruit'}</Text>
        <Text style={styles.row}>XP: {profile?.xp ?? 0}</Text>
        <Text style={styles.row}>Body: {profile?.sex ?? '—'}</Text>
        <Text style={styles.row}>
          Goal: {profile?.primaryGoal?.replace('_', ' ') ?? '—'}
        </Text>
        <Text style={styles.row}>
          Experience: {profile?.experienceLevel ?? '—'}
        </Text>
        <Text style={styles.row}>
          Location: {profile?.workoutLocation ?? '—'}
        </Text>
      </Card>

      <Text style={styles.section}>Coach personality</Text>
      <View style={styles.chips}>
        {COACH_PERSONALITIES.map((coach) => (
          <OptionChip
            key={coach.id}
            label={coach.name}
            selected={profile?.coachPersonality === coach.id}
            onPress={() => setCoachPersonality(coach.id as CoachPersonality)}
          />
        ))}
      </View>

      <AppButton
        label="Replay intro"
        variant="secondary"
        onPress={() => {
          resetOnboarding();
          router.replace('/(auth)/welcome');
        }}
      />
      <AppButton
        label="Sign out"
        variant="ghost"
        onPress={async () => {
          resetOnboarding();
          await signOut();
          router.replace('/(auth)/welcome');
        }}
      />
    </Screen>
  );
}
