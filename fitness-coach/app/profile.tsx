import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { COACH_PERSONALITIES } from '@/constants/coach';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { CoachPersonality } from '@/types';
import { colors, spacing, typography } from '@/theme';

export default function ProfileScreen() {
  const profile = useProfileStore((s) => s.profile);
  const setCoachPersonality = useProfileStore((s) => s.setCoachPersonality);
  const resetOnboarding = useProfileStore((s) => s.resetOnboarding);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <Screen>
      <Text style={styles.title}>{profile?.firstName ?? 'Athlete'}</Text>
      <Text style={styles.subtitle}>{profile?.email ?? 'Guest athlete'}</Text>

      <Card>
        <Text style={styles.row}>Rank: {profile?.rank ?? 'Recruit'}</Text>
        <Text style={styles.row}>XP: {profile?.xp ?? 0}</Text>
        <Text style={styles.row}>
          Body: {profile?.sex ?? '—'}
        </Text>
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

const styles = StyleSheet.create({
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
});
