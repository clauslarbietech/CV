import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { BodyVisionSetup } from '@/components/body/BodyVisionSetup';
import { ProgramMonthGrid } from '@/components/workout/ProgramMonthGrid';
import { ProgramStartSteps } from '@/components/workout/ProgramStartSteps';
import { difficultyLabel } from '@/constants/displayLabels';
import { getProgramById } from '@/constants/programs';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useTheme, radii, spacing, typography } from '@/theme';
import { DifficultyTier } from '@/types';

const HERO_BY_ID: Record<string, number> = {
  'operation-iron-30': require('../../assets/exercises/burpee.png'),
  'operation-iron-14': require('../../assets/exercises/pushup.png'),
  'operation-long-train': require('../../assets/exercises/squat.png'),
  'operation-calisthenics': require('../../assets/exercises/pike.png'),
};

export default function ProgramDetailScreen() {
  const { colors, isDay } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        hero: {
          height: 220,
          borderRadius: radii.xl,
          overflow: 'hidden',
          marginBottom: spacing.sm,
          borderWidth: 1,
          borderColor: colors.border,
        },
        heroImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        playBadge: {
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'rgba(255,255,255,0.92)',
          alignItems: 'center',
          justifyContent: 'center',
        },
        playTriangle: {
          width: 0,
          height: 0,
          marginLeft: 4,
          borderTopWidth: 12,
          borderBottomWidth: 12,
          borderLeftWidth: 18,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: colors.action,
        },
        kicker: { ...typography.overline, color: colors.actionText },
        title: { ...typography.hero, color: colors.textPrimary, fontSize: 28 },
        body: { ...typography.body, color: colors.textSecondary },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.md,
        },
        startOver: {
          minHeight: 52,
          borderRadius: radii.md,
          backgroundColor: colors.action,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.sm,
        },
        startOverText: {
          ...typography.bodyBold,
          color: colors.onAction,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        tiers: { flexDirection: 'row', gap: spacing.xs },
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
          borderColor: colors.action,
          backgroundColor: colors.action,
        },
        tierText: { ...typography.caption, color: colors.textSecondary },
        tierTextActive: { color: colors.onAction, fontWeight: '800' },
        metaRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
        },
        meta: {
          ...typography.caption,
          color: colors.textSecondary,
          backgroundColor: isDay ? colors.backgroundElevated : colors.surface,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs,
          borderRadius: radii.sm,
        },
      }),
    [colors, isDay],
  );

  const { id } = useLocalSearchParams<{ id: string }>();
  const program = getProgramById(id);
  const enrollment = useProgramStore((s) => s.enrollment);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);
  const startOver = useProgramStore((s) => s.startOver);
  const setDifficulty = useProgramStore((s) => s.setDifficulty);
  const bodyVision = useProfileStore((s) => s.profile?.bodyVision);

  if (!program) {
    return (
      <Screen>
        <EmptyState
          title="Program not found"
          description="This program is not available yet."
          actionLabel="Back to My Stuff"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const hasDays = program.days.length > 0;
  const tier = enrollment?.difficulty ?? 'recruit';
  const isEnrolled = enrollment?.programId === program.id;
  const currentDay = isEnrolled ? enrollment?.currentDay ?? 1 : undefined;
  const heroSource =
    HERO_BY_ID[program.id] ?? require('../../assets/exercises/generic.png');

  const openDay = (day: number) => {
    if (!isEnrolled) enrollInProgram(program.id, tier);
    router.push({
      pathname: '/session/[programId]',
      params: { programId: program.id, day: String(day) },
    });
  };

  const playToday = () => {
    const day = isEnrolled
      ? useProgramStore.getState().enrollment?.currentDay ?? 1
      : 1;
    if (!isEnrolled) enrollInProgram(program.id, tier);
    openDay(day);
  };

  const visionReady =
    bodyVision?.currentFrame &&
    bodyVision?.goalFrame &&
    bodyVision.linkedProgramId === program.id;

  return (
    <Screen>
      <View style={styles.hero}>
        <Pressable onPress={playToday} style={{ flex: 1 }}>
          <ImageBackground
            source={heroSource}
            style={styles.heroImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={[
                'rgba(0,0,0,0.2)',
                'rgba(0,0,0,0.45)',
                'rgba(0,0,0,0.7)',
              ]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.playBadge}>
              <View style={styles.playTriangle} />
            </View>
          </ImageBackground>
        </Pressable>
      </View>

      <Text style={styles.kicker}>
        {program.featured ? 'FEATURED PROGRAM' : 'YOUR PROGRAM'}
      </Text>
      <Text style={styles.title}>{program.name}</Text>
      <Text style={styles.body}>
        Welcome. Follow the workout calendar in order — short blocks or the full
        long train. Complete the setup steps below, then start your plan.
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{program.durationDays} days</Text>
        <Text style={styles.meta}>{program.equipment}</Text>
        <Text style={styles.meta}>{program.averageWorkout}</Text>
      </View>

      <Text style={styles.section}>Get set up</Text>
      <ProgramStartSteps
        steps={[
          {
            number: 1,
            title: 'Invite a buddy',
            actions: [
              {
                id: 'squad',
                label: 'Notes → Buddies',
                icon: 'people',
                onPress: () => router.push('/(tabs)/coach'),
              },
              {
                id: 'audio',
                label: 'Notes · chat & day log',
                icon: 'chatbubble-ellipses',
                onPress: () => router.push('/(tabs)/notes'),
              },
            ],
          },
          {
            number: 2,
            title:
              program.durationDays >= 60
                ? 'Long-train meal plan'
                : program.durationDays <= 14
                  ? 'Short-block meal plan'
                  : 'Everyday 16:8 meal plan',
            actions: [
              {
                id: 'diet',
                label:
                  program.durationDays >= 60
                    ? 'Open long-train nutrition'
                    : program.durationDays <= 14
                      ? 'Open short-block nutrition'
                      : 'Create your meal plan',
                icon: 'restaurant',
                onPress: () => router.push('/(tabs)/nutrition'),
              },
            ],
          },
        ]}
      />

      <BodyVisionSetup
        programId={program.id}
        programName={program.name}
        showContinue={!isEnrolled}
        continueLabel={
          visionReady ? 'Update & enroll · Day 1' : 'Save vision & enroll · Day 1'
        }
        onSaved={() => {
          if (!isEnrolled) {
            enrollInProgram(program.id, tier);
            openDay(1);
          }
        }}
      />

      {hasDays ? (
        <>
          <Text style={styles.section}>Difficulty</Text>
          <View style={styles.tiers}>
            {(['recruit', 'soldier', 'elite'] as DifficultyTier[]).map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  if (!isEnrolled) enrollInProgram(program.id, item);
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
                  {difficultyLabel(item).toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <AppButton
            label={
              isEnrolled
                ? `Continue Day ${currentDay ?? 1}`
                : 'Enroll & start Day 1'
            }
            variant="action"
            onPress={playToday}
          />

          {isEnrolled ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Start over"
              onPress={() => startOver(program.id, tier)}
              style={styles.startOver}
            >
              <Text style={styles.startOverText}>Start over</Text>
            </Pressable>
          ) : null}

          <Text style={styles.section}>Workout calendar</Text>
          <ProgramMonthGrid
            totalDays={program.durationDays}
            daysPerMonth={program.durationDays >= 60 ? 28 : 30}
            completedDayIds={
              isEnrolled ? enrollment?.completedDayIds ?? [] : []
            }
            currentDay={currentDay}
            onSelectDay={openDay}
          />
        </>
      ) : (
        <EmptyState
          title="Coming soon"
          description="This program is listed but not fully implemented yet."
        />
      )}
    </Screen>
  );
}
