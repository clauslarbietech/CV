import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { HeroProgramCard } from '@/components/workout/HeroProgramCard';
import {
  OPERATION_CALISTHENICS,
  OPERATION_IRON_14,
  OPERATION_IRON_30,
  OPERATION_LONG_TRAIN,
  WORKOUT_PROGRAMS,
} from '@/constants/programs';
import { WorkoutProgram } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

type ProgramSwitcherProps = {
  activeProgramId: string;
  currentDay?: number;
  onOpen: (programId: string) => void;
  onSwitch: (programId: string) => void;
};

const CATALOG = [
  OPERATION_LONG_TRAIN,
  OPERATION_IRON_30,
  OPERATION_IRON_14,
  OPERATION_CALISTHENICS,
].filter((p) => WORKOUT_PROGRAMS.some((w) => w.id === p.id));

export function ProgramSwitcher({
  activeProgramId,
  currentDay,
  onOpen,
  onSwitch,
}: ProgramSwitcherProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.actionText },
        title: {
          ...typography.heading,
          color: colors.textPrimary,
          marginBottom: spacing.xs,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.md,
        },
        list: { gap: spacing.md },
        activeTag: {
          ...typography.caption,
          color: colors.accentText,
          fontWeight: '800',
          marginBottom: spacing.xs,
        },
      }),
    [colors],
  );

  return (
    <View>
      <Text style={styles.kicker}>PROGRAMS</Text>
      <Text style={styles.title}>Choose another plan</Text>
      <Text style={styles.body}>Switch plans anytime.</Text>
      <View style={styles.list}>
        {CATALOG.map((program: WorkoutProgram) => {
          const active = program.id === activeProgramId;
          return (
            <View key={program.id}>
              {active ? (
                <Text style={styles.activeTag}>ACTIVE · Day {currentDay ?? 1}</Text>
              ) : null}
              <HeroProgramCard
                program={program}
                enrolled={active}
                currentDay={active ? currentDay : undefined}
                locationLabel={
                  program.id === 'operation-calisthenics'
                    ? '21-day skill block · Home'
                    : program.durationDays >= 60
                      ? '12-week long train · Home'
                      : program.durationDays <= 14
                        ? 'Short block · Home'
                        : '30-day home plan · Home'
                }
                onGetStarted={() => onOpen(program.id)}
                onPlay={() => (active ? onOpen(program.id) : onSwitch(program.id))}
              />
              {!active ? (
                <AppButton
                  label={`Switch to ${program.name}`}
                  variant="secondary"
                  onPress={() => onSwitch(program.id)}
                  style={{ marginTop: spacing.sm }}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
