import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  EVENING_DURATION_OPTIONS,
  EXPRESS_SOURCES,
  ExpressBudget,
  MORNING_DURATION_OPTIONS,
  SessionSlot,
} from '@/constants/programs/expressMissions';
import { useTheme, radii, spacing, typography } from '@/theme';

export type TimedSessionPick = {
  budget: ExpressBudget;
  slot: SessionSlot;
};

interface SessionWindowCardProps {
  onSelect: (pick: TimedSessionPick) => void;
  disabled?: boolean;
}

export function SessionWindowCard({ onSelect, disabled }: SessionWindowCardProps) {
  const [slot, setSlot] = useState<SessionSlot>('morning');
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();
  const options =
    slot === 'morning' ? MORNING_DURATION_OPTIONS : EVENING_DURATION_OPTIONS;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: {
          ...typography.overline,
          color: colors.accentText,
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
        tabs: {
          flexDirection: 'row',
          gap: spacing.xs,
          marginBottom: spacing.sm,
        },
        tab: {
          flex: 1,
          paddingVertical: spacing.sm,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
        },
        tabActive: {
          borderColor: colors.actionText,
          backgroundColor: colors.surfaceHover,
        },
        tabLabel: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '700',
        },
        tabLabelActive: {
          color: colors.actionText,
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginBottom: spacing.sm,
        },
        btn: {
          minWidth: '30%',
          flexGrow: 1,
          paddingHorizontal: spacing.sm,
          minHeight: 48,
        },
        rangeNote: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: spacing.sm,
        },
        more: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '700',
          marginTop: spacing.xs,
        },
        meta: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: 4,
        },
        sourceLabel: {
          ...typography.overline,
          color: colors.textMuted,
          marginTop: spacing.md,
          marginBottom: spacing.xs,
        },
        link: {
          ...typography.caption,
          color: colors.accentText,
          marginBottom: 4,
          fontWeight: '700',
        },
      }),
    [colors],
  );

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>TIMED WINDOWS</Text>
      <Text style={styles.title}>Morning PT or night session</Text>
      <Text style={styles.body}>
        Pick a window. Morning and night use different minute steps from about 3 to
        30 minutes.
      </Text>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, slot === 'morning' && styles.tabActive]}
          onPress={() => setSlot('morning')}
          accessibilityRole="button"
          accessibilityState={{ selected: slot === 'morning' }}
        >
          <Text
            style={[styles.tabLabel, slot === 'morning' && styles.tabLabelActive]}
          >
            Morning
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, slot === 'evening' && styles.tabActive]}
          onPress={() => setSlot('evening')}
          accessibilityRole="button"
          accessibilityState={{ selected: slot === 'evening' }}
        >
          <Text
            style={[styles.tabLabel, slot === 'evening' && styles.tabLabelActive]}
          >
            Night
          </Text>
        </Pressable>
      </View>

      <Text style={styles.rangeNote}>
        {slot === 'morning'
          ? 'Morning steps: 3 · 5 · 10 · 15 · 20 · 30 min (activation PT)'
          : 'Night steps: 4 · 7 · 12 · 18 · 25 · 30 min (recovery-biased)'}
      </Text>

      <View style={styles.grid}>
        {options.map((option) => (
          <AppButton
            key={`${slot}-${option.budget}`}
            label={option.label}
            variant="secondary"
            disabled={disabled}
            onPress={() => onSelect({ budget: option.budget, slot })}
            style={styles.btn}
          />
        ))}
      </View>

      <Pressable onPress={() => setExpanded((v) => !v)} accessibilityRole="button">
        <Text style={styles.more}>
          {expanded ? 'Show less ↑' : 'View research & details →'}
        </Text>
      </Pressable>

      {expanded
        ? options.map((option) => (
            <Text key={option.strategy} style={styles.meta}>
              {option.label}: {option.strategy} — {option.description}
            </Text>
          ))
        : null}

      {expanded ? (
        <>
          <Text style={styles.sourceLabel}>Sources</Text>
          {EXPRESS_SOURCES.map((source) => (
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

/** @deprecated use SessionWindowCard */
export { SessionWindowCard as ExpressTimeCard };
