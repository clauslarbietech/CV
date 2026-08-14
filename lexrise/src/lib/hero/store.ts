import {
  DEFAULT_EXPERIENCE,
  DEFAULT_PROFILE,
  type ExerciseAttempt,
  type HeroProfile,
  type LibraryItem,
  type PerformanceEvent,
  type PracticeSummary,
} from "./types";

export type AssistiveLog = {
  scans: number;
  listenSessions: number;
  readerSessions: number;
  librarySaves: number;
};

const KEYS = {
  profile: "hero-profile-v1",
  library: "hero-library-v1",
  attempts: "hero-attempts-v1",
  events: "hero-events-v1",
  summary: "hero-summary-v1",
  assistive: "hero-assistive-v1",
} as const;

const CHANGE = "hero-store-change";

const EMPTY_SUMMARY: PracticeSummary = {
  totalSessions: 0,
  totalMinutes: 0,
  activitiesCompleted: 0,
  lastActiveDate: null,
  daysActiveThisWeek: 0,
};

const EMPTY_LIBRARY: LibraryItem[] = [];
const EMPTY_EVENTS: PerformanceEvent[] = [];
const EMPTY_ATTEMPTS: ExerciseAttempt[] = [];

const EMPTY_ASSISTIVE: AssistiveLog = {
  scans: 0,
  listenSessions: 0,
  readerSessions: 0,
  librarySaves: 0,
};

/** Stable snapshots for useSyncExternalStore — must keep reference equality until data changes */
const jsonSnapshotCache = new Map<string, { raw: string | null; value: unknown }>();
let mergedProfileCache: { raw: string | null; profile: HeroProfile } | null = null;
let assistiveCache: { raw: string | null; log: AssistiveLog } | null = null;

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE));
}

function bustSnapshot(key: string) {
  jsonSnapshotCache.delete(key);
  if (key === KEYS.profile) mergedProfileCache = null;
  if (key === KEYS.assistive) assistiveCache = null;
}


function readJsonSnapshot<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return fallback;
  }

  const cached = jsonSnapshotCache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: T;
  if (!raw) {
    value = fallback;
  } else {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }

  jsonSnapshotCache.set(key, { raw, value });
  return value;
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  bustSnapshot(key);
  emit();
}

export function subscribeHero(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getProfile(): HeroProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEYS.profile);
  } catch {
    return DEFAULT_PROFILE;
  }

  if (mergedProfileCache && mergedProfileCache.raw === raw) {
    return mergedProfileCache.profile;
  }

  const parsed = raw ? (JSON.parse(raw) as Partial<HeroProfile>) : {};
  const profile: HeroProfile = {
    ...DEFAULT_PROFILE,
    ...parsed,
    experience: { ...DEFAULT_EXPERIENCE, ...parsed.experience },
    accessibility: { ...DEFAULT_PROFILE.accessibility, ...parsed.accessibility },
    tts: { ...DEFAULT_PROFILE.tts, ...parsed.tts },
    learning: { ...DEFAULT_PROFILE.learning, ...parsed.learning },
  };

  mergedProfileCache = { raw, profile };
  return profile;
}

export function saveProfile(patch: Partial<HeroProfile>) {
  const current = getProfile();
  writeJson(KEYS.profile, {
    ...current,
    ...patch,
    experience: { ...current.experience, ...patch.experience },
    accessibility: patch.accessibility ? { ...current.accessibility, ...patch.accessibility } : current.accessibility,
  });
}

export function markIntroSeen() {
  const current = getProfile();
  saveProfile({
    experience: {
      ...current.experience,
      introSeenOnce: true,
      lastIntroAt: new Date().toISOString(),
    },
  });
}

/** Full letter-by-letter cinematic only on the very first visit */
export function shouldPlayFullIntro(): boolean {
  const { experience } = getProfile();
  if (experience.skipIntro || experience.reduceMotion) return false;
  return !experience.introSeenOnce;
}

/** Skip intro on return visits the same day, when disabled, or with reduce motion */
export function shouldSkipIntroEntirely(): boolean {
  const { experience } = getProfile();
  if (experience.skipIntro) return true;
  if (experience.introSeenOnce && experience.reduceMotion) return true;
  const today = new Date().toISOString().slice(0, 10);
  if (experience.introSeenOnce && experience.lastIntroAt?.slice(0, 10) === today) return true;
  return false;
}

export function updateExperience(patch: Partial<HeroProfile["experience"]>) {
  const current = getProfile();
  saveProfile({ experience: { ...current.experience, ...patch } });
}

export function completeOnboarding(profile: Partial<HeroProfile>) {
  saveProfile({ ...profile, onboardingComplete: true });
}

export function getLibrary(): LibraryItem[] {
  return readJsonSnapshot(KEYS.library, EMPTY_LIBRARY);
}

export function getLibraryItem(id: string): LibraryItem | undefined {
  return getLibrary().find((item) => item.id === id);
}

export function saveLibraryItem(item: Omit<LibraryItem, "id" | "createdAt"> & { id?: string }) {
  const list = getLibrary();
  const entry: LibraryItem = {
    id: item.id ?? crypto.randomUUID(),
    title: item.title,
    text: item.text,
    source: item.source,
    createdAt: new Date().toISOString(),
  };
  writeJson(KEYS.library, [entry, ...list.filter((x) => x.id !== entry.id)]);
  recordAssistiveUse("librarySaves");
  return entry;
}

export function getSummary(): PracticeSummary {
  return readJsonSnapshot(KEYS.summary, EMPTY_SUMMARY);
}

function weekDates() {
  const days: string[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function recordActivity(minutes = 3) {
  const summary = getSummary();
  const today = new Date().toISOString().slice(0, 10);
  const activeDays = new Set<string>();
  if (summary.lastActiveDate) activeDays.add(summary.lastActiveDate);
  activeDays.add(today);

  writeJson(KEYS.summary, {
    totalSessions: summary.totalSessions + 1,
    totalMinutes: summary.totalMinutes + minutes,
    activitiesCompleted: summary.activitiesCompleted + 1,
    lastActiveDate: today,
    daysActiveThisWeek: weekDates().filter((d) => activeDays.has(d)).length,
  });
}

export function recordAttempt(input: Omit<ExerciseAttempt, "id" | "createdAt">) {
  const attempts = readJsonSnapshot(KEYS.attempts, EMPTY_ATTEMPTS);
  const attempt: ExerciseAttempt = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  writeJson(KEYS.attempts, [attempt, ...attempts].slice(0, 200));

  const events = getProfileEvents();
  const event: PerformanceEvent = {
    id: attempt.id,
    skill: input.skill,
    exerciseId: input.exerciseId,
    correct: input.correct,
    responseMs: input.responseMs,
    hintsUsed: input.hintsUsed,
    timestamp: attempt.createdAt,
  };
  writeJson(KEYS.events, [event, ...events].slice(0, 500));
  recordActivity();
  return attempt;
}

export function suggestDifficulty(): "easy" | "medium" | "hard" {
  const events = getProfileEvents().slice(0, 12);
  if (events.length < 4) return "easy";
  const rate = events.filter((e) => e.correct).length / events.length;
  if (rate > 0.75) return "medium";
  if (rate > 0.55) return "easy";
  return "easy";
}

export function getProfileEvents(): PerformanceEvent[] {
  return readJsonSnapshot(KEYS.events, EMPTY_EVENTS);
}

export function getAssistiveLog(): AssistiveLog {
  if (typeof window === "undefined") return EMPTY_ASSISTIVE;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEYS.assistive);
  } catch {
    return EMPTY_ASSISTIVE;
  }

  if (assistiveCache && assistiveCache.raw === raw) return assistiveCache.log;

  const parsed = raw ? (JSON.parse(raw) as Partial<AssistiveLog>) : {};
  const log: AssistiveLog = { ...EMPTY_ASSISTIVE, ...parsed };
  assistiveCache = { raw, log };
  return log;
}

export function recordAssistiveUse(kind: keyof AssistiveLog) {
  if (typeof window === "undefined") return;
  const current = getAssistiveLog();
  writeJson(KEYS.assistive, { ...current, [kind]: current[kind] + 1 });
}

export function useHeroStore<T>(selector: () => T, serverFallback: T): T {
  if (typeof window === "undefined") return serverFallback;
  return selector();
}
