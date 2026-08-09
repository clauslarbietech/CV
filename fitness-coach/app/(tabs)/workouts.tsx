import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ProgramCard } from '@/components/workout/ProgramCard';
import { Screen } from '@/components/ui/Screen';
import { WORKOUT_PROGRAMS } from '@/constants/programs';
import { colors, spacing, typography } from '@/theme';

export default function WorkoutsScreen() {
  const [featured, ...rest] = WORKOUT_PROGRAMS;

  return (
    <Screen>
      <Text style={styles.kicker}>WORKOUT LIBRARY</Text>
      <Text style={styles.title}>Programs & challenges</Text>
      <Text style={styles.subtitle}>
        Start with the featured mission. Additional programs unlock as your plan
        expands.
      </Text>

      <View style={styles.list}>
        <ProgramCard
          program={featured}
          featured
          onPress={() =>
            router.push({
              pathname: '/program/[id]',
              params: { id: featured.id },
            })
          }
        />
        {rest.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onPress={() =>
              router.push({
                pathname: '/program/[id]',
                params: { id: program.id },
              })
            }
          />
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
    marginBottom: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
});
