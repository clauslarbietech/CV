import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { ExerciseRow } from '@/components/workout/ExerciseRow';
import { getProgramById } from '@/constants/programs';
import { useProgramStore } from '@/store/programStore';
import { formatDuration, formatRest } from '@/utils/format';
import { colors, radii, spacing, typography } from '@/theme';

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const program = getProgramById(id);
  const enrollment = useProgramStore((s) => s.enrollment);
  const enrollInIron14 = useProgramStore((s) => s.enrollInIron14);
  const setDifficulty = useProgramStore((s) => s.setDifficulty);

  if (!program) {
    return (
      <Screen>
        <EmptyState
          title="Program not found"
          description="This program is not available yet."
          actionLabel="Back to workouts"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const isIron = program.id === 'operation-iron-14';
  const tier = enrollment?.difficulty ?? 'soldier';
  const isEnrolled = enrollment?.programId === program.id;

  return (
    <Screen>
      <Text style={styles.kicker}>
        {program.featured ? 'FEATURED CHALLENGE' : 'PROGRAM'}
      </Text>
      <Text style={styles.title}>{program.name}</Text>
      <Text style={styles.subtitle}>{program.subtitle}</Text>
      <Text style={styles.tagline}>{program.tagline}</Text>

      <View style={styles.meta}>
        <Text style={styles.metaText}>{program.durationDays} days</Text>
        <Text style={styles.metaText}>{program.equipment}</Text>
        <Text style={styles.metaText}>{program.averageWorkout}</Text>
        <Text style={styles.metaText}>{program.difficulty}</Text>
      </View>

      <Text style={styles.section}>Goals</Text>
      {program.goals.map((goal) => (
        <Text key={goal} style={styles.goal}>
          • {goal}
        </Text>
      ))}

      {isIron ? (
        <>
          <Text style={styles.section}>Difficulty</Text>
          <View style={styles.tiers}>
            {(['recruit', 'soldier', 'elite'] as const).map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  if (!isEnrolled) enrollInIron14(item);
                  else setDifficulty(item);
                }}
                style={[styles.tier, tier === item && styles.tierActive]}
              >
                <Text
                  style={[
                    styles.tierText,
                    tier === item && styles.tierTextActive,
                  ]}
                >
                  {item.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {!isEnrolled ? (
            <AppButton
              label="Enroll & start Day 1"
              variant="military"
              onPress={() => {
                enrollInIron14(tier);
                router.push({
                  pathname: '/session/[programId]',
                  params: { programId: program.id, day: '1' },
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
                    programId: program.id,
                    day: String(enrollment?.currentDay ?? 1),
                  },
                })
              }
            />
          )}

          <Text style={styles.section}>Mission calendar</Text>
          {program.days.map((day) => {
            const done = enrollment?.completedDayIds.includes(day.day);
            return (
              <Pressable
                key={day.day}
                style={[styles.dayCard, done && styles.dayDone]}
                onPress={() =>
                  router.push({
                    pathname: '/session/[programId]',
                    params: {
                      programId: program.id,
                      day: String(day.day),
                    },
                  })
                }
              >
                <Text style={styles.dayTitle}>
                  DAY {day.day} — {day.title}
                </Text>
                <Text style={styles.dayMeta}>
                  {formatDuration(day.estimatedMinutes)}
                  {day.rounds ? ` · ${day.rounds} rounds` : ''}
                  {formatRest(day.restSec) ? ` · Rest ${formatRest(day.restSec)}` : ''}
                  {done ? ' · Complete' : ''}
                </Text>
                {day.exercises.slice(0, 3).map((exercise, index) => (
                  <ExerciseRow
                    key={exercise.id}
                    exercise={exercise}
                    tier={tier}
                    index={index + 1}
                  />
                ))}
              </Pressable>
            );
          })}
        </>
      ) : (
        <EmptyState
          title="Coming soon"
          description="Only OPERATION IRON 14 is fully implemented in this MVP. Architecture is ready for these programs next."
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.militaryAccent,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.subheading,
    color: colors.textSecondary,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.sm,
  },
  section: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  goal: {
    ...typography.body,
    color: colors.textSecondary,
  },
  tiers: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tier: {
    flex: 1,
    minHeight: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  tierActive: {
    borderColor: colors.militaryAccent,
    backgroundColor: colors.militarySurface,
  },
  tierText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tierTextActive: {
    color: colors.militaryAccent,
    fontWeight: '700',
  },
  dayCard: {
    backgroundColor: colors.militarySurface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.militaryBorder,
    padding: spacing.md,
    gap: spacing.xxs,
  },
  dayDone: {
    borderColor: colors.accent,
  },
  dayTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  dayMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
});
