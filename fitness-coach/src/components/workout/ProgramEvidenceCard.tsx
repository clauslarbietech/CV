import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import {
  evidenceForProgram,
  verdictLabel,
} from '@/constants/research/programEvidence';
import { useTheme, spacing, typography } from '@/theme';

type ProgramEvidenceCardProps = {
  programId: string;
};

export function ProgramEvidenceCard({ programId }: ProgramEvidenceCardProps) {
  const { colors } = useTheme();
  const profile = evidenceForProgram(programId);
  if (!profile) return null;

  const accent =
    profile.verdict === 'needs-revision'
      ? colors.danger
      : profile.verdict === 'supported-with-caveats'
        ? colors.militaryAccent
        : colors.accentText;

  const styles = StyleSheet.create({
    kicker: { ...typography.overline, color: colors.textMuted },
    title: {
      ...typography.subheading,
      color: colors.textPrimary,
      marginTop: spacing.xxs,
    },
    verdict: { ...typography.caption, color: accent, fontWeight: '700' },
    body: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    listItem: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: 4,
    },
    revision: {
      ...typography.caption,
      color: colors.danger,
      marginTop: 4,
    },
    link: {
      ...typography.caption,
      color: colors.actionText,
      marginTop: spacing.sm,
      fontWeight: '700',
    },
  });

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>RESEARCH BASIS</Text>
      <Text style={styles.title}>{profile.headline}</Text>
      <Text style={styles.verdict}>{verdictLabel(profile.verdict)}</Text>

      <Text style={[styles.body, { marginTop: spacing.sm, fontWeight: '700' }]}>
        What holds up
      </Text>
      {profile.basis.map((line) => (
        <Text key={line} style={styles.listItem}>
          · {line}
        </Text>
      ))}

      {profile.caveats.length ? (
        <>
          <Text style={[styles.body, { fontWeight: '700' }]}>Caveats</Text>
          {profile.caveats.map((line) => (
            <Text key={line} style={styles.listItem}>
              · {line}
            </Text>
          ))}
        </>
      ) : null}

      {profile.revisionNotes.length ? (
        <>
          <Text style={[styles.body, { fontWeight: '700', color: colors.danger }]}>
            Flagged for revision
          </Text>
          {profile.revisionNotes.map((line) => (
            <Text key={line} style={styles.revision}>
              · {line}
            </Text>
          ))}
        </>
      ) : null}

      {profile.sources[0] ? (
        <Pressable
          onPress={() => Linking.openURL(profile.sources[0].url)}
          accessibilityRole="link"
        >
          <Text style={styles.link}>Source: {profile.sources[0].title} →</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}
