import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Screen } from '@/components/ui/Screen';
import { useProgramStore } from '@/store/programStore';
import { colors, spacing, typography } from '@/theme';

export default function NutritionScreen() {
  const daily = useProgramStore((s) => s.daily);
  const proteinPct = Math.min(
    100,
    Math.round((daily.proteinG / daily.proteinTarget) * 100),
  );
  const caloriePct = Math.min(
    100,
    Math.round((daily.calories / daily.calorieTarget) * 100),
  );
  const score = Math.round((proteinPct * 0.45 + (100 - Math.abs(100 - caloriePct)) * 0.35 + 40) / 1.2);

  return (
    <Screen>
      <Text style={styles.kicker}>DECIDE BEFORE YOU EAT</Text>
      <Text style={styles.title}>Nutrition</Text>
      <Text style={styles.subtitle}>
        Photo, voice, and AI goal-match scoring land in Phase 5. Targets and
        logging foundations are live now.
      </Text>

      <Card>
        <Text style={styles.scoreLabel}>NUTRITION SCORE</Text>
        <Text style={styles.score}>{Math.min(score, 100)} / 100</Text>
        <Text style={styles.scoreStatus}>
          {score >= 80 ? 'GREAT DAY' : score >= 60 ? 'ON TRACK' : 'NEEDS FOCUS'}
        </Text>
        <Text style={styles.tip}>
          You&apos;re {Math.max(0, daily.proteinTarget - daily.proteinG)}g from
          today&apos;s protein target. A protein-focused next meal would keep you
          on track.
        </Text>
      </Card>

      <View style={styles.metrics}>
        <MetricCard
          label="Protein"
          value={`${daily.proteinG}g`}
          subtitle={`Target ${daily.proteinTarget}g`}
          accentColor={colors.protein}
        />
        <MetricCard
          label="Calories"
          value={`${daily.calories}`}
          subtitle={`Target ${daily.calorieTarget}`}
          accentColor={colors.warning}
        />
        <MetricCard
          label="Water"
          value={`${daily.waterMl} ml`}
          subtitle={`Target ${daily.waterTarget} ml`}
          accentColor={colors.water}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  scoreLabel: {
    ...typography.overline,
    color: colors.textMuted,
  },
  score: {
    ...typography.hero,
    color: colors.accent,
    marginVertical: spacing.xs,
  },
  scoreStatus: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  tip: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
