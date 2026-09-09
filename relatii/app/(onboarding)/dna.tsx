import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { DnaPreviewCard } from '@/components/dna/DnaPreviewCard';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { buildProvisionalDna } from '@/features/dna/provisionalDna';
import { useMatchStore } from '@/store/matchStore';
import { useTheme, spacing, typography } from '@/theme';

export default function DnaPreviewScreen() {
  const { colors } = useTheme();
  const answers = useMatchStore((s) => s.answers);
  const stored = useMatchStore((s) => s.dna);
  const saveDna = useMatchStore((s) => s.saveDna);
  const enterApp = useMatchStore((s) => s.enterApp);
  const dna = stored ?? buildProvisionalDna(answers);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        pillars: {
          marginTop: spacing.xl,
          gap: spacing.sm,
        },
        pillar: {
          padding: spacing.md,
          borderRadius: 18,
          backgroundColor: colors.dnaSoft,
          borderWidth: 1,
          borderColor: colors.border,
        },
        pillarLabel: {
          ...typography.caption,
          color: colors.dna,
          fontFamily: typography.bodyBold.fontFamily,
          marginBottom: 4,
        },
        pillarNote: {
          ...typography.body,
          color: colors.textSecondary,
        },
        footer: {
          marginTop: spacing.xxl,
          gap: spacing.sm,
        },
        note: {
          ...typography.caption,
          color: colors.textMuted,
          textAlign: 'center',
        },
      }),
    [colors],
  );

  const onSave = () => {
    saveDna();
    enterApp();
    router.replace('/(tabs)/discover');
  };

  return (
    <Screen>
      <DnaPreviewCard
        label={dna.label}
        clarity={dna.clarity}
        clarityLabel={dna.clarityLabel}
        insight={dna.insight}
      />

      <View style={styles.pillars}>
        {dna.pillars.map((p) => (
          <View key={p.id} style={styles.pillar}>
            <Text style={styles.pillarLabel}>{p.label}</Text>
            <Text style={styles.pillarNote}>{p.note}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton label="Save my DNA" onPress={onSave} />
        <AppButton
          label="Edit taps"
          variant="secondary"
          onPress={() => {
            useMatchStore.getState().setStep(1);
            router.replace('/(onboarding)/taps');
          }}
        />
        <Text style={styles.note}>
          Guest answers persist through account creation (coming next). Account
          and profile are TODO for product-owner review.
        </Text>
      </View>
    </Screen>
  );
}
