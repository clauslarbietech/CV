import { Redirect } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';

export default function Index() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        boot: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        },
      }),
    [colors],
  );

  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profile = useProfileStore((s) => s.profile);

  if (!isHydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.accentText} size="large" />
      </View>
    );
  }

  // New intro requires a completed profile with body sex selection.
  const needsIntro =
    !isAuthenticated ||
    !profile?.onboardingCompleted ||
    (profile.sex !== 'male' && profile.sex !== 'female');

  if (needsIntro) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
