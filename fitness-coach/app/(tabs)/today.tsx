import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DailyMissionCard } from '@/components/today/DailyMissionCard';
import { ExpressTimeCard } from '@/components/today/ExpressTimeCard';
import { RemindersPanel } from '@/components/today/RemindersPanel';
import { AppButton } from '@/components/ui/AppButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { Screen } from '@/components/ui/Screen';
import { HeroProgramCard } from '@/components/workout/HeroProgramCard';
import { ExpressBudget } from '@/constants/programs/expressMissions';
import {
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
        helpChip: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 999,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs,
          backgroundColor: colors.surface,
        },
        helpText: {
          ...typography.caption,
          color: colors.textPrimary,
          fontWeight: '700',
        },
        title: {
          ...typography.title,
          color: colors.textPrimary,
          letterSpacing: 1,
          textTransform: 'uppercase',
          textAlign: 'center',
          flex: 1,
        },
        iconBtn: { padding: spacing.xxs },
        greeting: {
          ...typography.caption,
          color: colors.textMuted,
        },
        name: {
          ...typography.heading,
          color: colors.textPrimary,
        },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.sm,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
        },
        progressLine: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: spacing.xs,
        },
        metrics: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
        },
        catalog: { gap: spacing.md },
      }),
    [colors],
  );

  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const streaks = useProgramStore((s) => s.streaks);
  const sessions = useProgramStore((s) => s.sessions);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);
  const active = useSessionStore((s) => s.active);
  const meds = useNotesStore((s) => s.meds);
  const isMedTakenToday = useNotesStore((s) => s.isMedTakenToday);

  const openProgram = (programId: string) => {
    router.push({ pathname: '/program/[id]', params: { id: programId } });
  };

  const playProgram = (programId: string) => {
    const current = useProgramStore.getState().enrollment;
    if (!current || current.programId !== programId) {
      enrollInProgram(programId, 'soldier');
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
  ].filter((p) => WORKOUT_PROGRAMS.some((w) => w.id === p.id));

  if (!enrollment) {
    return (
      <Screen>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.helpChip}
            onPress={() => router.push('/(tabs)/coach')}
          >
            <Text style={styles.helpText}>NEED HELP?</Text>
          </Pressable>
          <Text style={styles.title}>My Stuff</Text>
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.push('/profile')}
            accessibilityLabel="Settings"
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        <Text style={styles.greeting}>
          Welcome{profile?.firstName ? `, ${profile.firstName}` : ''}
        </Text>
        <Text style={styles.name}>Pick your transformation</Text>
        <Text style={styles.body}>
          Short, 30-day, or 12-week long train — same military bodyweight system.
          Tap a card to open the calendar, diet steps, and squad link.
        </Text>

        <View style={styles.catalog}>
          {catalog.map((program) => (
            <HeroProgramCard
              key={program.id}
              program={program}
              locationLabel={
                program.durationDays >= 60
                  ? '12-week long train · Home'
                  : program.durationDays <= 14
                    ? 'Short block · Home'
                    : '30-day shred · Home'
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

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.helpChip}
          onPress={() => router.push('/(tabs)/coach')}
        >
          <Text style={styles.helpText}>NEED HELP?</Text>
        </Pressable>
        <Text style={styles.title}>My Stuff</Text>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push('/profile')}
          accessibilityLabel="Settings"
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <Text style={styles.greeting}>
        {profile?.firstName ?? 'Athlete'} · {profile?.rank ?? 'Recruit'}
      </Text>
      <Text style={styles.name}>Your active program</Text>

      <HeroProgramCard
        program={program}
        enrolled
        currentDay={enrollment.currentDay}
        locationLabel="Home · No equipment"
        onGetStarted={() => openProgram(program.id)}
        onPlay={() => startMission()}
      />

      <Text style={styles.progressLine}>
        Day {enrollment.currentDay} of {program.durationDays} · Streak{' '}
        {streaks.workoutStreak} · Sessions {sessions.length}
      </Text>

      {active ? (
        <AppButton
          label="Resume active mission"
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

      {dayPlan ? (
        <DailyMissionCard
          program={program}
          day={dayPlan}
          tier={enrollment.difficulty}
          onStart={() => startMission()}
        />
      ) : null}

      <ExpressTimeCard onSelect={(mins) => startMission(mins)} />

      <Text style={styles.section}>All programs</Text>
      <View style={styles.catalog}>
        {catalog.map((item) => (
          <HeroProgramCard
            key={item.id}
            program={item}
            enrolled={enrollment.programId === item.id}
            currentDay={
              enrollment.programId === item.id
                ? enrollment.currentDay
                : undefined
            }
            locationLabel={
              item.durationDays >= 60
                ? '12-week long train · Home'
                : item.durationDays <= 14
                  ? 'Short block · Home'
                  : '30-day shred · Home'
            }
            onGetStarted={() => openProgram(item.id)}
            onPlay={() => playProgram(item.id)}
          />
        ))}
      </View>

      <Text style={styles.section}>Today snapshot</Text>
      <View style={styles.metrics}>
        <MetricCard label="Streak" value={`${streaks.workoutStreak}d`} />
        <MetricCard label="Meds" value={`${medsDone}/${meds.length}`} />
        <MetricCard
          label="XP"
          value={`${profile?.xp ?? 0}`}
          accentColor={colors.accentText}
        />
      </View>

      <RemindersPanel />
    </Screen>
  );
}
