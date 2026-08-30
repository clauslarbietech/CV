import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { HEALTH_DISCLAIMER_FULL, SUPPORT_EMAIL } from '@/constants/legal';
import { useTheme, spacing, typography } from '@/theme';

type LegalDocumentScreenProps = {
  title: string;
  sections: Array<{ heading: string; body: string }>;
};

export function LegalDocumentScreen({ title, sections }: LegalDocumentScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: { ...typography.title, color: colors.textPrimary },
        heading: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.md,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
          marginTop: spacing.xs,
        },
        footer: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.lg,
        },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.title}>{title}</Text>
      {sections.map((section) => (
        <Text key={section.heading}>
          <Text style={styles.heading}>{section.heading}</Text>
          {'\n'}
          <Text style={styles.body}>{section.body}</Text>
        </Text>
      ))}
      <Text style={styles.footer}>
        Questions: {SUPPORT_EMAIL}
        {'\n\n'}
        {HEALTH_DISCLAIMER_FULL}
      </Text>
    </Screen>
  );
}
