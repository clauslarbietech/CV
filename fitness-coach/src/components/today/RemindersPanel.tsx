/**
 * @deprecated Use MedsChecklist + NotesLogPanel from Notes tab sub-sections.
 */
export { MedsChecklist } from '@/components/today/MedsChecklist';
export { NotesLogPanel } from '@/components/today/NotesLogPanel';

import { View } from 'react-native';

import { MedsChecklist } from '@/components/today/MedsChecklist';
import { NotesLogPanel } from '@/components/today/NotesLogPanel';
import { spacing } from '@/theme';

/** Legacy combined panel — prefer Notes tab sections. */
export function RemindersPanel() {
  return (
    <View style={{ gap: spacing.md }}>
      <MedsChecklist />
      <NotesLogPanel />
    </View>
  );
}
