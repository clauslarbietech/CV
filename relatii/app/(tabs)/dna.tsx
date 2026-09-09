import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DnaPreviewCard } from '@/components/dna/DnaPreviewCard';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { buildProvisionalDna } from '@/features/dna/provisionalDna';
import { useMatchStore } from '@/store/matchStore';
import { useTheme, spacing, typography } from '@/theme';

export default function MyDnaScreen() {
  const { colors } = useTheme();
  const answers = useMatchStore((s) => s.answers);
  const stored = useMatchStore((s) => s.dna);
  const dna = stored ?? buildProvisionalDna(answers);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          ...typography.title,
          color: colors.textPrimary,
          marginBottom: spacing.sm,
        },
        support: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
        },
        section: {
          marginTop: spacing.xl,
          gap: spacing.sm,
        },
        card: {
          padding: spacing.md,
          borderRadius: 18,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        label: {
          ...typography.caption,
          color: colors.dna,
          fontFamily: typography.bodyBold.fontFamily,
          marginBottom: 4,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
        },
        todo: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.lg,
        },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.title}>Your Relationship DNA</Text>
      <Text style={styles.support}>
        A user-controlled, evolving model — not a fixed identity or success
        prediction. Correct or hide traits anytime.
      </Text>

      <DnaPreviewCard
        label={dna.label}
        clarity={dna.clarity}
        clarityLabel={dna.clarityLabel}
        insight={dna.insight}
      />

      <View style={styles.section}>
        {dna.pillars.map((p) => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.label}>{p.label}</Text>
            <Text style={styles.body}>{p.note}</Text>
          </View>
        ))}
      </View>

      <AppButton
        label="Does this sound like you? — Yes"
        variant="secondary"
        onPress={() => undefined}
        style={{ marginTop: spacing.xl }}
      />
      <AppButton
        label="Not quite / Edit"
        variant="ghost"
        onPress={() => undefined}
      />
      <Text style={styles.todo}>
        TODO (product-owner): DNA Pulse engine, trait hide/edit persistence, and
        Day 7 / Day 30 checkpoints.
      </Text>
    </Screen>
  );
}
