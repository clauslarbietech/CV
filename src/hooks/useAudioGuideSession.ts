import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setAudioModeAsync } from "expo-audio";
import * as Speech from "expo-speech";
import type { ChapterGuide } from "../data/library";
import {
  getPlaybackSpeed,
  setPlaybackSpeed as persistPlaybackSpeed,
} from "../services/listeningProgress";

/** Approximate speaking duration for a line at 1.0x (~145 wpm). */
export function estimateLineSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2.5, (words / 145) * 60);
}

export function estimateGuideDuration(script: string[]): number {
  return Math.ceil(
    script.reduce((sum, line) => sum + estimateLineSeconds(line), 0)
  );
}

type Options = {
  guide: ChapterGuide | undefined;
  chapterKey: string;
};

/**
 * Through the Word–style chapter audio session:
 * play/pause, ±15s, persistent speed, synced narration lines.
 * Uses expo-speech for guide narration (teacher-style recording stand-in)
 * and keeps a transport clock for comics/UI sync.
 */
export function useAudioGuideSession({ guide, chapterKey }: Options) {
  const script = guide?.script ?? [];
  const naturalDuration = useMemo(
    () =>
      script.length
        ? estimateGuideDuration(script)
        : (guide?.durationSeconds ?? 0),
    [guide?.durationSeconds, script]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const playingRef = useRef(false);
  const positionRef = useRef(0);
  const speedRef = useRef(1);
  const lineIndexRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scriptRef = useRef(script);
  const durationRef = useRef(naturalDuration);

  scriptRef.current = script;
  durationRef.current = naturalDuration;

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const stopTransport = useCallback(() => {
    clearTick();
    playingRef.current = false;
    setIsPlaying(false);
    void Speech.stop();
  }, [clearTick]);

  const startTick = useCallback(() => {
    clearTick();
    tickRef.current = setInterval(() => {
      if (!playingRef.current) {
        return;
      }
      positionRef.current += speedRef.current;
      const next = Math.min(durationRef.current, positionRef.current);
      setPosition(Math.floor(next));

      // Keep active line aligned to the transport clock.
      const lines = scriptRef.current;
      let cumulative = 0;
      let index = 0;
      for (let i = 0; i < lines.length; i += 1) {
        const lineDur = estimateLineSeconds(lines[i]);
        if (cumulative + lineDur > positionRef.current) {
          index = i;
          break;
        }
        cumulative += lineDur;
        index = i;
      }
      if (index !== lineIndexRef.current) {
        lineIndexRef.current = index;
        setActiveLineIndex(index);
      }

      if (next >= durationRef.current) {
        stopTransport();
      }
    }, 1000);
  }, [clearTick, stopTransport]);

  const speakLine = useCallback(
    (index: number) => {
      const lines = scriptRef.current;
      if (!playingRef.current || index < 0 || index >= lines.length) {
        return;
      }

      lineIndexRef.current = index;
      setActiveLineIndex(index);

      // Important: call Speech.speak synchronously from the user gesture path
      // (no awaits beforehand) so web speechSynthesis is allowed.
      try {
        Speech.speak(lines[index], {
          rate: Math.min(1.2, Math.max(0.75, speedRef.current)),
          pitch: 1,
          onDone: () => {
            if (!playingRef.current) {
              return;
            }
            if (index + 1 < lines.length) {
              speakLine(index + 1);
            }
          },
          onError: () => {
            // Keep transport running even if TTS is unavailable.
          },
        });
      } catch {
        // Transport clock still advances comics/UI.
      }
    },
    []
  );

  const speakFrom = useCallback(
    (startIndex: number) => {
      const lines = scriptRef.current;
      if (!lines.length) {
        return;
      }

      // Cancel any prior utterance without awaiting (preserve user gesture).
      void Speech.stop();
      clearTick();

      const clamped = Math.max(0, Math.min(lines.length - 1, startIndex));
      lineIndexRef.current = clamped;
      setActiveLineIndex(clamped);

      let offset = 0;
      for (let i = 0; i < clamped; i += 1) {
        offset += estimateLineSeconds(lines[i]);
      }
      positionRef.current = offset;
      setPosition(Math.floor(offset));

      playingRef.current = true;
      setIsPlaying(true);
      startTick();
      speakLine(clamped);
    },
    [clearTick, speakLine, startTick]
  );

  useEffect(() => {
    void (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: "doNotMix",
          allowsRecording: true,
        });
      } catch {
        // Web/native stubs may not support every mode flag.
      }
      const savedSpeed = await getPlaybackSpeed();
      speedRef.current = savedSpeed;
      setSpeed(savedSpeed);
    })();

    return () => {
      stopTransport();
    };
  }, [stopTransport]);

  useEffect(() => {
    // Reset transport only when the chapter changes — not when callback
    // identities refresh — so Play isn't cancelled mid-session.
    stopTransport();
    positionRef.current = 0;
    setPosition(0);
    lineIndexRef.current = 0;
    setActiveLineIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chapterKey only
  }, [chapterKey]);

  const play = useCallback(() => {
    const index =
      positionRef.current >= durationRef.current - 0.5
        ? 0
        : lineIndexRef.current;
    speakFrom(index);
  }, [speakFrom]);

  const pause = useCallback(() => {
    stopTransport();
  }, [stopTransport]);

  const toggle = useCallback(() => {
    if (playingRef.current) {
      pause();
    } else {
      play();
    }
  }, [pause, play]);

  const seekTo = useCallback(
    (seconds: number) => {
      const target = Math.min(durationRef.current, Math.max(0, seconds));
      positionRef.current = target;
      setPosition(Math.floor(target));

      const lines = scriptRef.current;
      let cumulative = 0;
      let index = 0;
      for (let i = 0; i < lines.length; i += 1) {
        const lineDur = estimateLineSeconds(lines[i]);
        if (cumulative + lineDur > target) {
          index = i;
          break;
        }
        cumulative += lineDur;
        index = i;
      }
      lineIndexRef.current = index;
      setActiveLineIndex(index);

      if (playingRef.current) {
        speakFrom(index);
      }
    },
    [speakFrom]
  );

  const skip = useCallback(
    (deltaSeconds: number) => {
      seekTo(positionRef.current + deltaSeconds);
    },
    [seekTo]
  );

  const seekToLine = useCallback(
    (lineIndex: number) => {
      speakFrom(lineIndex);
    },
    [speakFrom]
  );

  const cycleSpeed = useCallback(() => {
    const options = [0.75, 1, 1.25, 1.5, 1.75];
    const currentIndex = options.findIndex(
      (value) => Math.abs(value - speedRef.current) < 0.01
    );
    const next = options[(currentIndex + 1) % options.length];
    speedRef.current = next;
    setSpeed(next);
    void persistPlaybackSpeed(next);
    if (playingRef.current) {
      speakFrom(lineIndexRef.current);
    }
  }, [speakFrom]);

  return {
    isPlaying,
    position,
    duration: naturalDuration,
    speed,
    activeLineIndex,
    toggle,
    play,
    pause,
    skip,
    seekTo,
    seekToLine,
    cycleSpeed,
    stop: stopTransport,
  };
}
