import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WorkoutProgram } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

interface ProgramCardProps {
  program: WorkoutProgram;
  onPress: () => void;
  featured?: boolean;
}

export function ProgramCard({ program, onPress, featured }: ProgramCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.surface,
          borderRadius: radii.xxl,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.xl,
          gap: spacing.xs,
        },
        featured: {
          borderColor: colors.borderAccent,
          borderWidth: 1.5,
          backgroundColor: colors.militarySurface,
        },
        pressed: {
          opacity: 0.92,
          transform: [{ scale: 0.99 }],
        },
        badge: {
          ...typography.overline,
          color: colors.accent,
          marginBottom: spacing.xxs,
        },
        name: {
          ...typography.title,
          color: colors.textPrimary,
        },
        subtitle: {
          ...typography.subheading,
          color: colors.textSecondary,
        },
        tagline: {
          ...typography.body,
          color: colors.textMuted,
          marginTop: spacing.xxs,
        },
        metaRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: spacing.xs,
          marginTop: spacing.sm,
        },
        meta: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        dot: {
          color: colors.textMuted,
        },
        tags: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginTop: spacing.sm,
        },
        tag: {
          backgroundColor: colors.accentSoft,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs,
        },
        tagText: {
          ...typography.caption,
          color: colors.accent,
          textTransform: 'capitalize',
          fontWeight: '700',
        },
      }),
    [colors],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${program.name}. ${program.subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        featured && styles.featured,
        pressed && styles.pressed,
      ]}
    >
      {featured ? <Text style={styles.badge}>FEATURED CHALLENGE</Text> : null}
      <Text style={styles.name}>{program.name}</Text>
      <Text style={styles.subtitle}>{program.subtitle}</Text>
      <Text style={styles.tagline}>{program.tagline}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{program.durationDays} days</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.meta}>{program.equipment}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.meta}>{program.averageWorkout}</Text>
      </View>
      <View style={styles.tags}>
        {program.categories.slice(0, 4).map((cat) => (
          <View key={cat} style={styles.tag}>
            <Text style={styles.tagText}>{cat.replace('_', ' ')}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}
