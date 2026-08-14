const STORAGE_KEY = "lexrise-practice-v1";

export type PracticeStats = {
  streak: number;
  totalSessions: number;
  lastPracticeDate: string | null;
};

const CHANGE_EVENT = "lexrise-practice-change";

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function yesterdayKey(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getPracticeStats(): PracticeStats {
  if (typeof window === "undefined") {
    return { streak: 0, totalSessions: 0, lastPracticeDate: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { streak: 0, totalSessions: 0, lastPracticeDate: null };
    const parsed = JSON.parse(raw) as PracticeStats;
    return {
      streak: Number(parsed.streak) || 0,
      totalSessions: Number(parsed.totalSessions) || 0,
      lastPracticeDate: parsed.lastPracticeDate ?? null,
    };
  } catch {
    return { streak: 0, totalSessions: 0, lastPracticeDate: null };
  }
}

export function recordPracticeSession(): PracticeStats {
  const current = getPracticeStats();
  const today = todayKey();
  const yesterday = yesterdayKey();

  let streak = current.streak;
  if (current.lastPracticeDate === today) {
    // Already practiced today — keep streak.
  } else if (current.lastPracticeDate === yesterday) {
    streak = Math.max(streak, 1) + 1;
  } else {
    streak = 1;
  }

  const next: PracticeStats = {
    streak,
    totalSessions: current.totalSessions + 1,
    lastPracticeDate: today,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return next;
}

export function subscribePracticeStats(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
