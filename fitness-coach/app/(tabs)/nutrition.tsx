import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { DigestionGuide } from '@/components/nutrition/DigestionGuide';
import { FoodScanCard } from '@/components/nutrition/FoodScanCard';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import {
  defaultFuelTrackForGoal,
  nutritionHeadline,
} from '@/constants/personaFit';
import {
  FUEL_TRACKS,
  NUTRITION_SOURCES,
  SARDINE_EGG_ELECTROLYTE_5DAY_LESSON,
  VIRAL_MILITARY_DIET_DAYS,
} from '@/constants/nutrition/militaryFuel';
import { NUTRITION_REVISION_QUEUE } from '@/constants/research/programEvidence';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useTheme, radii, spacing, typography } from '@/theme';

type TrackId = (typeof FUEL_TRACKS)[number]['id'];

export default function NutritionScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: {
          ...typography.overline,
          color: colors.accentText,
        },
        title: {
          ...typography.title,
          color: colors.textPrimary,
        },
        accent: {
          color: colors.accentText,
        },
        subtitle: {
          ...typography.body,
          color: colors.textSecondary,
        },
        trackRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
          marginBottom: spacing.sm,
        },
        trackChip: {
          flexGrow: 1,
          minWidth: '28%',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.sm,
          backgroundColor: colors.surface,
        },
        trackChipOn: {
          borderColor: colors.accent,
          backgroundColor: colors.accentSoft,
        },
        trackLabel: {
          ...typography.bodyBold,
          color: colors.textSecondary,
        },
        trackLabelOn: {
          color: colors.accentText,
        },
        trackHorizon: {
          ...typography.caption,
          color: colors.textMuted,
        },
        planLabel: {
          ...typography.overline,
          color: colors.accentText,
        },
        focus: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginVertical: spacing.xs,
        },
        window: {
          ...typography.body,
          color: colors.textSecondary,
        },
        hydro: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.sm,
        },
        mealName: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginBottom: spacing.xs,
        },
        cal: {
          ...typography.caption,
          color: colors.accentText,
          marginBottom: spacing.xs,
        },
        item: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: 2,
        },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.sm,
        },
        note: {
          ...typography.body,
          color: colors.textSecondary,
        },
        viralCard: {
          borderRadius: radii.xl,
        },
        viralMeal: {
          marginBottom: spacing.sm,
        },
        link: {
          ...typography.bodyBold,
          color: colors.accentText,
          marginTop: spacing.sm,
        },
        verdict: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: spacing.xs,
        },
      }),
    [colors],
  );

  const profile = useProfileStore((s) => s.profile);
  const fuelHeadline = nutritionHeadline(profile?.primaryGoal);
  const [trackId, setTrackId] = useState<TrackId>(
    defaultFuelTrackForGoal(profile?.primaryGoal),
  );
  const track = FUEL_TRACKS.find((t) => t.id === trackId) ?? FUEL_TRACKS[0];
  const plan = track.plan;
  const updateDailyMetrics = useProgramStore((s) => s.updateDailyMetrics);
  const daily = useProgramStore((s) => s.daily);

  return (
    <Screen>
      <Text style={styles.kicker}>FUEL + FASTING</Text>
      <Text style={styles.title}>
        {fuelHeadline.title}{' '}
        <Text style={styles.accent}>{fuelHeadline.accent}</Text>
      </Text>
      <Text style={styles.subtitle}>{fuelHeadline.subtitle}</Text>

      <Card accentBorder>
        <Text style={styles.kicker}>WITH EACH WORKOUT</Text>
        <Text style={styles.section}>Fuel by session length</Text>
        <Text style={styles.note}>
          Short workouts: lighter fuel. Longer ones: more carbs. See it in
          each workout.
        </Text>
      </Card>

      <FoodScanCard
        onApplyProtein={(proteinG) =>
          updateDailyMetrics({
            proteinG: Math.min(
              daily.proteinTarget + 40,
              daily.proteinG + proteinG,
            ),
          })
        }
      />

      <View style={styles.trackRow}>
        {FUEL_TRACKS.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setTrackId(item.id)}
            style={[styles.trackChip, trackId === item.id && styles.trackChipOn]}
          >
            <Text
              style={[
                styles.trackLabel,
                trackId === item.id && styles.trackLabelOn,
              ]}
            >
              {item.label}
            </Text>
            <Text style={styles.trackHorizon}>{item.horizon}</Text>
          </Pressable>
        ))}
      </View>

      <Card accentBorder>
        <Text style={styles.planLabel}>{track.label}</Text>
        <Text style={styles.focus}>{track.summary}</Text>
        <Text style={styles.window}>Use with: {track.whenToUse.join(' · ')}</Text>
        {track.principles.map((line) => (
          <Text key={line} style={styles.item}>
            • {line}
          </Text>
        ))}
      </Card>

      <DigestionGuide />

      <Card accentBorder>
        <Text style={styles.planLabel}>{plan.label}</Text>
        <Text style={styles.focus}>{plan.focus}</Text>
        <Text style={styles.window}>Fast: {plan.fastingWindow}</Text>
        <Text style={styles.window}>Eat: {plan.eatingWindow}</Text>
        <Text style={styles.hydro}>{plan.hydration}</Text>
      </Card>

      {plan.meals.map((meal) => (
        <Card key={meal.name}>
          <Text style={styles.mealName}>{meal.name}</Text>
          {meal.caloriesApprox ? (
            <Text style={styles.cal}>~{meal.caloriesApprox} kcal</Text>
          ) : null}
          {meal.items.map((item) => (
            <Text key={item} style={styles.item}>
              • {item}
            </Text>
          ))}
        </Card>
      ))}

      <Text style={styles.section}>Notes</Text>
      {plan.notes.map((note) => (
        <Text key={note} style={styles.note}>
          • {note}
        </Text>
      ))}

      <Text style={styles.section}>Revision queue — not core programming</Text>
      <Card accentBorder>
        <Text style={[styles.verdict, { color: colors.danger }]}>
          Flagged in evidence audit
        </Text>
        <Text style={styles.note}>
          These sections are kept for transparency but are not backed by strong
          clinical evidence. Prefer the fuel tracks above on training days.
        </Text>
        {NUTRITION_REVISION_QUEUE.filter((item) => item.verdict === 'needs-revision').map(
          (item) => (
            <Text key={item.id} style={styles.item}>
              · {item.label}: {item.revisionAction}
            </Text>
          ),
        )}
      </Card>

      <Text style={styles.section}>Lesson: 5-day sardine + egg + electrolytes</Text>
      <Card accentBorder>
        <Text style={styles.planLabel}>{SARDINE_EGG_ELECTROLYTE_5DAY_LESSON.label}</Text>
        <Text style={styles.verdict}>
          Verdict: {SARDINE_EGG_ELECTROLYTE_5DAY_LESSON.verdict}
        </Text>
        <Text style={styles.item}>{SARDINE_EGG_ELECTROLYTE_5DAY_LESSON.scope}</Text>
        <Text style={styles.mealName}>How people run it</Text>
        {SARDINE_EGG_ELECTROLYTE_5DAY_LESSON.protocol.map((line) => (
          <Text key={line} style={styles.item}>
            • {line}
          </Text>
        ))}
        <Text style={styles.mealName}>Why it may feel effective</Text>
        {SARDINE_EGG_ELECTROLYTE_5DAY_LESSON.whyItMayWork.map((line) => (
          <Text key={line} style={styles.item}>
            • {line}
          </Text>
        ))}
        <Text style={styles.mealName}>Risks & limits</Text>
        {SARDINE_EGG_ELECTROLYTE_5DAY_LESSON.risksAndLimits.map((line) => (
          <Text key={line} style={styles.item}>
            • {line}
          </Text>
        ))}
        <Text style={styles.mealName}>Stop rules</Text>
        {SARDINE_EGG_ELECTROLYTE_5DAY_LESSON.stopRules.map((line) => (
          <Text key={line} style={styles.item}>
            • {line}
          </Text>
        ))}
      </Card>

      <Text style={styles.section}>Optional 3-day viral low-calorie diet</Text>
      <Text style={styles.subtitle}>
        Short low-calorie internet plan (not a recommended training diet). Use
        sparingly — prefer Short-Block or Everyday 16:8 on hard training days.
      </Text>
      {VIRAL_MILITARY_DIET_DAYS.map((day) => (
        <Card key={day.id} style={styles.viralCard}>
          <Text style={styles.mealName}>{day.label}</Text>
          {day.meals.map((meal) => (
            <View key={meal.name} style={styles.viralMeal}>
              <Text style={styles.cal}>{meal.name}</Text>
              <Text style={styles.item}>{meal.items.join(' · ')}</Text>
            </View>
          ))}
        </Card>
      ))}

      <Text style={styles.section}>Best sources</Text>
      {NUTRITION_SOURCES.map((source) => (
        <Card key={source.id}>
          <Text style={styles.mealName}>{source.title}</Text>
          <Text style={styles.item}>{source.note}</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(source.url)}
          >
            Open source →
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
