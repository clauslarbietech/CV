import { Redirect } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';

/**
 * Boot router only — logo fade-in is owned by LaunchSplashOverlay in root layout
 * so it replays whenever the user comes back into the app.
 */
export default function Index() {
  const { colors } = useTheme();
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.getState().isHydrated,
  );
  const styles = useMemo(
    () =>
      StyleSheet.create({
        boot: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
        },
      }),
    [colors],
  );

  useEffect(() => {
    const mark = () => setHydrated(true);
    if (useAuthStore.getState().isHydrated) {
      mark();
      return;
    }
    return useAuthStore.persist.onFinishHydration(mark);
  }, []);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profile = useProfileStore((s) => s.profile);

  if (!hydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.accentText} size="large" />
      </View>
    );
  }

  const needsIntro =
    !isAuthenticated ||
    !profile?.onboardingCompleted ||
    (profile.sex !== 'male' && profile.sex !== 'female');

  if (needsIntro) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
