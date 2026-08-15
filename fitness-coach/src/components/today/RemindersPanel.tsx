import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useNotesStore } from '@/store/notesStore';
import { useTheme, radii, spacing, typography } from '@/theme';

/**
 * Locked daily panel: meds checklist + work notes.
 * Tracking/reminders only — not medical advice.
 */
export function RemindersPanel() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          gap: spacing.md,
        },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.sm,
        },
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
          color: colors.black,
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
          color: colors.black,
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
        addRow: {
          flexDirection: 'row',
          gap: spacing.xs,
          marginTop: spacing.sm,
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
        notesBox: {
          marginTop: spacing.sm,
          minHeight: 96,
          textAlignVertical: 'top',
        },
      }),
    [colors],
  );

  const meds = useNotesStore((s) => s.meds);
  const workNotes = useNotesStore((s) => s.workNotes);
  const personalNotes = useNotesStore((s) => s.personalNotes);
  const toggleMedTaken = useNotesStore((s) => s.toggleMedTaken);
  const isMedTakenToday = useNotesStore((s) => s.isMedTakenToday);
  const addMed = useNotesStore((s) => s.addMed);
  const setWorkNotes = useNotesStore((s) => s.setWorkNotes);
  const setPersonalNotes = useNotesStore((s) => s.setPersonalNotes);
  const [newMed, setNewMed] = useState('');

  const takenCount = meds.filter((m) => isMedTakenToday(m.id)).length;

  return (
    <View style={styles.wrap}>
      <Text style={styles.section}>Pinned reminders</Text>

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

        {meds.map((med) => {
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
                <Text style={styles.medMeta}>
                  {[med.timeLabel, med.dose].filter(Boolean).join(' · ')}
                </Text>
              </View>
            </Pressable>
          );
        })}

        <View style={styles.addRow}>
          <TextInput
            value={newMed}
            onChangeText={setNewMed}
            placeholder="Add med / supplement name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <AppButton
            label="Add"
            variant="secondary"
            onPress={() => {
              addMed(newMed);
              setNewMed('');
            }}
            style={styles.addBtn}
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Work notes</Text>
        <TextInput
          value={workNotes}
          onChangeText={setWorkNotes}
          placeholder="Meetings, tasks, reminders for work…"
          placeholderTextColor={colors.textMuted}
          multiline
          style={[styles.input, styles.notesBox]}
        />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Training notes</Text>
        <TextInput
          value={personalNotes}
          onChangeText={setPersonalNotes}
          placeholder="Soreness, sleep, energy, what to adjust…"
          placeholderTextColor={colors.textMuted}
          multiline
          style={[styles.input, styles.notesBox]}
        />
      </Card>
    </View>
  );
}
