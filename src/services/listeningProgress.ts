import AsyncStorage from "@react-native-async-storage/async-storage";

const PROGRESS_KEY = "listening:progress:v1";
const SPEED_KEY = "listening:playbackSpeed:v1";
/** Bump to re-zero completed chapters after test/demo progress. */
const ACCOMPLISHMENTS_RESET_KEY = "listening:accomplishments-reset:v2";

export type ChapterProgress = {
  completed: boolean;
  favorite: boolean;
  downloaded: boolean;
  lastPositionSeconds: number;
  reflectionUri?: string;
};

export type BookProgressMap = Record<string, ChapterProgress>;
export type ProgressStore = Record<string, BookProgressMap>;

const DEFAULT_CHAPTER: ChapterProgress = {
  completed: false,
  favorite: false,
  downloaded: false,
  lastPositionSeconds: 0,
};

function chapterKey(chapterNumber: number): string {
  return String(chapterNumber);
}

async function readStore(): Promise<ProgressStore> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return {};
  }
}

async function writeStore(store: ProgressStore): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
}

export async function getChapterProgress(
  bookId: string,
  chapterNumber: number
): Promise<ChapterProgress> {
  const store = await readStore();
  return store[bookId]?.[chapterKey(chapterNumber)] ?? { ...DEFAULT_CHAPTER };
}

export async function getBookProgress(bookId: string): Promise<BookProgressMap> {
  const store = await readStore();
  return store[bookId] ?? {};
}

export async function updateChapterProgress(
  bookId: string,
  chapterNumber: number,
  patch: Partial<ChapterProgress>
): Promise<ChapterProgress> {
  const store = await readStore();
  const book = store[bookId] ?? {};
  const current = book[chapterKey(chapterNumber)] ?? { ...DEFAULT_CHAPTER };
  const next = { ...current, ...patch };
  store[bookId] = { ...book, [chapterKey(chapterNumber)]: next };
  await writeStore(store);
  return next;
}

export async function markPlanDownloaded(bookId: string, chapterNumbers: number[]): Promise<void> {
  const store = await readStore();
  const book = store[bookId] ?? {};
  for (const number of chapterNumbers) {
    const current = book[chapterKey(number)] ?? { ...DEFAULT_CHAPTER };
    book[chapterKey(number)] = { ...current, downloaded: true };
  }
  store[bookId] = book;
  await writeStore(store);
}

/**
 * Clears completed / position so journey % starts at 0 and only rises from
 * real listens. Favorites and downloads are kept.
 */
export async function resetChapterAccomplishments(): Promise<void> {
  const store = await readStore();
  for (const bookId of Object.keys(store)) {
    const book = store[bookId] ?? {};
    for (const key of Object.keys(book)) {
      book[key] = {
        ...book[key],
        completed: false,
        lastPositionSeconds: 0,
      };
    }
    store[bookId] = book;
  }
  await writeStore(store);
}

/** One-time wipe of leftover test progress so Plans shows 0%. */
export async function ensureCleanAccomplishments(): Promise<void> {
  try {
    const already = await AsyncStorage.getItem(ACCOMPLISHMENTS_RESET_KEY);
    if (already === "1") {
      return;
    }
    await resetChapterAccomplishments();
    await AsyncStorage.setItem(ACCOMPLISHMENTS_RESET_KEY, "1");
  } catch {
    // Ignore storage failures; UI will still compute from whatever is saved.
  }
}

export async function getPlaybackSpeed(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(SPEED_KEY);
    if (!raw) {
      return 1;
    }
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 1;
  } catch {
    return 1;
  }
}

export async function setPlaybackSpeed(speed: number): Promise<void> {
  await AsyncStorage.setItem(SPEED_KEY, String(speed));
}

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75] as const;
