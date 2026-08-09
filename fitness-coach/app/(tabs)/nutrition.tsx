import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { colors, typography } from '@/theme';

export default function NutritionScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>LOCKED UNTIL PHASE 1 COMPLETE</Text>
      <Text style={styles.title}>Nutrition</Text>
      <Text style={styles.subtitle}>
        Decide-before-you-eat, photo logging, and scoring ship after the Iron 14
        workout session engine is proven.
      </Text>
      <Card>
        <Text style={styles.body}>
          Phase 1 focus remains visual fat loss through the military bodyweight
          protocol — training first.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.overline,
    color: colors.warning,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
