import { Redirect } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { SplashLogo } from '@/components/intro/SplashLogo';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';
import {
  markLaunchSplashShown,
  wasLaunchSplashShown,
} from '@/utils/launchSplash';

/**
 * Always show the FitLife logo fade-in on a cold load before routing.
 * Returning users previously skipped welcome and never saw the splash.
 */
export default function Index() {
  const { colors } = useTheme();
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.getState().isHydrated,
  );
  const [splashDone, setSplashDone] = useState(wasLaunchSplashShown);
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

  // Show splash as soon as we can — don't wait on spinner if already hydrated.
  if (!splashDone) {
    return (
      <View style={styles.boot}>
        <SplashLogo
          onDone={() => {
            markLaunchSplashShown();
            setSplashDone(true);
          }}
        />
      </View>
    );
  }

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
