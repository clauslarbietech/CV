import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BibleSource } from "../types/bibleSource";

const SELECTED_KEY = "bible:selected-source";
const COLLECTED_KEY = "bible:collected-version-ids";

export async function loadSelectedBibleSource(): Promise<BibleSource | null> {
  try {
    const raw = await AsyncStorage.getItem(SELECTED_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as BibleSource;
  } catch {
    return null;
  }
}

export async function saveSelectedBibleSource(
  source: BibleSource
): Promise<void> {
  try {
    await AsyncStorage.setItem(SELECTED_KEY, JSON.stringify(source));
  } catch {
    // ignore
  }
}

export async function loadCollectedVersionIds(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(COLLECTED_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as number[];
    return Array.isArray(parsed) ? parsed.filter((n) => Number.isFinite(n)) : [];
  } catch {
    return [];
  }
}

export async function toggleCollectedVersionId(
  versionId: number
): Promise<number[]> {
  const current = await loadCollectedVersionIds();
  const next = current.includes(versionId)
    ? current.filter((id) => id !== versionId)
    : [...current, versionId];
  try {
    await AsyncStorage.setItem(COLLECTED_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}
