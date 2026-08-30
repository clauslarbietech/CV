import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { todayKey } from '@/utils/format';

export type DayLogEntry = {
  id: string;
  date: string;
  text: string;
  /** Seconds of recorded audio (playback may be session-local on web) */
  audioDurationSec?: number;
  createdAt: string;
};

interface DayLogState {
  entries: DayLogEntry[];
  addEntry: (args: {
    text: string;
    audioDurationSec?: number;
    date?: string;
  }) => string;
  removeEntry: (id: string) => void;
  entriesForDate: (date?: string) => DayLogEntry[];
}

export const useDayLogStore = create<DayLogState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: ({ text, audioDurationSec, date = todayKey() }) => {
        const trimmed = text.trim();
        if (!trimmed && !audioDurationSec) return '';
        const id = `log-${Date.now()}`;
        set((state) => ({
          entries: [
            {
              id,
              date,
              text: trimmed || '(Audio day log)',
              audioDurationSec,
              createdAt: new Date().toISOString(),
            },
            ...state.entries,
          ].slice(0, 100),
        }));
        return id;
      },
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      entriesForDate: (date = todayKey()) =>
        get().entries.filter((e) => e.date === date),
    }),
    {
      name: 'fitlife-day-log',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** In-memory audio blobs (web) — not persisted to AsyncStorage. */
const audioBlobs = new Map<string, string>();

export function stashAudioForLog(id: string, objectUrl: string) {
  audioBlobs.set(id, objectUrl);
}

export function getAudioForLog(id: string): string | undefined {
  return audioBlobs.get(id);
}

export function releaseAudioForLog(id: string) {
  const url = audioBlobs.get(id);
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
    audioBlobs.delete(id);
  }
}
