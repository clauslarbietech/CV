import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  CALISTHENICS_FUEL_SOURCES,
  CALISTHENICS_NUTRIENTS,
  CALISTHENICS_TEST_DAY,
  CALISTHENICS_TIMED_FUEL,
  suggestProteinTargetG,
} from '@/constants/nutrition/calisthenicsFuel';
import { formatWeight } from '@/utils/weightUnits';
import { WeightUnit } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

type CalisthenicsFuelCardProps = {
  highlighted?: boolean;
  weightKg?: number | null;
  weightUnit?: WeightUnit;
  currentProteinTarget?: number;
  onApplyProteinTarget?: (grams: number) => void;
};

export function CalisthenicsFuelCard({
  highlighted = false,
  weightKg,
  weightUnit = 'lb',
  currentProteinTarget,
  onApplyProteinTarget,
}: CalisthenicsFuelCardProps) {
  const { colors } = useTheme();
  const [tab, setTab] = useState<'morning' | 'evening'>('morning');
  const [expanded, setExpanded] = useState(true);
  const suggested = suggestProteinTargetG(weightKg);
  const timed =
    CALISTHENICS_TIMED_FUEL.find((w) => w.slot === tab) ??
    CALISTHENICS_TIMED_FUEL[0];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: {
          ...typography.overline,
          color: highlighted ? colors.militaryAccent : colors.accentText,
        },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xs,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        badge: {
          ...typography.caption,
          color: colors.militaryAccent,
          fontWeight: '800',
          marginBottom: spacing.xs,
        },
        tabs: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
        tab: {
          flex: 1,
          paddingVertical: spacing.sm,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
        },
        tabOn: {
          borderColor: colors.actionText,
          backgroundColor: colors.surfaceHover,
        },
        tabLabel: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '700',
        },
        tabLabelOn: { color: colors.actionText },
        section: {
          ...typography.bodyBold,
          color: colors.textPrimary,
          marginTop: spacing.sm,
          marginBottom: spacing.xs,
        },
        item: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: 4,
        },
        warn: {
          ...typography.caption,
          color: colors.danger,
          marginTop: spacing.xs,
        },
        nutrientName: {
          ...typography.bodyBold,
          color: colors.textPrimary,
        },
        nutrientMeta: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: spacing.sm,
        },
        mealName: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.sm,
        },
        mealTiming: {
          ...typography.caption,
          color: colors.accentText,
          marginBottom: spacing.xs,
        },
        chipRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginVertical: spacing.sm,
        },
        chip: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: 4,
        },
        chipText: {
          ...typography.caption,
          color: colors.textMuted,
          fontWeight: '700',
        },
        more: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '700',
          marginTop: spacing.sm,
        },
        link: {
          ...typography.caption,
          color: colors.accentText,
          fontWeight: '700',
          marginBottom: 4,
        },
      }),
    [colors, highlighted],
  );

  return (
    <Card accentBorder military={highlighted}>
      {highlighted ? (
        <Text style={styles.badge}>ACTIVE WITH YOUR CALISTHENICS PLAN</Text>
      ) : null}
      <Text style={styles.kicker}>CALISTHENICS FUEL</Text>
      <Text style={styles.title}>Nutrients for bodyweight PT</Text>
      <Text style={styles.body}>
        Protein, carbs, fluids, and timing matched to morning vs night Military
        Calisthenics windows. Not the viral crash “military diet.”
      </Text>

      {suggested ? (
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              Suggested protein ~{suggested}g/day
              {weightKg
                ? ` · ${formatWeight(weightKg, weightUnit)} body weight`
                : ''}
            </Text>
          </View>
          {currentProteinTarget ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                App target now: {currentProteinTarget}g
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <Text style={styles.nutrientMeta}>
          {CALISTHENICS_TEST_DAY.proteinHintLb} Set weight on My Stuff for a
          personal target.
        </Text>
      )}

      {suggested && onApplyProteinTarget ? (
        <AppButton
          label={`Set today’s protein target to ${suggested}g`}
          variant="action"
          onPress={() => onApplyProteinTarget(suggested)}
        />
      ) : null}

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === 'morning' && styles.tabOn]}
          onPress={() => setTab('morning')}
          accessibilityRole="button"
        >
          <Text style={[styles.tabLabel, tab === 'morning' && styles.tabLabelOn]}>
            Morning PT
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'evening' && styles.tabOn]}
          onPress={() => setTab('evening')}
          accessibilityRole="button"
        >
          <Text style={[styles.tabLabel, tab === 'evening' && styles.tabLabelOn]}>
            Night PT
          </Text>
        </Pressable>
      </View>

      <Text style={styles.section}>{timed.title}</Text>
      <Text style={styles.nutrientMeta}>{timed.when}</Text>
      <Text style={styles.section}>Before</Text>
      {timed.before.map((line) => (
        <Text key={line} style={styles.item}>
          • {line}
        </Text>
      ))}
      <Text style={styles.section}>After</Text>
      {timed.after.map((line) => (
        <Text key={line} style={styles.item}>
          • {line}
        </Text>
      ))}
      <Text style={styles.warn}>Avoid: {timed.skipIf}</Text>

      <Pressable onPress={() => setExpanded((v) => !v)} accessibilityRole="button">
        <Text style={styles.more}>
          {expanded ? 'Hide nutrients & test day ↑' : 'Show nutrients & test day →'}
        </Text>
      </Pressable>

      {expanded ? (
        <>
          <Text style={styles.section}>Key nutrients</Text>
          {CALISTHENICS_NUTRIENTS.map((n) => (
            <View key={n.id}>
              <Text style={styles.nutrientName}>{n.name}</Text>
              <Text style={styles.item}>{n.why}</Text>
              <Text style={styles.nutrientMeta}>{n.dailyTarget}</Text>
              {n.foodHits.map((food) => (
                <Text key={food} style={styles.item}>
                  · {food}
                </Text>
              ))}
            </View>
          ))}

          <Text style={styles.section}>{CALISTHENICS_TEST_DAY.label}</Text>
          <Text style={styles.body}>{CALISTHENICS_TEST_DAY.focus}</Text>
          {CALISTHENICS_TEST_DAY.meals.map((meal) => (
            <View key={meal.name}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealTiming}>
                {meal.timing} · ~{meal.approxProteinG}g protein
              </Text>
              {meal.items.map((item) => (
                <Text key={item} style={styles.item}>
                  • {item}
                </Text>
              ))}
            </View>
          ))}
          <Text style={styles.nutrientMeta}>{CALISTHENICS_TEST_DAY.hydration}</Text>
          {CALISTHENICS_TEST_DAY.notes.map((note) => (
            <Text key={note} style={styles.item}>
              • {note}
            </Text>
          ))}

          <Text style={styles.section}>Sources</Text>
          {CALISTHENICS_FUEL_SOURCES.map((source) => (
            <Text
              key={source.url}
              style={styles.link}
              onPress={() => Linking.openURL(source.url)}
            >
              {source.title} →
            </Text>
          ))}
        </>
      ) : null}
    </Card>
  );
}
