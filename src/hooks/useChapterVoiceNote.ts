import { useCallback, useEffect, useRef, useState } from "react";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

/** Maximum voice note length for chapter messages (3 minutes). */
export const CHAPTER_VOICE_NOTE_MAX_MS = 3 * 60 * 1000;

type Options = {
  onAutoStop?: (uri: string, durationSeconds: number) => void;
};

/**
 * Short voice notes for journey chapter chat — capped at 3 minutes with auto-stop.
 */
export function useChapterVoiceNote({ onAutoStop }: Options = {}) {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(recorder, 200);

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [recordedDurationMs, setRecordedDurationMs] = useState(0);
  const [showLimitHint, setShowLimitHint] = useState(false);
  const autoStoppedRef = useRef(false);
  const pendingPlayRef = useRef(false);

  const player = useAudioPlayer(previewUri, { updateInterval: 250 });
  const playerStatus = useAudioPlayerStatus(player);

  const remainingMillis = Math.max(
    0,
    CHAPTER_VOICE_NOTE_MAX_MS - recorderState.durationMillis
  );

  const ensurePermission = useCallback(async () => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setPermissionDenied(true);
      return false;
    }
    setPermissionDenied(false);
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
      shouldPlayInBackground: false,
      interruptionMode: "doNotMix",
    });
    return true;
  }, []);

  const stopRecording = useCallback(async () => {
    setIsBusy(true);
    const elapsed = recorderState.durationMillis;
    try {
      await recorder.stop();
      const uri = recorder.uri;
      const durationSeconds = elapsed / 1000;
      if (uri) {
        setRecordedDurationMs(elapsed);
        setPreviewUri(uri);
        onAutoStop?.(uri, durationSeconds);
      }
    } finally {
      setIsBusy(false);
      setShowLimitHint(false);
    }
  }, [onAutoStop, recorder, recorderState.durationMillis]);

  const startRecording = useCallback(async () => {
    setIsBusy(true);
    autoStoppedRef.current = false;
    try {
      const ok = await ensurePermission();
      if (!ok) {
        return;
      }
      if (player.playing) {
        player.pause();
      }
      setPreviewUri(null);
      setRecordedDurationMs(0);
      setShowLimitHint(true);
      await recorder.prepareToRecordAsync();
      recorder.record();
    } finally {
      setIsBusy(false);
    }
  }, [ensurePermission, player, recorder]);

  useEffect(() => {
    if (
      !recorderState.isRecording ||
      recorderState.durationMillis < CHAPTER_VOICE_NOTE_MAX_MS
    ) {
      return;
    }
    if (autoStoppedRef.current) {
      return;
    }
    autoStoppedRef.current = true;
    void stopRecording();
  }, [recorderState.durationMillis, recorderState.isRecording, stopRecording]);

  const togglePreview = useCallback(() => {
    if (!previewUri) {
      return;
    }
    if (playerStatus.playing) {
      player.pause();
      return;
    }

    const restart =
      playerStatus.didJustFinish ||
      (playerStatus.duration > 0 &&
        playerStatus.currentTime >= playerStatus.duration - 0.05);

    if (restart) {
      void player.seekTo(0).then(() => {
        player.play();
      });
      return;
    }

    player.play();
  }, [player, playerStatus, previewUri]);

  const clearPreview = useCallback(() => {
    if (player.playing) {
      player.pause();
    }
    setPreviewUri(null);
    setRecordedDurationMs(0);
  }, [player]);

  const playMessageUri = useCallback(
    (uri: string, durationSeconds?: number) => {
      if (player.playing) {
        player.pause();
      }
      pendingPlayRef.current = true;
      if (durationSeconds) {
        setRecordedDurationMs(durationSeconds * 1000);
      }
      setPreviewUri(uri);
    },
    [player]
  );

  useEffect(() => {
    if (!previewUri || !pendingPlayRef.current) {
      return;
    }
    pendingPlayRef.current = false;
    void player.seekTo(0).then(() => {
      player.play();
    });
  }, [player, previewUri]);

  return {
    isRecording: recorderState.isRecording,
    durationMillis: recorderState.isRecording
      ? recorderState.durationMillis
      : recordedDurationMs,
    recordedDurationMs,
    remainingMillis,
    maxMillis: CHAPTER_VOICE_NOTE_MAX_MS,
    previewUri,
    permissionDenied,
    isBusy,
    showLimitHint,
    isPlayingPreview: playerStatus.playing,
    startRecording,
    stopRecording,
    togglePreview,
    clearPreview,
    playMessageUri,
  };
}
