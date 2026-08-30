import { useMemo } from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

import { Card } from '@/components/ui/Card';
import {
  APP_VERSION,
  PRIVACY_POLICY_URL,
  SUPPORT_EMAIL,
  SUPPORT_URL,
  TERMS_OF_USE_URL,
} from '@/constants/legal';
import { useTheme, spacing, typography } from '@/theme';

export function LegalLinksCard() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.textMuted },
        link: {
          ...typography.bodyBold,
          color: colors.actionText,
          paddingVertical: spacing.sm,
        },
        meta: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.xs,
        },
      }),
    [colors],
  );

  const open = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>LEGAL & SUPPORT</Text>
      <Pressable onPress={() => router.push('/legal/privacy')} accessibilityRole="link">
        <Text style={styles.link}>Privacy Policy →</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/legal/terms')} accessibilityRole="link">
        <Text style={styles.link}>Terms of Use →</Text>
      </Pressable>
      <Pressable onPress={() => open(PRIVACY_POLICY_URL)} accessibilityRole="link">
        <Text style={styles.meta}>Web: {PRIVACY_POLICY_URL}</Text>
      </Pressable>
      <Pressable onPress={() => open(TERMS_OF_USE_URL)} accessibilityRole="link">
        <Text style={styles.meta}>Web: {TERMS_OF_USE_URL}</Text>
      </Pressable>
      <Pressable onPress={() => open(SUPPORT_URL)} accessibilityRole="link">
        <Text style={styles.link}>Support →</Text>
      </Pressable>
      <Pressable onPress={() => open(`mailto:${SUPPORT_EMAIL}`)} accessibilityRole="link">
        <Text style={styles.link}>Contact: {SUPPORT_EMAIL}</Text>
      </Pressable>
      <Text style={styles.meta}>FitLife AI Coach v{APP_VERSION}</Text>
    </Card>
  );
}
