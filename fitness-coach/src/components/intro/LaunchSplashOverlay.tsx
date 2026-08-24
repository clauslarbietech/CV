import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform, StyleSheet, View } from 'react-native';

import { SplashLogo } from '@/components/intro/SplashLogo';
import { useLaunchSplashStore } from '@/store/launchSplashStore';

/**
 * Full-screen FitLife logo fade-in.
 * Plays on first mount and again whenever the user returns to the app
 * (background → active, or web tab hidden → visible).
 */
export function LaunchSplashOverlay() {
  const generation = useLaunchSplashStore((s) => s.generation);
  const requestSplash = useLaunchSplashStore((s) => s.requestSplash);
  const [visible, setVisible] = useState(true);
  const [playKey, setPlayKey] = useState(generation);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const playing = useRef(true);
  const lastHiddenAt = useRef(0);

  useEffect(() => {
    if (generation !== playKey) {
      playing.current = true;
      setPlayKey(generation);
      setVisible(true);
    }
  }, [generation, playKey]);

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;
      if (next === 'background' || next === 'inactive') {
        lastHiddenAt.current = Date.now();
        return;
      }
      if (next === 'active' && (prev === 'background' || prev === 'inactive')) {
        // Ignore tiny inactive blips (permission sheets, etc.)
        if (Date.now() - lastHiddenAt.current < 400) return;
        if (playing.current) return;
        requestSplash();
      }
    };

    const sub = AppState.addEventListener('change', onChange);

    const onVisibility = () => {
      if (typeof document === 'undefined') return;
      if (document.visibilityState === 'hidden') {
        lastHiddenAt.current = Date.now();
        return;
      }
      if (document.visibilityState === 'visible') {
        if (Date.now() - lastHiddenAt.current < 400) return;
        if (playing.current) return;
        requestSplash();
      }
    };

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      sub.remove();
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility);
      }
    };
  }, [requestSplash]);

  if (!visible) return null;

  return (
    <View style={styles.layer} pointerEvents="auto">
      <SplashLogo
        key={playKey}
        onDone={() => {
          playing.current = false;
          setVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    elevation: 9999,
  },
});
