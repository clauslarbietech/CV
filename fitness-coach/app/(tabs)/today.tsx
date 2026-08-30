import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DailyMissionCard } from '@/components/today/DailyMissionCard';
import { EnergyRouteCard } from '@/components/today/EnergyRouteCard';
import { ExpressTimeCard } from '@/components/today/ExpressTimeCard';
import { HomeStatsGraphs } from '@/components/today/HomeStatsGraphs';
import { PersonaPlanCard } from '@/components/today/PersonaPlanCard';
import { ProgramSwitcher } from '@/components/today/ProgramSwitcher';
import { MotivationalCoachCard } from '@/components/today/MotivationalCoachCard';
import { personalityLabel } from '@/constants/coach/voiceCoach';
import { WeightGoalsCard } from '@/components/today/WeightGoalsCard';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { HeroProgramCard } from '@/components/workout/HeroProgramCard';
import { EnergyLevel, EnergyRoute } from '@/constants/programs/energyRoutes';
import { ExpressBudget } from '@/constants/programs/expressMissions';
import { displayRank } from '@/constants/displayLabels';
import {
  OPERATION_CALISTHENICS,
  OPERATION_IRON_14,
  OPERATION_IRON_30,
  OPERATION_LONG_TRAIN,
  getActiveProgram,
  WORKOUT_PROGRAMS,
} from '@/constants/programs';
import { useNotesStore } from '@/store/notesStore';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useSessionStore } from '@/store/sessionStore';
import { getProgramDay } from '@/utils/workout';
import { useTheme, spacing, typography } from '@/theme';

export default function MyStuffScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        title: {
          ...typography.title,
          color: colors.textPrimary,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        greeting: {
          ...typography.caption,
          color: colors.textMuted,
        },
        name: {
          ...typography.heading,
          color: colors.textPrimary,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
        },
        catalog: { gap: spacing.md },
        quickRow: {
          flexDirection: 'row',
          gap: spacing.sm,
          flexWrap: 'wrap',
        },
        quickChip: {
          flexGrow: 1,
          minWidth: '45%',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: spacing.md,
          backgroundColor: colors.surface,
          gap: 4,
        },
        quickLabel: {
          ...typography.caption,
          color: colors.textMuted,
          fontWeight: '700',
        },
        quickValue: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
      }),
    [colors],
  );

  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const streaks = useProgramStore((s) => s.streaks);
  const sessions = useProgramStore((s) => s.sessions);
  const daily = useProgramStore((s) => s.daily);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);
  const setDifficulty = useProgramStore((s) => s.setDifficulty);
  const updateDailyMetrics = useProgramStore((s) => s.updateDailyMetrics);
  const active = useSessionStore((s) => s.active);
  const meds = useNotesStore((s) => s.meds);
  const isMedTakenToday = useNotesStore((s) => s.isMedTakenToday);

  const openProgram = (programId: string) => {
    router.push({ pathname: '/program/[id]', params: { id: programId } });
  };

  const playProgram = (programId: string) => {
    const current = useProgramStore.getState().enrollment;
    if (!current || current.programId !== programId) {
      enrollInProgram(programId, 'recruit');
    }
    const day = useProgramStore.getState().enrollment?.currentDay ?? 1;
    router.push({
      pathname: '/session/[programId]',
      params: { programId, day: String(day) },
    });
  };

  const catalog = [
    OPERATION_LONG_TRAIN,
    OPERATION_IRON_30,
    OPERATION_IRON_14,
    OPERATION_CALISTHENICS,
  ].filter((p) => WORKOUT_PROGRAMS.some((w) => w.id === p.id));

  if (!enrollment) {
    return (
      <Screen>
        <Text style={styles.greeting}>
          Welcome{profile?.firstName ? `, ${profile.firstName}` : ''}
        </Text>
        <Text style={styles.name}>Pick your transformation</Text>
        <Text style={styles.body}>
          Choose a track to start. Meds and chat are in Notes.
        </Text>

        <WeightGoalsCard programId={OPERATION_IRON_30.id} />

        <View style={styles.catalog}>
          {catalog.map((program) => (
            <HeroProgramCard
              key={program.id}
              program={program}
              locationLabel={
                program.id === 'operation-calisthenics'
                  ? '21-day skill block · Home'
                  : program.durationDays >= 60
                    ? '12-week long train · Home'
                    : program.durationDays <= 14
                      ? 'Short block · Home'
                      : '30-day home plan · Home'
              }
              onGetStarted={() => openProgram(program.id)}
              onPlay={() => playProgram(program.id)}
            />
          ))}
        </View>
      </Screen>
    );
  }

  const program = getActiveProgram(enrollment.programId);
  const dayPlan = getProgramDay(program, enrollment.currentDay);
  const medsDone = meds.filter((m) => isMedTakenToday(m.id)).length;
  const totalMinutes = Math.round(
    sessions.reduce((sum, s) => sum + (s.durationSec ?? 0), 0) / 60,
  );
  const programProgress =
    program.durationDays > 0
      ? (enrollment.completedDayIds.length || Math.max(0, enrollment.currentDay - 1)) /
        program.durationDays
      : 0;

  const startMission = (express?: ExpressBudget) => {
    router.push({
      pathname: '/session/[programId]',
      params: {
        programId: program.id,
        day: String(enrollment.currentDay),
        ...(express ? { express: String(express) } : {}),
      },
    });
  };

  const onEnergyChange = (level: EnergyLevel) => {
    updateDailyMetrics({ energyLevel: level });
  };

  const onStartEnergyRoute = (route: EnergyRoute) => {
    setDifficulty(route.difficulty);
    startMission(route.expressMinutes);
  };

  const switchProgram = (programId: string) => {
    enrollInProgram(programId, 'recruit');
    router.push({ pathname: '/program/[id]', params: { id: programId } });
  };

  return (
    <Screen>
      <Text style={styles.greeting}>
        {profile?.firstName ?? 'Hey there'} · {displayRank(profile?.rank)}
      </Text>
      <Text style={styles.name}>Today&apos;s workout</Text>

      <PersonaPlanCard onOpenProgram={openProgram} />

      <WeightGoalsCard programId={program.id} />

      <HeroProgramCard
        program={program}
        enrolled
        currentDay={enrollment.currentDay}
        locationLabel="Home · No equipment"
        onGetStarted={() => openProgram(program.id)}
        onPlay={() => startMission()}
      />

      {active ? (
        <AppButton
          label="Resume active workout"
          variant="action"
          onPress={() =>
            router.push({
              pathname: '/session/[programId]',
              params: {
                programId: active.programId,
                day: String(active.day),
              },
            })
          }
        />
      ) : null}

      <EnergyRouteCard
        value={(daily.energyLevel as EnergyLevel | null | undefined) ?? null}
        onChange={onEnergyChange}
        onStartRoute={onStartEnergyRoute}
      />

      <HomeStatsGraphs
        programProgress={programProgress}
        programLabel={`${program.name} · Day ${enrollment.currentDay}/${program.durationDays}`}
        currentDay={enrollment.currentDay}
        totalDays={program.durationDays}
        streakDays={streaks.workoutStreak}
        longestStreak={streaks.longestWorkoutStreak}
        medsDone={medsDone}
        medsTotal={meds.length}
        sessionsCount={sessions.length}
        totalMinutes={totalMinutes}
        daily={daily}
        completedDays={enrollment.completedDayIds.length}
      />

      <MotivationalCoachCard
        personality={profile?.coachPersonality ?? 'calm_coach'}
        personalityLabel={personalityLabel(
          profile?.coachPersonality ?? 'calm_coach',
        )}
        firstName={profile?.firstName}
        programName={program.name}
        day={enrollment.currentDay}
      />

      {dayPlan ? (
        <DailyMissionCard
          program={program}
          day={dayPlan}
          tier={enrollment.difficulty}
          onStart={() => startMission()}
        />
      ) : null}

      <ExpressTimeCard onSelect={(mins) => startMission(mins)} />

      <ProgramSwitcher
        activeProgramId={program.id}
        currentDay={enrollment.currentDay}
        onOpen={openProgram}
        onSwitch={switchProgram}
      />

      <View style={styles.quickRow}>
        <Pressable
          style={styles.quickChip}
          onPress={() => router.push('/(tabs)/notes')}
        >
          <Text style={styles.quickLabel}>MEDS</Text>
          <Text style={styles.quickValue}>
            {medsDone}/{meds.length} today
          </Text>
        </Pressable>
        <Pressable
          style={styles.quickChip}
          onPress={() => router.push('/(tabs)/notes')}
        >
          <Text style={styles.quickLabel}>NOTES</Text>
          <Text style={styles.quickValue}>Chat · log</Text>
        </Pressable>
        <Pressable
          style={styles.quickChip}
          onPress={() => router.push('/(tabs)/workouts')}
        >
          <Text style={styles.quickLabel}>DISCOVER</Text>
          <Text style={styles.quickValue}>All programs</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
