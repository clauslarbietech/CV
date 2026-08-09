import { Linking, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import {
  NUTRITION_SOURCES,
  TACTICAL_FASTING_PLAN,
  VIRAL_MILITARY_DIET_DAYS,
} from '@/constants/nutrition/militaryFuel';
import { colors, radii, spacing, typography } from '@/theme';

export default function NutritionScreen() {
  const plan = TACTICAL_FASTING_PLAN;

  return (
    <Screen>
      <Text style={styles.kicker}>FUEL + FASTING</Text>
      <Text style={styles.title}>
        Eat to <Text style={styles.accent}>Shred</Text>
      </Text>
      <Text style={styles.subtitle}>
        Default plan uses a 16:8 fasting window with tactical-style plates.
        Sources linked below.
      </Text>

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

      <Text style={styles.section}>Optional 3-day viral “Military Diet”</Text>
      <Text style={styles.subtitle}>
        Short low-calorie internet plan (NOT official military nutrition). Use
        sparingly — prefer Tactical 16:8 on hard training days.
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

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  accent: {
    color: colors.accent,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  planLabel: {
    ...typography.overline,
    color: colors.accent,
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
    color: colors.accent,
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
    color: colors.accent,
    marginTop: spacing.sm,
  },
});
