import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { colors, typography } from '@/theme';

export default function CoachScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>COMING NEXT</Text>
      <Text style={styles.title}>
        AI <Text style={styles.accent}>Coach</Text>
      </Text>
      <Text style={styles.subtitle}>
        Live chat stays next. For now: run OPERATION IRON 30 missions and follow
        the Tactical 16:8 fuel plan in Nutrition.
      </Text>
      <Card accentBorder>
        <Text style={styles.body}>
          Tip: Complete today&apos;s mission first. Ask the coach later about
          swaps, sore muscles, and meal timing.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { ...typography.overline, color: colors.accent },
  title: { ...typography.title, color: colors.textPrimary },
  accent: { color: colors.accent },
  subtitle: { ...typography.body, color: colors.textSecondary },
  body: { ...typography.body, color: colors.textSecondary },
});
