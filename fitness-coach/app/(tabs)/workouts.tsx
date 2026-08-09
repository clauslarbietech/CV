import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ProgramCard } from '@/components/workout/ProgramCard';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { OPERATION_IRON_14 } from '@/constants/programs';
import { useProgramStore } from '@/store/programStore';
import { colors, spacing, typography } from '@/theme';

export default function WorkoutsScreen() {
  const enrollment = useProgramStore((s) => s.enrollment);
  const enrollInIron14 = useProgramStore((s) => s.enrollInIron14);

  const enrolled = enrollment?.programId === OPERATION_IRON_14.id;

  return (
    <Screen>
      <Text style={styles.kicker}>CORE PROGRAM</Text>
      <Text style={styles.title}>OPERATION IRON 14</Text>
      <Text style={styles.subtitle}>
        Phase 1 is a transformation engine — not a generic workout library. This
        is the only fully executable program.
      </Text>

      <ProgramCard
        program={OPERATION_IRON_14}
        featured
        onPress={() =>
          router.push({
            pathname: '/program/[id]',
            params: { id: OPERATION_IRON_14.id },
          })
        }
      />

      <View style={styles.actions}>
        {!enrolled ? (
          <AppButton
            label="Enroll & open Day 1"
            variant="military"
            onPress={() => {
              enrollInIron14('soldier');
              router.push({
                pathname: '/session/[programId]',
                params: {
                  programId: OPERATION_IRON_14.id,
                  day: '1',
                },
              });
            }}
          />
        ) : (
          <AppButton
            label={`Continue Day ${enrollment?.currentDay ?? 1}`}
            variant="military"
            onPress={() =>
              router.push({
                pathname: '/session/[programId]',
                params: {
                  programId: OPERATION_IRON_14.id,
                  day: String(enrollment?.currentDay ?? 1),
                },
              })
            }
          />
        )}
        <AppButton
          label="View full 14-day protocol"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: '/program/[id]',
              params: { id: OPERATION_IRON_14.id },
            })
          }
        />
      </View>

      <Text style={styles.locked}>
        Future programs (30-Day Shred, Mass Builder, etc.) stay locked until
        OPERATION IRON 14 session engine is proven end-to-end.
      </Text>
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
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  locked: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
