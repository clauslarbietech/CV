import {
  DEFAULT_EXPERIENCE,
  DEFAULT_PROFILE,
  type ExerciseAttempt,
  type HeroProfile,
  type LibraryItem,
  type PerformanceEvent,
  type PracticeSummary,
} from "./types";
import { recordAssistiveUse } from "./learning-profile";

const KEYS = {
  profile: "hero-profile-v1",
  library: "hero-library-v1",
  attempts: "hero-attempts-v1",
  events: "hero-events-v1",
  summary: "hero-summary-v1",
} as const;

const CHANGE = "hero-store-change";

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE));
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
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
  const raw = readJson(KEYS.profile, DEFAULT_PROFILE);
  return {
    ...DEFAULT_PROFILE,
    ...raw,
    experience: { ...DEFAULT_EXPERIENCE, ...raw.experience },
    accessibility: { ...DEFAULT_PROFILE.accessibility, ...raw.accessibility },
    tts: { ...DEFAULT_PROFILE.tts, ...raw.tts },
    learning: { ...DEFAULT_PROFILE.learning, ...raw.learning },
  };
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
  return readJson<LibraryItem[]>(KEYS.library, []);
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
  return readJson<PracticeSummary>(KEYS.summary, {
    totalSessions: 0,
    totalMinutes: 0,
    activitiesCompleted: 0,
    lastActiveDate: null,
    daysActiveThisWeek: 0,
  });
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
  const attempts = readJson<ExerciseAttempt[]>(KEYS.attempts, []);
  const attempt: ExerciseAttempt = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  writeJson(KEYS.attempts, [attempt, ...attempts].slice(0, 200));

  const events = readJson<PerformanceEvent[]>(KEYS.events, []);
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
  const events = readJson<PerformanceEvent[]>(KEYS.events, []).slice(0, 12);
  if (events.length < 4) return "easy";
  const rate = events.filter((e) => e.correct).length / events.length;
  if (rate > 0.75) return "medium";
  if (rate > 0.55) return "easy";
  return "easy";
}

export function getProfileEvents(): PerformanceEvent[] {
  return readJson<PerformanceEvent[]>(KEYS.events, []);
}

export function useHeroStore<T>(selector: () => T, serverFallback: T): T {
  // helper for components — actual hook in components via useSyncExternalStore
  if (typeof window === "undefined") return serverFallback;
  return selector();
}
