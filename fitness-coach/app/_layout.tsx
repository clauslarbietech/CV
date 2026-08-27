import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { LaunchSplashOverlay } from '@/components/intro/LaunchSplashOverlay';
import { useAuthStore } from '@/store/authStore';
import { ThemeProvider, useTheme } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function RootNavigator() {
  const { colors } = useTheme();

  const headerOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.textPrimary,
    headerTitleStyle: { fontWeight: '700' as const },
    headerShadowVisible: false,
  } as const;

  return (
    <>
      <StatusBar style={colors.statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="program/[id]"
          options={{ ...headerOptions, title: 'Program' }}
        />
        <Stack.Screen
          name="session/[programId]"
          options={{
            ...headerOptions,
            title: 'Workout',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            ...headerOptions,
            title: 'Settings',
            presentation: 'modal',
          }}
        />
      </Stack>
      <LaunchSplashOverlay />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const mark = () => useAuthStore.getState().setHydrated(true);
    const unsub = useAuthStore.persist.onFinishHydration(mark);
    if (useAuthStore.persist.hasHydrated()) {
      mark();
    }
    return unsub;
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
