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
  return Math.ceil(script.reduce((sum, line) => sum + estimateLineSeconds(line), 0));
}

type Options = {
  guide: ChapterGuide | undefined;
  chapterKey: string;
};

export function useAudioGuideSession({ guide, chapterKey }: Options) {
  const script = guide?.script ?? [];
  const naturalDuration = useMemo(
    () => (script.length ? estimateGuideDuration(script) : guide?.durationSeconds ?? 0),
    [guide?.durationSeconds, script]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const playingRef = useRef(false);
  const positionRef = useRef(0);
  const speedRef = useRef(1);
  const lineIndexRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chapterKeyRef = useRef(chapterKey);

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const stopSpeech = useCallback(async () => {
    clearTick();
    playingRef.current = false;
    setIsPlaying(false);
    await Speech.stop();
  }, [clearTick]);

  const speakFrom = useCallback(
    async (startIndex: number) => {
      if (!script.length) {
        return;
      }

      await Speech.stop();
      clearTick();

      const clamped = Math.max(0, Math.min(script.length - 1, startIndex));
      lineIndexRef.current = clamped;
      setActiveLineIndex(clamped);

      // Align position to the start of the selected line.
      let offset = 0;
      for (let i = 0; i < clamped; i += 1) {
        offset += estimateLineSeconds(script[i]);
      }
      positionRef.current = offset;
      setPosition(Math.floor(offset));

      playingRef.current = true;
      setIsPlaying(true);

      tickRef.current = setInterval(() => {
        if (!playingRef.current) {
          return;
        }
        positionRef.current += speedRef.current;
        const next = Math.min(naturalDuration, positionRef.current);
        setPosition(Math.floor(next));
        if (next >= naturalDuration) {
          void stopSpeech();
        }
      }, 1000);

      const speakLine = (index: number) => {
        if (!playingRef.current || index >= script.length) {
          void stopSpeech();
          return;
        }

        lineIndexRef.current = index;
        setActiveLineIndex(index);

        Speech.speak(script[index], {
          rate: Math.min(1.2, Math.max(0.75, speedRef.current)),
          pitch: 1,
          onDone: () => {
            if (!playingRef.current) {
              return;
            }
            if (index + 1 < script.length) {
              speakLine(index + 1);
            } else {
              positionRef.current = naturalDuration;
              setPosition(naturalDuration);
              void stopSpeech();
            }
          },
          onStopped: () => {
            // pause / seek handled by callers
          },
          onError: () => {
            void stopSpeech();
          },
        });
      };

      speakLine(clamped);
    },
    [clearTick, naturalDuration, script, stopSpeech]
  );

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
        allowsRecording: true,
      });
      const savedSpeed = await getPlaybackSpeed();
      if (!cancelled) {
        speedRef.current = savedSpeed;
        setSpeed(savedSpeed);
        setIsReady(true);
      }
    }

    void boot();

    return () => {
      cancelled = true;
      void Speech.stop();
      clearTick();
    };
  }, [clearTick]);

  useEffect(() => {
    chapterKeyRef.current = chapterKey;
    void stopSpeech();
    positionRef.current = 0;
    setPosition(0);
    lineIndexRef.current = 0;
    setActiveLineIndex(0);
  }, [chapterKey, stopSpeech]);

  const play = useCallback(() => {
    const index =
      positionRef.current >= naturalDuration - 0.5
        ? 0
        : lineIndexRef.current;
    void speakFrom(index);
  }, [naturalDuration, speakFrom]);

  const pause = useCallback(() => {
    void stopSpeech();
  }, [stopSpeech]);

  const toggle = useCallback(() => {
    if (playingRef.current) {
      pause();
    } else {
      play();
    }
  }, [pause, play]);

  const skip = useCallback(
    (deltaSeconds: number) => {
      const target = Math.min(
        naturalDuration,
        Math.max(0, positionRef.current + deltaSeconds)
      );
      positionRef.current = target;
      setPosition(Math.floor(target));

      let cumulative = 0;
      let index = 0;
      for (let i = 0; i < script.length; i += 1) {
        const lineDur = estimateLineSeconds(script[i]);
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
        void speakFrom(index);
      }
    },
    [naturalDuration, script, speakFrom]
  );

  const cycleSpeed = useCallback(async () => {
    const options = [0.75, 1, 1.25, 1.5, 1.75];
    const currentIndex = options.findIndex(
      (value) => Math.abs(value - speedRef.current) < 0.01
    );
    const next = options[(currentIndex + 1) % options.length];
    speedRef.current = next;
    setSpeed(next);
    await persistPlaybackSpeed(next);
    if (playingRef.current) {
      void speakFrom(lineIndexRef.current);
    }
  }, [speakFrom]);

  return {
    isReady,
    isPlaying,
    position,
    duration: naturalDuration,
    speed,
    activeLineIndex,
    toggle,
    play,
    pause,
    skip,
    cycleSpeed,
    stop: stopSpeech,
  };
}
