import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { recommendEnrollment } from '@/constants/personaFit';
import { getProgramById } from '@/constants/programs';
import { useProfileStore } from '@/store/profileStore';
import { useTheme, spacing, typography } from '@/theme';

type PersonaPlanCardProps = {
  onOpenProgram: (programId: string) => void;
};

/** Shows why the enrolled plan matches the user’s goal & experience. */
export function PersonaPlanCard({ onOpenProgram }: PersonaPlanCardProps) {
  const { colors } = useTheme();
  const profile = useProfileStore((s) => s.profile);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.actionText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        body: {
          ...typography.caption,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
      }),
    [colors],
  );

  if (!profile?.primaryGoal) return null;

  const rec = recommendEnrollment(
    profile.primaryGoal,
    profile.experienceLevel ?? 'beginner',
  );
  const program = getProgramById(rec.programId);
  if (!program) return null;

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>PICKED FOR YOU</Text>
      <Text style={styles.title}>{program.name}</Text>
      <Text style={styles.body}>{rec.reason}</Text>
      <AppButton
        label="View program details"
        variant="secondary"
        onPress={() => onOpenProgram(rec.programId)}
      />
    </Card>
  );
}
