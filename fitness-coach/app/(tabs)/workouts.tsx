import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ProgramCard } from '@/components/workout/ProgramCard';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { OPERATION_IRON_14, OPERATION_IRON_30 } from '@/constants/programs';
import { useProgramStore } from '@/store/programStore';
import { colors, spacing, typography } from '@/theme';

export default function WorkoutsScreen() {
  const enrollment = useProgramStore((s) => s.enrollment);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);

  const onIron30 =
    enrollment?.programId === OPERATION_IRON_30.id
      ? enrollment
      : null;

  return (
    <Screen>
      <Text style={styles.kicker}>NO EQUIPMENT</Text>
      <Text style={styles.title}>
        30 Military <Text style={styles.accent}>Workouts</Text>
      </Text>
      <Text style={styles.subtitle}>
        Full bodyweight protocol. Home. Hotel. Anywhere.
      </Text>

      <ProgramCard
        program={OPERATION_IRON_30}
        featured
        onPress={() =>
          router.push({
            pathname: '/program/[id]',
            params: { id: OPERATION_IRON_30.id },
          })
        }
      />

      <View style={styles.actions}>
        <AppButton
          label={
            onIron30
              ? `Continue Day ${onIron30.currentDay}`
              : 'Start Day 1 now'
          }
          variant="military"
          onPress={() => {
            if (!onIron30) enrollInProgram(OPERATION_IRON_30.id, 'soldier');
            const day = useProgramStore.getState().enrollment?.currentDay ?? 1;
            router.push({
              pathname: '/session/[programId]',
              params: {
                programId: OPERATION_IRON_30.id,
                day: String(day),
              },
            });
          }}
        />
      </View>

      <Text style={styles.section}>Also available</Text>
      <ProgramCard
        program={OPERATION_IRON_14}
        onPress={() =>
          router.push({
            pathname: '/program/[id]',
            params: { id: OPERATION_IRON_14.id },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.militaryAccent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  accent: {
    color: colors.accent,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  section: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
});
