import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import {
  DIGESTION_DISCLAIMER,
  DIGESTION_FOODS,
  DigestionCategory,
} from '@/constants/nutrition/digestionTimes';
import { useTheme, radii, spacing, typography } from '@/theme';

function categoryLabel(category: DigestionCategory): string {
  if (category === 'fast') return 'FAST CLEAR';
  if (category === 'moderate') return 'MODERATE';
  return 'SLOWER';
}

export function DigestionGuide() {
  const { colors } = useTheme();

  const categoryColor = (category: DigestionCategory): string => {
    if (category === 'fast') return colors.accentText;
    if (category === 'moderate') return colors.actionText;
    return colors.militaryAccent;
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          gap: spacing.sm,
          marginTop: spacing.sm,
        },
        kicker: {
          ...typography.overline,
          color: colors.accentText,
        },
        title: {
          ...typography.heading,
          color: colors.textPrimary,
        },
        accent: {
          color: colors.accentText,
        },
        subtitle: {
          ...typography.body,
          color: colors.textSecondary,
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
          marginTop: spacing.xs,
        },
        cell: {
          width: '31%',
          flexGrow: 1,
          minWidth: 100,
          maxWidth: '33%',
          alignItems: 'center',
          gap: 4,
        },
        art: {
          width: '100%',
          aspectRatio: 1,
          borderRadius: radii.lg,
          overflow: 'hidden',
          backgroundColor: '#0A0A0A',
          borderWidth: 1,
          borderColor: colors.border,
        },
        image: {
          width: '100%',
          height: '100%',
        },
        labelPill: {
          marginTop: spacing.xs,
          backgroundColor: colors.surface,
          borderRadius: radii.pill,
          borderWidth: 1,
          borderColor: colors.borderAccent,
          paddingHorizontal: spacing.sm,
          paddingVertical: 4,
        },
        foodName: {
          ...typography.caption,
          color: colors.textPrimary,
          fontWeight: '800',
          letterSpacing: 0.4,
        },
        time: {
          ...typography.caption,
          color: colors.textSecondary,
          textAlign: 'center',
        },
        badge: {
          ...typography.overline,
          fontSize: 9,
          letterSpacing: 0.8,
        },
        disclaimer: {
          ...typography.caption,
          color: colors.textMuted,
          fontStyle: 'italic',
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>DIGESTION MAP</Text>
      <Text style={styles.title}>
        How long foods take to <Text style={styles.accent}>digest</Text>
      </Text>
      <Text style={styles.subtitle}>
        Use this to time meals around missions — lighter proteins and carbs before
        training, denser plates after.
      </Text>

      <View style={styles.grid}>
        {DIGESTION_FOODS.map((food) => (
          <View key={food.id} style={styles.cell}>
            <View style={styles.art}>
              <Image
                source={food.image}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel={`${food.name} digestion illustration`}
              />
            </View>
            <View style={styles.labelPill}>
              <Text style={styles.foodName}>{food.name.toUpperCase()}</Text>
            </View>
            <Text style={styles.time}>{food.timeLabel}</Text>
            <Text
              style={[styles.badge, { color: categoryColor(food.category) }]}
            >
              {categoryLabel(food.category)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.disclaimer}>{DIGESTION_DISCLAIMER}</Text>
    </View>
  );
}
