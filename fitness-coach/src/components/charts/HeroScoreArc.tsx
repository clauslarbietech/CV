import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, spacing } from '@/theme';

import { StatusLabel } from './StatusLabel';
import { MetricStatus, readinessWord } from './ringChartUtils';

type HeroScoreArcProps = {
  score: number;
  status: MetricStatus;
  startLabel: string;
  endLabel: string;
  progress: number;
};

export function HeroScoreArc({
  score,
  status,
  startLabel,
  endLabel,
  progress,
}: HeroScoreArcProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          alignItems: 'center',
          gap: spacing.xs,
          marginBottom: spacing.md,
        },
        score: {
          fontSize: 48,
          fontWeight: '800',
          color: colors.textPrimary,
          lineHeight: 52,
        },
        statusRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        arcRow: {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: spacing.sm,
        },
        arcLabel: {
          fontSize: 12,
          fontWeight: '700',
          color: colors.textSecondary,
          minWidth: 44,
        },
        arcCenter: {
          flex: 1,
          alignItems: 'center',
          marginHorizontal: spacing.xs,
        },
      }),
    [colors],
  );

  const width = 220;
  const height = 56;
  const stroke = 10;
  const r = (width - stroke) / 2;
  const cx = width / 2;
  const cy = height;
  const clamped = Math.max(0, Math.min(1, progress));
  const startX = stroke / 2;
  const endX = width - stroke / 2;
  const arcPath = `M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}`;
  const circumference = Math.PI * r;
  const dashOffset = circumference * (1 - clamped);

  return (
    <View style={styles.wrap}>
      <Text style={styles.score}>{score}</Text>
      <View style={styles.statusRow}>
        <StatusLabel status={status} label={readinessWord(score)} />
        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      </View>

      <View style={styles.arcRow}>
        <View style={{ alignItems: 'center', gap: 2 }}>
          <Ionicons name="flag-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.arcLabel}>{startLabel}</Text>
        </View>

        <View style={styles.arcCenter}>
          <Svg width={width} height={height + 4}>
            <Path
              d={arcPath}
              stroke={colors.borderSubtle}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={arcPath}
              stroke={colors.steps}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
            />
            <Circle
              cx={startX + (endX - startX) * clamped}
              cy={cy - Math.sin(Math.PI * clamped) * r}
              r={6}
              fill={colors.steps}
            />
          </Svg>
        </View>

        <View style={{ alignItems: 'center', gap: 2 }}>
          <Ionicons name="trophy-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.arcLabel}>{endLabel}</Text>
        </View>
      </View>
    </View>
  );
}
