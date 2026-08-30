import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { SUPPORT_EMAIL } from '@/constants/legal';
import { useLaunchSplashStore } from '@/store/launchSplashStore';
import { resetAllAppData } from '@/utils/resetAppData';
import { useTheme, spacing, typography } from '@/theme';

function confirmDelete(): Promise<boolean> {
  const message =
    'Delete all FitLife data on this device? Workouts, notes, chat, and profile will be removed. This cannot be undone.';

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return Promise.resolve(window.confirm(message));
  }

  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Alert } = require('react-native') as typeof import('react-native');
    Alert.alert('Delete my data?', message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => resolve(true),
      },
    ]);
  });
}

export function DeleteMyDataCard() {
  const { colors } = useTheme();
  const requestSplash = useLaunchSplashStore((s) => s.requestSplash);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.danger },
        body: {
          ...typography.body,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        note: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.xs,
        },
        done: {
          ...typography.bodyBold,
          color: colors.success,
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    setBusy(true);
    try {
      await resetAllAppData();
      setDone(true);
      requestSplash();
      router.replace('/(auth)/welcome');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>DELETE MY DATA</Text>
      <Text style={styles.body}>
        Remove all workouts, notes, chat, and profile stored on this device. Required
        for App Store privacy compliance.
      </Text>
      {done ? (
        <Text style={styles.done}>Data cleared. Restarting onboarding…</Text>
      ) : (
        <View>
          <AppButton
            label={busy ? 'Deleting…' : 'Delete all data on this device'}
            variant="ghost"
            onPress={handleDelete}
            disabled={busy}
          />
          {busy ? <ActivityIndicator color={colors.textMuted} /> : null}
        </View>
      )}
      <Text style={styles.note}>
        Cloud accounts (if enabled): email {SUPPORT_EMAIL} to delete server copies.
      </Text>
    </Card>
  );
}
