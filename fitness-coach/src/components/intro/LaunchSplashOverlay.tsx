import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform, StyleSheet, View } from 'react-native';

import { SplashLogo } from '@/components/intro/SplashLogo';
import { useLaunchSplashStore } from '@/store/launchSplashStore';

/** Ignore brief focus blips (DevTools, screenshots, OS sheets). */
const MIN_HIDDEN_MS = 1500;
/** Do not replay splash more often than this (prevents tap-blocking loops). */
const MIN_REPLAY_GAP_MS = 8000;

/**
 * Full-screen FitLife logo fade-in.
 * Plays on first mount and again when the user truly returns to the app.
 */
export function LaunchSplashOverlay() {
  const generation = useLaunchSplashStore((s) => s.generation);
  const requestSplash = useLaunchSplashStore((s) => s.requestSplash);
  const [visible, setVisible] = useState(true);
  const [playKey, setPlayKey] = useState(generation);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const playing = useRef(true);
  const lastHiddenAt = useRef(Date.now());
  const lastFinishedAt = useRef(0);

  useEffect(() => {
    if (generation !== playKey) {
      playing.current = true;
      setPlayKey(generation);
      setVisible(true);
    }
  }, [generation, playKey]);

  useEffect(() => {
    const maybeReplay = () => {
      if (playing.current) return;
      const hiddenFor = Date.now() - lastHiddenAt.current;
      if (hiddenFor < MIN_HIDDEN_MS) return;
      if (Date.now() - lastFinishedAt.current < MIN_REPLAY_GAP_MS) return;
      requestSplash();
    };

    const onChange = (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;
      if (next === 'background' || next === 'inactive') {
        lastHiddenAt.current = Date.now();
        return;
      }
      if (next === 'active' && (prev === 'background' || prev === 'inactive')) {
        maybeReplay();
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
        maybeReplay();
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
    <View style={styles.layer} pointerEvents="box-none">
      <SplashLogo
        key={playKey}
        onDone={() => {
          playing.current = false;
          lastFinishedAt.current = Date.now();
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
