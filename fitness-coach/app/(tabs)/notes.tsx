import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AudioDayLog } from '@/components/squad/AudioDayLog';
import { SquadChat } from '@/components/squad/SquadChat';
import { SegmentToggle } from '@/components/charts/SegmentToggle';
import { MedsChecklist } from '@/components/today/MedsChecklist';
import { NotesLogPanel } from '@/components/today/NotesLogPanel';
import { Screen } from '@/components/ui/Screen';
import { useTheme, spacing, typography } from '@/theme';

type NotesSection = 'meds' | 'chat' | 'log';

/**
 * Notes hub with sub-sections: Meds · Chat · Log.
 */
export default function NotesScreen() {
  const { colors } = useTheme();
  const [section, setSection] = useState<NotesSection>('meds');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        subtitle: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        stack: { gap: spacing.lg, marginTop: spacing.md },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.kicker}>NOTES</Text>
      <Text style={styles.subtitle}>Meds, chat, and daily logs.</Text>

      <SegmentToggle
        options={[
          { id: 'meds', label: 'Meds' },
          { id: 'chat', label: 'Chat' },
          { id: 'log', label: 'Log' },
        ]}
        value={section}
        onChange={setSection}
      />

      <View style={styles.stack}>
        {section === 'meds' ? <MedsChecklist /> : null}
        {section === 'chat' ? <SquadChat /> : null}
        {section === 'log' ? (
          <>
            <NotesLogPanel />
            <AudioDayLog />
          </>
        ) : null}
      </View>
    </Screen>
  );
}
