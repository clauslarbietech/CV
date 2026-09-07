import { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useNotesStore } from '@/store/notesStore';
import { useTheme, radii, spacing, typography } from '@/theme';

/** Work + training free-text notes. */
export function NotesLogPanel() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { gap: spacing.md },
        cardTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        input: {
          backgroundColor: colors.backgroundElevated,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          color: colors.textPrimary,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 96,
          textAlignVertical: 'top',
          marginTop: spacing.sm,
          ...typography.body,
        },
      }),
    [colors],
  );

  const workNotes = useNotesStore((s) => s.workNotes);
  const personalNotes = useNotesStore((s) => s.personalNotes);
  const setWorkNotes = useNotesStore((s) => s.setWorkNotes);
  const setPersonalNotes = useNotesStore((s) => s.setPersonalNotes);

  return (
    <View style={styles.wrap}>
      <Card>
        <Text style={styles.cardTitle}>Work notes</Text>
        <TextInput
          value={workNotes}
          onChangeText={setWorkNotes}
          placeholder="Meetings, tasks, reminders for work…"
          placeholderTextColor={colors.textMuted}
          multiline
          style={styles.input}
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
          style={styles.input}
        />
      </Card>
    </View>
  );
}
