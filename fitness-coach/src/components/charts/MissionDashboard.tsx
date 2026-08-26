import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { DailyProgress } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

import { ComparisonBars } from './ComparisonBars';
import { DistributionBar } from './DistributionBar';
import { HeroScoreArc } from './HeroScoreArc';
import { SegmentToggle } from './SegmentToggle';
import { StatusLabel } from './StatusLabel';
import { VitalTile } from './VitalTile';
import {
  energyToScore,
  routeForEnergy,
} from '@/constants/programs/energyRoutes';
import {
  averageProgress,
  formatDuration,
  formatMl,
  ratioStatus,
  readinessLabel,
  readinessScore,
} from './ringChartUtils';

type DashboardView = 'mission' | 'fuel' | 'consistency';

export type MissionDashboardProps = {
  programLabel: string;
  programProgress: number;
  currentDay: number;
  totalDays: number;
  streakDays: number;
  longestStreak: number;
  medsDone: number;
  medsTotal: number;
  sessionsCount: number;
  totalMinutes: number;
  daily: DailyProgress;
  completedDays: number;
  compact?: boolean;
};

export function MissionDashboard({
  programLabel,
  programProgress,
  currentDay,
  totalDays,
  streakDays,
  longestStreak,
  medsDone,
  medsTotal,
  sessionsCount,
  totalMinutes,
  daily,
  completedDays,
  compact = false,
}: MissionDashboardProps) {
  const { colors } = useTheme();
  const [view, setView] = useState<DashboardView>('mission');

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
        insight: {
          backgroundColor: colors.surfaceHover,
          borderRadius: 12,
          padding: spacing.md,
          gap: spacing.xs,
          marginBottom: spacing.md,
        },
        insightTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        insightLine: {
          ...typography.caption,
          color: colors.warning,
          fontWeight: '700',
        },
        insightBody: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        metricRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: spacing.xs,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderSubtle,
        },
        metricLabel: {
          ...typography.body,
          color: colors.textSecondary,
          fontWeight: '700',
        },
        metricValue: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        grid2: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        gridCell: {
          flex: 1,
          backgroundColor: colors.surfaceHover,
          borderRadius: 12,
          padding: spacing.md,
          gap: 4,
        },
        bars: { gap: spacing.md, marginTop: spacing.sm },
        vitals: {
          flexDirection: 'row',
          gap: spacing.xxs,
          marginTop: spacing.sm,
        },
        legend: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.xs,
        },
        footerNote: {
          ...typography.caption,
          color: colors.textSecondary,
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  const proteinRatio = daily.proteinTarget > 0 ? daily.proteinG / daily.proteinTarget : 0;
  const waterRatio = daily.waterTarget > 0 ? daily.waterMl / daily.waterTarget : 0;
  const stepsRatio = daily.stepsTarget > 0 ? daily.steps / daily.stepsTarget : 0;
  const calorieRatio =
    daily.calorieTarget > 0 ? daily.calories / daily.calorieTarget : 0;
  const medsProgress = medsTotal > 0 ? medsDone / medsTotal : 1;

  const fuelProgress = averageProgress([proteinRatio, waterRatio, stepsRatio, calorieRatio]);
  const autoScore = readinessScore({
    programProgress,
    workoutDone: daily.workoutCompleted,
    medsProgress,
    fuelProgress,
    streakDays,
  });
  const energyLevel = daily.energyLevel ?? null;
  const score =
    energyLevel != null ? energyToScore(energyLevel) : autoScore;
  const scoreStatus =
    energyLevel != null
      ? routeForEnergy(energyLevel).status
      : readinessLabel(score);

  const improvable: string[] = [];
  if (ratioStatus(daily.proteinG, daily.proteinTarget) === 'low') {
    improvable.push(`Protein ${daily.proteinG}g / ${daily.proteinTarget}g`);
  }
  if (ratioStatus(daily.waterMl, daily.waterTarget) === 'low') {
    improvable.push(`Water ${formatMl(daily.waterMl)} / ${formatMl(daily.waterTarget)}`);
  }
  if (!daily.workoutCompleted) {
    improvable.push('Mission not logged today');
  }
  if (medsTotal > 0 && medsDone < medsTotal) {
    improvable.push(`Meds ${medsDone}/${medsTotal}`);
  }

  const missionStatus =
    programProgress >= 0.85 ? 'good' : programProgress >= 0.5 ? 'normal' : 'low';

  return (
    <Card accentBorder>
      <Text style={styles.title}>Mission readiness</Text>
      <Text style={styles.subtitle}>{programLabel}</Text>

      <HeroScoreArc
        score={score}
        status={scoreStatus}
        startLabel={`D1`}
        endLabel={`D${totalDays}`}
        progress={programProgress}
      />

      {!compact && improvable.length > 0 ? (
        <View style={styles.insight}>
          <Text style={styles.insightTitle}>Stay balanced</Text>
          <Text style={styles.insightLine}>
            Improvable: {improvable.slice(0, 2).join(' · ')}
          </Text>
          <Text style={styles.insightBody}>
            Small wins on fuel and meds keep streak momentum without extra scrolling.
          </Text>
        </View>
      ) : null}

      <SegmentToggle
        options={[
          { id: 'mission', label: 'Mission' },
          { id: 'fuel', label: 'Fuel' },
          { id: 'consistency', label: 'Streak' },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'mission' ? (
        <View style={{ marginTop: spacing.md }}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Missions complete</Text>
            <View style={{ alignItems: 'flex-end', gap: 2 }}>
              <Text style={styles.metricValue}>
                {completedDays} / {totalDays}
              </Text>
              <StatusLabel status={missionStatus} />
            </View>
          </View>

          <View style={styles.grid2}>
            <View style={styles.gridCell}>
              <Text style={styles.metricLabel}>Current day</Text>
              <Text style={styles.metricValue}>Day {currentDay}</Text>
              <StatusLabel
                status={daily.workoutCompleted ? 'good' : 'low'}
                label={daily.workoutCompleted ? 'Logged' : 'Pending'}
              />
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.metricLabel}>Training time</Text>
              <Text style={styles.metricValue}>{formatDuration(totalMinutes)}</Text>
              <StatusLabel
                status={totalMinutes >= 20 ? 'good' : totalMinutes >= 10 ? 'normal' : 'low'}
              />
            </View>
          </View>

          <View style={styles.vitals}>
            <VitalTile
              icon="barbell-outline"
              value={`${sessionsCount}`}
              unit="sessions"
              status={sessionsCount >= 4 ? 'good' : 'normal'}
            />
            <VitalTile
              icon="checkmark-circle-outline"
              value={`${Math.round(programProgress * 100)}`}
              unit="% done"
              status={missionStatus}
            />
            <VitalTile
              icon="medkit-outline"
              value={`${medsDone}/${medsTotal || 0}`}
              unit="meds"
              status={medsTotal === 0 || medsDone === medsTotal ? 'good' : 'low'}
            />
            <VitalTile
              icon="flash-outline"
              value={`${streakDays}`}
              unit="streak"
              status={streakDays >= 7 ? 'good' : streakDays >= 3 ? 'normal' : 'low'}
            />
            <VitalTile
              icon="time-outline"
              value={`${totalMinutes}`}
              unit="min"
              status={totalMinutes >= 30 ? 'good' : 'normal'}
            />
          </View>
        </View>
      ) : null}

      {view === 'fuel' ? (
        <View style={styles.bars}>
          <DistributionBar
            label="Protein"
            valueLabel={`${daily.proteinG}g / ${daily.proteinTarget}g`}
            percent={proteinRatio * 100}
            fillColor={colors.protein}
            optimalMin={75}
            optimalMax={100}
          />
          <DistributionBar
            label="Water"
            valueLabel={`${formatMl(daily.waterMl)} / ${formatMl(daily.waterTarget)}`}
            percent={waterRatio * 100}
            fillColor={colors.water}
            optimalMin={65}
            optimalMax={100}
          />
          <DistributionBar
            label="Steps"
            valueLabel={`${daily.steps.toLocaleString()} / ${daily.stepsTarget.toLocaleString()}`}
            percent={stepsRatio * 100}
            fillColor={colors.steps}
            optimalMin={70}
            optimalMax={100}
          />
          <DistributionBar
            label="Calories"
            valueLabel={`${daily.calories} / ${daily.calorieTarget}`}
            percent={calorieRatio * 100}
            fillColor={colors.carbs}
            optimalMin={85}
            optimalMax={105}
          />
          <Text style={styles.legend}>
            Shaded band = optimal range · {improvable.length ? 'Fuel still has room to improve.' : 'Fuel on track today.'}
          </Text>
        </View>
      ) : null}

      {view === 'consistency' ? (
        <View style={{ marginTop: spacing.md }}>
          <ComparisonBars
            title="Workout streak"
            items={[
              {
                label: 'Current',
                value: streakDays,
                status: streakDays >= 7 ? 'good' : streakDays >= 3 ? 'normal' : 'low',
              },
              {
                label: 'Longest',
                value: longestStreak,
                status: longestStreak >= 7 ? 'good' : 'normal',
              },
            ]}
          />
          <Text style={styles.footerNote}>
            {sessionsCount} sessions logged · {formatDuration(totalMinutes)} total training
          </Text>
        </View>
      ) : null}
    </Card>
  );
}
