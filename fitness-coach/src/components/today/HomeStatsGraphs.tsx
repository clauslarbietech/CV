import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Card } from '@/components/ui/Card';
import { useTheme, spacing, typography } from '@/theme';

type RingProps = {
  valueLabel: string;
  progress: number;
  color: string;
  track: string;
  textColor: string;
};

function ProgressRing({
  valueLabel,
  progress,
  color,
  track,
  textColor,
}: RingProps) {
  const size = 76;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = c * (1 - clamped);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={track}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text
        style={{
          position: 'absolute',
          fontWeight: '800',
          fontSize: 13,
          color: textColor,
        }}
      >
        {valueLabel}
      </Text>
    </View>
  );
}

type BarProps = {
  label: string;
  progress: number;
  color: string;
  track: string;
  textColor: string;
};

function ProgressBar({ label, progress, color, track, textColor }: BarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: textColor }}>
          {label}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color }}>{pct}%</Text>
      </View>
      <View
        style={{
          height: 12,
          borderRadius: 6,
          backgroundColor: track,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${Math.max(2, pct)}%`,
            height: 12,
            borderRadius: 6,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

export type HomeStatsGraphsProps = {
  programProgress: number;
  programLabel: string;
  streakDays: number;
  medsDone: number;
  medsTotal: number;
  sessionsCount: number;
};

/** Compact rings + bars for My Stuff — replaces long reminder/metric dumps. */
export function HomeStatsGraphs({
  programProgress,
  programLabel,
  streakDays,
  medsDone,
  medsTotal,
  sessionsCount,
}: HomeStatsGraphsProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          ...typography.heading,
          color: colors.textPrimary,
        },
        subtitle: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: spacing.sm,
        },
        rings: {
          flexDirection: 'row',
          gap: spacing.sm,
          marginBottom: spacing.md,
        },
        ringCol: {
          flex: 1,
          alignItems: 'center',
          gap: spacing.xs,
        },
        ringLabel: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '700',
          textAlign: 'center',
        },
        bars: { gap: spacing.md },
      }),
    [colors],
  );

  const medsProgress = medsTotal > 0 ? medsDone / medsTotal : 0;
  const streakProgress = Math.min(1, streakDays / 14);

  return (
    <Card accentBorder>
      <Text style={styles.title}>Today at a glance</Text>
      <Text style={styles.subtitle}>{programLabel}</Text>

      <View style={styles.rings}>
        <View style={styles.ringCol}>
          <ProgressRing
            valueLabel={`${Math.round(programProgress * 100)}%`}
            progress={programProgress}
            color={colors.action}
            track={colors.border}
            textColor={colors.textPrimary}
          />
          <Text style={styles.ringLabel}>Program</Text>
        </View>
        <View style={styles.ringCol}>
          <ProgressRing
            valueLabel={`${medsDone}/${medsTotal || 0}`}
            progress={medsProgress}
            color={colors.accentMuted}
            track={colors.border}
            textColor={colors.textPrimary}
          />
          <Text style={styles.ringLabel}>Meds</Text>
        </View>
        <View style={styles.ringCol}>
          <ProgressRing
            valueLabel={`${streakDays}d`}
            progress={streakProgress}
            color={colors.militaryAccent}
            track={colors.border}
            textColor={colors.textPrimary}
          />
          <Text style={styles.ringLabel}>Streak</Text>
        </View>
      </View>

      <View style={styles.bars}>
        <ProgressBar
          label="Mission completion"
          progress={programProgress}
          color={colors.action}
          track={colors.border}
          textColor={colors.textPrimary}
        />
        <ProgressBar
          label={`Sessions logged (${sessionsCount})`}
          progress={Math.min(1, sessionsCount / 30)}
          color={colors.accentMuted}
          track={colors.border}
          textColor={colors.textPrimary}
        />
      </View>
    </Card>
  );
}
