import { Linking, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import {
  LONG_TRAIN_SCIENCE,
  PROGRAM_MILESTONES,
  SHORT_SESSION_SCIENCE,
  milestoneForCompletedDays,
} from '@/constants/research/militaryTimeline';
import { colors, spacing, typography } from '@/theme';

interface ResearchMilestonesCardProps {
  completedDays?: number;
}

export function ResearchMilestonesCard({
  completedDays = 0,
}: ResearchMilestonesCardProps) {
  const reached = milestoneForCompletedDays(completedDays);

  return (
    <View style={styles.wrap}>
      <Card accentBorder>
        <Text style={styles.kicker}>RESEARCH BRIEF</Text>
        <Text style={styles.title}>{SHORT_SESSION_SCIENCE.title}</Text>
        <Text style={styles.body}>{SHORT_SESSION_SCIENCE.summary}</Text>
        {SHORT_SESSION_SCIENCE.points.map((point) => (
          <View key={point.source.url} style={styles.point}>
            <Text style={styles.bullet}>• {point.claim}</Text>
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(point.source.url)}
            >
              {point.source.title} →
            </Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.kicker}>LONG TRAIN</Text>
        <Text style={styles.title}>{LONG_TRAIN_SCIENCE.title}</Text>
        <Text style={styles.body}>{LONG_TRAIN_SCIENCE.summary}</Text>
        {LONG_TRAIN_SCIENCE.points.map((point) => (
          <View key={point.source.url} style={styles.point}>
            <Text style={styles.bullet}>• {point.claim}</Text>
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(point.source.url)}
            >
              {point.source.title} →
            </Text>
          </View>
        ))}
      </Card>

      <Text style={styles.section}>What to expect by day 10 · 14 · 30</Text>
      {PROGRAM_MILESTONES.map((milestone) => {
        const unlocked = completedDays >= milestone.days;
        const active = reached === milestone.days;
        return (
          <Card
            key={milestone.days}
            military
            accentBorder={active}
            style={!unlocked ? styles.dim : undefined}
          >
            <Text style={styles.milestoneLabel}>
              {milestone.label}
              {unlocked ? ' · UNLOCKED' : ''}
            </Text>
            <Text style={styles.milestoneTitle}>{milestone.headline}</Text>
            {milestone.accomplishments.map((line) => (
              <Text key={line} style={styles.bullet}>
                • {line}
              </Text>
            ))}
            <Text style={styles.caveat}>{milestone.caveat}</Text>
            <Text style={styles.sourceLabel}>Sources</Text>
            {milestone.sources.map((source) => (
              <Text
                key={source.url}
                style={styles.link}
                onPress={() => Linking.openURL(source.url)}
              >
                {source.title} →
              </Text>
            ))}
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  kicker: { ...typography.overline, color: colors.accent },
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
  section: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  point: { marginBottom: spacing.sm },
  bullet: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  link: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
    marginBottom: 2,
  },
  milestoneLabel: {
    ...typography.overline,
    color: colors.militaryAccent,
  },
  milestoneTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  caveat: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  sourceLabel: {
    ...typography.overline,
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: 2,
  },
  dim: { opacity: 0.72 },
});
