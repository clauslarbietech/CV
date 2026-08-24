import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme, radii, spacing } from '@/theme';

type DayCompletionStripProps = {
  totalDays: number;
  completedDayIds: number[];
  currentDay: number;
  maxVisible?: number;
};

/** Compact dot strip — replaces long "Day 1 · Day 2 · …" text blocks. */
export function DayCompletionStrip({
  totalDays,
  completedDayIds,
  currentDay,
  maxVisible = 28,
}: DayCompletionStripProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 4,
        },
        dot: {
          width: 10,
          height: 10,
          borderRadius: 5,
        },
      }),
    [],
  );

  const completed = new Set(completedDayIds);
  const days = Array.from({ length: Math.min(totalDays, maxVisible) }, (_, i) => i + 1);

  return (
    <View style={styles.row}>
      {days.map((day) => {
        const done = completed.has(day);
        const current = day === currentDay;
        const color = done
          ? colors.accentText
          : current
            ? colors.action
            : colors.borderSubtle;
        return (
          <View
            key={day}
            style={[
              styles.dot,
              {
                backgroundColor: color,
                borderWidth: current && !done ? 1 : 0,
                borderColor: colors.actionText,
              },
            ]}
            accessibilityLabel={`Day ${day}${done ? ', completed' : current ? ', current' : ''}`}
          />
        );
      })}
    </View>
  );
}
