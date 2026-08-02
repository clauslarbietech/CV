import { useCallback, useEffect, useState } from "react";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import {
  getChapterProgress,
  updateChapterProgress,
} from "../services/listeningProgress";

type Options = {
  bookId: string;
  chapterNumber: number;
};

/**
 * TTW-Together-style voice reflections: record a short message for a chapter,
 * save it locally, and replay it later.
 */
export function useVoiceReflection({ bookId, chapterNumber }: Options) {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(recorder, 200);

  const [reflectionUri, setReflectionUri] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const player = useAudioPlayer(reflectionUri, {
    updateInterval: 250,
  });
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const progress = await getChapterProgress(bookId, chapterNumber);
      if (!cancelled) {
        setReflectionUri(progress.reflectionUri ?? null);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [bookId, chapterNumber]);

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

  const startRecording = useCallback(async () => {
    setIsBusy(true);
    try {
      const ok = await ensurePermission();
      if (!ok) {
        return;
      }
      if (player.playing) {
        player.pause();
      }
      await recorder.prepareToRecordAsync();
      recorder.record();
    } finally {
      setIsBusy(false);
    }
  }, [ensurePermission, player, recorder]);

  const stopRecording = useCallback(async () => {
    setIsBusy(true);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (uri) {
        setReflectionUri(uri);
        await updateChapterProgress(bookId, chapterNumber, {
          reflectionUri: uri,
        });
      }
    } finally {
      setIsBusy(false);
    }
  }, [bookId, chapterNumber, recorder]);

  const togglePlayback = useCallback(() => {
    if (!reflectionUri) {
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
  }, [player, playerStatus, reflectionUri]);

  const clearReflection = useCallback(async () => {
    if (player.playing) {
      player.pause();
    }
    setReflectionUri(null);
    await updateChapterProgress(bookId, chapterNumber, {
      reflectionUri: undefined,
    });
  }, [bookId, chapterNumber, player]);

  return {
    isRecording: recorderState.isRecording,
    durationMillis: recorderState.durationMillis,
    metering: recorderState.metering,
    reflectionUri,
    permissionDenied,
    isBusy,
    isPlayingReflection: playerStatus.playing,
    startRecording,
    stopRecording,
    togglePlayback,
    clearReflection,
  };
}
