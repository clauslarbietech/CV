import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusLabel } from '@/components/charts/StatusLabel';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  ENERGY_ROUTES,
  EnergyLevel,
  EnergyRoute,
  energyToScore,
  routeForEnergy,
} from '@/constants/programs/energyRoutes';
import { useTheme, radii, spacing, typography } from '@/theme';

type EnergyRouteCardProps = {
  value: EnergyLevel | null;
  onChange: (level: EnergyLevel) => void;
  onStartRoute: (route: EnergyRoute) => void;
};

export function EnergyRouteCard({
  value,
  onChange,
  onStartRoute,
}: EnergyRouteCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
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
        row: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginBottom: spacing.md,
        },
        chip: {
          minWidth: '30%',
          flexGrow: 1,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.sm,
          backgroundColor: colors.surface,
          gap: 2,
        },
        chipActive: {
          borderColor: colors.accent,
          backgroundColor: colors.accentSoft,
        },
        chipLabel: {
          ...typography.bodyBold,
          color: colors.textPrimary,
          fontSize: 14,
        },
        chipRange: {
          ...typography.caption,
          color: colors.textMuted,
        },
        routeBox: {
          backgroundColor: colors.surfaceHover,
          borderRadius: 12,
          padding: spacing.md,
          gap: 6,
          marginBottom: spacing.sm,
        },
        routeTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        routeMeta: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        scoreRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        score: {
          fontSize: 28,
          fontWeight: '800',
          color: colors.textPrimary,
        },
      }),
    [colors],
  );

  const route = value ? routeForEnergy(value) : null;
  const score = value ? energyToScore(value) : null;

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>ENERGY CHECK-IN</Text>
      <Text style={styles.title}>How do you feel right now?</Text>
      <Text style={styles.body}>
        Pick an energy band. We map it to a score range and the right workout
        route — recovery express through elite full mission.
      </Text>

      <View style={styles.row}>
        {ENERGY_ROUTES.map((option) => {
          const active = value === option.level;
          return (
            <Pressable
              key={option.level}
              onPress={() => onChange(option.level)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={styles.chipLabel}>
                {option.level} · {option.label}
              </Text>
              <Text style={styles.chipRange}>{option.scoreRange}</Text>
            </Pressable>
          );
        })}
      </View>

      {route && score != null ? (
        <View style={styles.routeBox}>
          <View style={styles.scoreRow}>
            <Text style={styles.score}>{score}</Text>
            <StatusLabel status={route.status} label={route.label} />
          </View>
          <Text style={styles.routeTitle}>{route.routeLabel}</Text>
          <Text style={styles.routeMeta}>{route.description}</Text>
        </View>
      ) : null}

      <AppButton
        label={route ? `Start ${route.routeLabel}` : 'Select energy first'}
        variant="action"
        disabled={!route}
        onPress={() => route && onStartRoute(route)}
      />
    </Card>
  );
}
