import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme, radii, spacing, typography } from '@/theme';

type MonthBlock = {
  label: string;
  startDay: number;
  endDay: number;
};

interface ProgramMonthGridProps {
  totalDays: number;
  /** Days per month block (V Shred-style uses 28) */
  daysPerMonth?: number;
  completedDayIds: number[];
  currentDay?: number;
  onSelectDay: (day: number) => void;
}

function buildMonths(totalDays: number, daysPerMonth: number): MonthBlock[] {
  const months: MonthBlock[] = [];
  let start = 1;
  let index = 1;
  while (start <= totalDays) {
    const end = Math.min(start + daysPerMonth - 1, totalDays);
    months.push({ label: `Month ${index}`, startDay: start, endDay: end });
    start = end + 1;
    index += 1;
  }
  return months;
}

export function ProgramMonthGrid({
  totalDays,
  daysPerMonth = 28,
  completedDayIds,
  currentDay,
  onSelectDay,
}: ProgramMonthGridProps) {
  const { colors, isDay } = useTheme();
  const months = useMemo(
    () => buildMonths(totalDays, daysPerMonth),
    [totalDays, daysPerMonth],
  );
  const completed = useMemo(() => new Set(completedDayIds), [completedDayIds]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { gap: spacing.lg },
        month: { gap: spacing.sm },
        monthLabel: {
          ...typography.heading,
          color: colors.textPrimary,
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          overflow: 'hidden',
          backgroundColor: colors.surface,
        },
        cell: {
          width: '14.2857%',
          aspectRatio: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRightWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          backgroundColor: isDay ? colors.white : colors.surface,
        },
        cellDone: {
          backgroundColor: colors.accentSoft,
        },
        cellCurrent: {
          backgroundColor: colors.actionSoft,
          borderWidth: 1.5,
          borderColor: colors.action,
        },
        dayNum: {
          ...typography.bodyBold,
          color: colors.textPrimary,
          fontSize: 15,
        },
        dayDone: {
          color: colors.militaryAccent,
        },
        dayCurrent: {
          color: colors.actionText,
        },
      }),
    [colors, isDay],
  );

  return (
    <View style={styles.wrap}>
      {months.map((month) => {
        const days: number[] = [];
        for (let d = month.startDay; d <= month.endDay; d += 1) days.push(d);
        return (
          <View key={month.label} style={styles.month}>
            <Text style={styles.monthLabel}>{month.label}</Text>
            <View style={styles.grid}>
              {days.map((day) => {
                const done = completed.has(day);
                const current = currentDay === day;
                return (
                  <Pressable
                    key={day}
                    accessibilityRole="button"
                    accessibilityLabel={`Day ${day}${done ? ', complete' : ''}`}
                    onPress={() => onSelectDay(day)}
                    style={[
                      styles.cell,
                      done && styles.cellDone,
                      current && styles.cellCurrent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNum,
                        done && styles.dayDone,
                        current && styles.dayCurrent,
                      ]}
                    >
                      {day - month.startDay + 1}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}
