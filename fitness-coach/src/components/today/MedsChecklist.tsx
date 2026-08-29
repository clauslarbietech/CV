import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  MED_CATEGORIES,
  MED_CATEGORY_LABELS,
  type MedCategory,
} from '@/constants/medCategories';
import { type MedItem, useNotesStore } from '@/store/notesStore';
import { useTheme, radii, spacing, typography } from '@/theme';

function groupMedsByCategory(meds: MedItem[]): Record<MedCategory, MedItem[]> {
  const grouped = Object.fromEntries(
    MED_CATEGORIES.map((category) => [category, [] as MedItem[]]),
  ) as Record<MedCategory, MedItem[]>;

  for (const med of meds) {
    const bucket = grouped[med.category] ?? grouped.morning;
    bucket.push(med);
  }

  return grouped;
}

/** Daily meds checklist grouped by time-of-day category. */
export function MedsChecklist() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        headerRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xs,
        },
        cardTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        badge: {
          ...typography.caption,
          color: colors.onAccent,
          backgroundColor: colors.accent,
          overflow: 'hidden',
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: 4,
          fontWeight: '800',
        },
        disclaimer: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: spacing.sm,
        },
        categoryBlock: {
          marginBottom: spacing.sm,
        },
        categoryHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xs,
          marginTop: spacing.xs,
        },
        categoryTitle: {
          ...typography.bodyBold,
          color: colors.textPrimary,
        },
        categoryCount: {
          ...typography.caption,
          color: colors.textMuted,
          fontWeight: '700',
        },
        medRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.sm,
          borderRadius: radii.md,
          backgroundColor: colors.backgroundElevated,
          marginBottom: spacing.xs,
          borderWidth: 1,
          borderColor: colors.border,
          minHeight: 52,
        },
        medRowDone: {
          borderColor: colors.accent,
          backgroundColor: colors.accentSoft,
        },
        check: {
          width: 28,
          height: 28,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        checkOn: {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        },
        checkMark: {
          color: colors.onAccent,
          fontWeight: '800',
          fontSize: 14,
        },
        medText: {
          flex: 1,
        },
        medName: {
          ...typography.bodyBold,
          color: colors.textPrimary,
        },
        medMeta: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        addSection: {
          marginTop: spacing.md,
          gap: spacing.sm,
          paddingTop: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        addLabel: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '700',
        },
        chips: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
        },
        addRow: {
          flexDirection: 'row',
          gap: spacing.xs,
          alignItems: 'center',
        },
        input: {
          flex: 1,
          backgroundColor: colors.backgroundElevated,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          color: colors.textPrimary,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 48,
          ...typography.body,
        },
        addBtn: {
          minHeight: 48,
          paddingHorizontal: spacing.md,
        },
      }),
    [colors],
  );

  const meds = useNotesStore((s) => s.meds);
  const toggleMedTaken = useNotesStore((s) => s.toggleMedTaken);
  const isMedTakenToday = useNotesStore((s) => s.isMedTakenToday);
  const addMed = useNotesStore((s) => s.addMed);
  const [newMed, setNewMed] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newCategory, setNewCategory] = useState<MedCategory>('morning');

  const takenCount = meds.filter((m) => isMedTakenToday(m.id)).length;
  const groupedMeds = useMemo(() => groupMedsByCategory(meds), [meds]);

  const handleAddMed = () => {
    if (!newMed.trim()) return;
    addMed(newMed, newCategory, newDose || undefined);
    setNewMed('');
    setNewDose('');
  };

  return (
    <Card accentBorder>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Take your meds</Text>
        <Text style={styles.badge}>
          {takenCount}/{meds.length}
        </Text>
      </View>
      <Text style={styles.disclaimer}>
        Reminder checklist only — do not change doses without your clinician.
      </Text>

      {MED_CATEGORIES.map((category) => {
        const items = groupedMeds[category];
        const done = items.filter((m) => isMedTakenToday(m.id)).length;
        if (items.length === 0) return null;

        return (
          <View key={category} style={styles.categoryBlock}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>
                {MED_CATEGORY_LABELS[category]}
              </Text>
              <Text style={styles.categoryCount}>
                {done}/{items.length}
              </Text>
            </View>

            {items.map((med) => {
              const taken = isMedTakenToday(med.id);
              return (
                <Pressable
                  key={med.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: taken }}
                  onPress={() => toggleMedTaken(med.id)}
                  style={[styles.medRow, taken && styles.medRowDone]}
                >
                  <View style={[styles.check, taken && styles.checkOn]}>
                    <Text style={styles.checkMark}>{taken ? '✓' : ''}</Text>
                  </View>
                  <View style={styles.medText}>
                    <Text style={styles.medName}>{med.name}</Text>
                    {med.dose ? (
                      <Text style={styles.medMeta}>{med.dose}</Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        );
      })}

      <View style={styles.addSection}>
        <Text style={styles.addLabel}>Add to category</Text>
        <View style={styles.chips}>
          {MED_CATEGORIES.map((category) => (
            <OptionChip
              key={category}
              label={MED_CATEGORY_LABELS[category]}
              selected={newCategory === category}
              onPress={() => setNewCategory(category)}
            />
          ))}
        </View>

        <View style={styles.addRow}>
          <TextInput
            value={newMed}
            onChangeText={setNewMed}
            placeholder="Med or supplement name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.addRow}>
          <TextInput
            value={newDose}
            onChangeText={setNewDose}
            placeholder="Dose note (optional)"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <AppButton
            label="Add"
            variant="secondary"
            onPress={handleAddMed}
            style={styles.addBtn}
          />
        </View>
      </View>
    </Card>
  );
}
