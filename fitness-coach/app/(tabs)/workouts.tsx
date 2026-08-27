import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ProgramCard } from '@/components/workout/ProgramCard';
import { ExerciseGraphic } from '@/components/workout/ExerciseGraphic';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { CALISTHENICS_LESSON_PLANS } from '@/constants/programs/calisthenicsLessonPlans';
import {
  OPERATION_CALISTHENICS,
  OPERATION_IRON_14,
  OPERATION_IRON_30,
  OPERATION_LONG_TRAIN,
} from '@/constants/programs';
import { LONG_TRAIN_PHASES } from '@/constants/programs/operationLongTrain';
import { TRAINING_TRACKS } from '@/constants/research/militaryTimeline';
import { useProgramStore } from '@/store/programStore';
import { useTheme, spacing, typography } from '@/theme';

export default function WorkoutsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: {
          ...typography.overline,
          color: colors.militaryAccent,
        },
        title: {
          ...typography.title,
          color: colors.textPrimary,
        },
        accent: {
          color: colors.accentText,
        },
        subtitle: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        trackCard: {
          gap: spacing.md,
          marginBottom: spacing.sm,
        },
        sectionTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        trackBlock: { gap: 2 },
        trackLabel: {
          ...typography.bodyBold,
          color: colors.accentText,
        },
        trackMeta: {
          ...typography.caption,
          color: colors.textMuted,
        },
        outcome: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        actions: {
          gap: spacing.sm,
        },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.md,
        },
        longTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginBottom: spacing.xs,
        },
        lessonCard: {
          gap: spacing.sm,
        },
      }),
    [colors],
  );

  const enrollment = useProgramStore((s) => s.enrollment);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);

  const onIron30 =
    enrollment?.programId === OPERATION_IRON_30.id ? enrollment : null;

  return (
    <Screen>
      <Text style={styles.kicker}>WORKOUT TRACKS</Text>
      <Text style={styles.title}>
        Short · Standard · <Text style={styles.accent}>Long</Text>
      </Text>
      <Text style={styles.subtitle}>
        Simple bodyweight tracks for everyday life. Pair Nutrition to the same
        horizon. Invite a buddy in Coach to share a workout.
      </Text>

      <Card accentBorder style={styles.trackCard}>
        <Text style={styles.sectionTitle}>Choose your horizon</Text>
        {TRAINING_TRACKS.map((track) => (
          <View key={track.id} style={styles.trackBlock}>
            <Text style={styles.trackLabel}>
              {track.label} · {track.horizon}
            </Text>
            <Text style={styles.trackMeta}>{track.programHint}</Text>
            <Text style={styles.trackMeta}>Fuel: {track.fuelHint}</Text>
            {track.outcomes.map((line) => (
              <Text key={line} style={styles.outcome}>
                • {line}
              </Text>
            ))}
          </View>
        ))}
      </Card>

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
              : 'Start Iron 30 · Day 1'
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

      <Text style={styles.section}>Calisthenics · 21 days</Text>
      <ProgramCard
        program={OPERATION_CALISTHENICS}
        featured
        onPress={() =>
          router.push({
            pathname: '/program/[id]',
            params: { id: OPERATION_CALISTHENICS.id },
          })
        }
      />
      <AppButton
        label="Start Calisthenics Foundation"
        variant="action"
        onPress={() => {
          enrollInProgram(OPERATION_CALISTHENICS.id, 'soldier');
          router.push({
            pathname: '/session/[programId]',
            params: {
              programId: OPERATION_CALISTHENICS.id,
              day: '1',
            },
          });
        }}
      />

      <Text style={styles.section}>Short term · 14 days</Text>
      <ProgramCard
        program={OPERATION_IRON_14}
        onPress={() =>
          router.push({
            pathname: '/program/[id]',
            params: { id: OPERATION_IRON_14.id },
          })
        }
      />

      <Text style={styles.section}>Long train · 12 weeks</Text>
      <Card military>
        <Text style={styles.longTitle}>{OPERATION_LONG_TRAIN.name}</Text>
        <Text style={styles.subtitle}>{OPERATION_LONG_TRAIN.tagline}</Text>
        {LONG_TRAIN_PHASES.map((phase) => (
          <Text key={phase.id} style={styles.outcome}>
            • Weeks {phase.weeks} · {phase.title}: {phase.detail}
          </Text>
        ))}
      </Card>
      <ProgramCard
        program={OPERATION_LONG_TRAIN}
        onPress={() =>
          router.push({
            pathname: '/program/[id]',
            params: { id: OPERATION_LONG_TRAIN.id },
          })
        }
      />
      <AppButton
        label="Enroll Long Train"
        variant="secondary"
        onPress={() => {
          enrollInProgram(OPERATION_LONG_TRAIN.id, 'soldier');
          router.push({
            pathname: '/session/[programId]',
            params: {
              programId: OPERATION_LONG_TRAIN.id,
              day: '1',
            },
          });
        }}
      />

      <Text style={styles.section}>Calisthenics lesson plans</Text>
      <Text style={styles.subtitle}>
        Prefer horizons inside the Iron tracks, or enroll in the
        dedicated Calisthenics Foundation program above.
      </Text>
      {CALISTHENICS_LESSON_PLANS.map((plan) => (
        <Card key={plan.id} accentBorder style={styles.lessonCard}>
          <Text style={styles.longTitle}>
            {plan.label} · {plan.duration}
          </Text>
          <Text style={styles.trackMeta}>{plan.focus}</Text>
          <Text style={styles.trackLabel}>Weekly flow</Text>
          {plan.weeklyFlow.map((line) => (
            <Text key={line} style={styles.outcome}>
              • {line}
            </Text>
          ))}
          <Text style={styles.trackLabel}>Progression rules</Text>
          {plan.progressionRules.map((line) => (
            <Text key={line} style={styles.outcome}>
              • {line}
            </Text>
          ))}
          <Text style={styles.trackLabel}>Target-location form guides</Text>
          {plan.anchorExercises.map((exerciseName) => (
            <ExerciseGraphic
              key={`${plan.id}-${exerciseName}`}
              exerciseName={exerciseName}
              compact
            />
          ))}
          <AppButton
            label="Open linked program"
            variant="action"
            onPress={() =>
              router.push({
                pathname: '/program/[id]',
                params: { id: plan.linkedProgramId },
              })
            }
          />
        </Card>
      ))}
    </Screen>
  );
}
