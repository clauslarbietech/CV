import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";

const VOICE_KEY = "speech:voice-id:v1";
const RATE_KEY = "speech:rate:v1";

/** Speeds shown on Bible Slow / Speed controls. */
export const SPEECH_RATES = [0.7, 0.85, 1, 1.15, 1.3] as const;

export type SpeechVoiceOption = {
  identifier: string;
  name: string;
  language: string;
};

export type SpeechPreferences = {
  voiceId: string | null;
  rate: number;
};

const DEFAULT_PREFS: SpeechPreferences = {
  voiceId: null,
  rate: 0.85,
};

export async function loadSpeechPreferences(): Promise<SpeechPreferences> {
  try {
    const [voiceRaw, rateRaw] = await AsyncStorage.multiGet([VOICE_KEY, RATE_KEY]);
    const voiceId = voiceRaw[1]?.trim() || null;
    const rateNum = rateRaw[1] ? Number(rateRaw[1]) : DEFAULT_PREFS.rate;
    const rate =
      Number.isFinite(rateNum) && rateNum > 0 ? rateNum : DEFAULT_PREFS.rate;
    return { voiceId, rate };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export async function saveSpeechVoiceId(voiceId: string | null): Promise<void> {
  if (!voiceId) {
    await AsyncStorage.removeItem(VOICE_KEY);
    return;
  }
  await AsyncStorage.setItem(VOICE_KEY, voiceId);
}

export async function saveSpeechRate(rate: number): Promise<void> {
  await AsyncStorage.setItem(RATE_KEY, String(rate));
}

export function nextSpeechRate(current: number, direction: -1 | 1): number {
  const list = [...SPEECH_RATES];
  let index = list.findIndex((value) => Math.abs(value - current) < 0.01);
  if (index < 0) {
    index = list.findIndex((value) => value >= current);
    if (index < 0) {
      index = list.length - 1;
    }
  }
  const next = Math.min(list.length - 1, Math.max(0, index + direction));
  return list[next];
}

export function formatSpeechRate(rate: number): string {
  if (Math.abs(rate - 1) < 0.01) {
    return "1x";
  }
  return `${rate.toFixed(2).replace(/0$/, "").replace(/\.$/, "")}x`;
}

/** Prefer English voices first, then by display name. */
export async function listSpeechVoices(): Promise<SpeechVoiceOption[]> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices
      .map((voice) => ({
        identifier: voice.identifier,
        name: voice.name || voice.identifier,
        language: voice.language,
      }))
      .sort((a, b) => {
        const aEn = a.language.toLowerCase().startsWith("en") ? 0 : 1;
        const bEn = b.language.toLowerCase().startsWith("en") ? 0 : 1;
        if (aEn !== bEn) {
          return aEn - bEn;
        }
        return a.name.localeCompare(b.name);
      });
  } catch {
    return [];
  }
}

export function speechSpeakOptions(
  prefs: SpeechPreferences
): { voice?: string; rate: number } {
  return {
    rate: Math.min(1.5, Math.max(0.5, prefs.rate)),
    ...(prefs.voiceId ? { voice: prefs.voiceId } : {}),
  };
}
