import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { WorkoutShortsPreview } from '@/components/workout/WorkoutShortsPreview';
import { EmptyState } from '@/components/ui/EmptyState';
import { getProgramById } from '@/constants/programs';
import {
  ExpressBudget,
  SessionSlot,
  isExpressBudget,
} from '@/constants/programs/expressMissions';
import { useProgramStore } from '@/store/programStore';
import { getProgramDay } from '@/utils/workout';
import { useTheme, spacing, typography } from '@/theme';

function parseExpressBudget(value?: string): ExpressBudget | undefined {
  const n = Number(value);
  return isExpressBudget(n) ? n : undefined;
}

function parseSessionSlot(value?: string): SessionSlot {
  return value === 'evening' ? 'evening' : 'morning';
}

export default function WorkoutShortsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: '#061525',
        },
        topBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          zIndex: 4,
        },
        back: {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.12)',
        },
        title: {
          ...typography.caption,
          color: 'rgba(220,240,255,0.9)',
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
        body: { flex: 1, paddingHorizontal: spacing.sm, paddingBottom: spacing.sm },
      }),
    [colors],
  );

  const {
    programId,
    day: dayParam,
    express: expressParam,
    slot: slotParam,
  } = useLocalSearchParams<{
    programId: string;
    day?: string;
    express?: string;
    slot?: string;
  }>();

  const enrollment = useProgramStore((s) => s.enrollment);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);
  const program = getProgramById(programId);
  const dayNumber = Number(dayParam) || enrollment?.currentDay || 1;
  const day = program ? getProgramDay(program, dayNumber) : undefined;
  const tier = enrollment?.difficulty ?? 'recruit';
  const expressMinutes = parseExpressBudget(expressParam);
  const sessionSlot = parseSessionSlot(slotParam);

  if (!program || !day) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState
          title="Short not found"
          description="This workout Short is unavailable."
          actionLabel="Back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const startWorkout = () => {
    if (!enrollment || enrollment.programId !== program.id) {
      enrollInProgram(program.id, tier);
    }
    router.replace({
      pathname: '/session/[programId]',
      params: {
        programId: program.id,
        day: String(day.day),
        ...(expressMinutes
          ? { express: String(expressMinutes), slot: sessionSlot }
          : {}),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityLabel="Close Short"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Workout Short</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.body}>
        <WorkoutShortsPreview
          program={program}
          day={day}
          tier={tier}
          variant="fullscreen"
          slot={sessionSlot}
          minutes={expressMinutes}
          onStart={startWorkout}
        />
      </View>
    </SafeAreaView>
  );
}
