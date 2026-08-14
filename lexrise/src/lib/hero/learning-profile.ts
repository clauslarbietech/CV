import type { PerformanceEvent, PracticeSummary } from "./types";
import {
  LEARNING_DOMAINS,
  SKILL_TO_DOMAIN,
  WELLBEING_METRICS,
  type LearningDomainId,
  type WellbeingMetricId,
} from "./science";

export type DomainRating = {
  id: LearningDomainId;
  label: string;
  detail: string;
  stars: number;
  status: "exploring" | "strength" | "growing";
};

export type WellbeingRating = {
  id: WellbeingMetricId;
  label: string;
  detail: string;
  stars: number;
};

export type AssistiveLog = {
  scans: number;
  listenSessions: number;
  readerSessions: number;
  librarySaves: number;
};

const EMPTY_ASSISTIVE: AssistiveLog = {
  scans: 0,
  listenSessions: 0,
  readerSessions: 0,
  librarySaves: 0,
};

function accuracyToStars(rate: number, sampleSize: number): number {
  if (sampleSize < 2) return 3;
  if (rate >= 0.85) return 5;
  if (rate >= 0.7) return 4;
  if (rate >= 0.55) return 3;
  if (rate >= 0.4) return 2;
  return 2; // floor at 2 — never show 1 star to avoid shame
}

function countToStars(count: number, thresholds: [number, number, number, number]): number {
  if (count === 0) return 3;
  if (count >= thresholds[3]) return 5;
  if (count >= thresholds[2]) return 4;
  if (count >= thresholds[1]) return 3;
  if (count >= thresholds[0]) return 3;
  return 3;
}

function domainStatus(stars: number, hasData: boolean): DomainRating["status"] {
  if (!hasData) return "exploring";
  if (stars >= 4) return "strength";
  return "growing";
}

export function computeDomainRatings(events: PerformanceEvent[]): DomainRating[] {
  const byDomain = new Map<LearningDomainId, { correct: number; total: number }>();

  for (const event of events) {
    const domain = SKILL_TO_DOMAIN[event.skill] ?? (event.skill as LearningDomainId);
    if (!LEARNING_DOMAINS.some((d) => d.id === domain)) continue;
    const bucket = byDomain.get(domain) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (event.correct) bucket.correct += 1;
    byDomain.set(domain, bucket);
  }

  return LEARNING_DOMAINS.map((domain) => {
    const bucket = byDomain.get(domain.id);
    const hasData = Boolean(bucket && bucket.total >= 2);
    const rate = bucket && bucket.total > 0 ? bucket.correct / bucket.total : 0;
    const stars = hasData ? accuracyToStars(rate, bucket!.total) : 3;

    return {
      id: domain.id,
      label: domain.label,
      detail: domain.detail,
      stars,
      status: domainStatus(stars, hasData),
    };
  });
}

export function computeWellbeingRatings(
  summary: PracticeSummary,
  events: PerformanceEvent[],
  assistive: AssistiveLog,
  goalCount: number,
): WellbeingRating[] {
  const recent = events.slice(0, 20);
  const accuracy = recent.length ? recent.filter((e) => e.correct).length / recent.length : 0.5;
  const assistiveTotal = assistive.scans + assistive.listenSessions + assistive.readerSessions + assistive.librarySaves;

  const values: Record<WellbeingMetricId, number> = {
    confidence: accuracyToStars(accuracy, recent.length),
    independence: countToStars(assistiveTotal, [1, 3, 6, 10]),
    persistence: countToStars(summary.totalSessions, [2, 5, 10, 20]),
    "assistive-use": countToStars(assistiveTotal, [1, 2, 5, 8]),
    enjoyment: countToStars(summary.activitiesCompleted, [3, 8, 15, 30]),
    "reading-frequency": countToStars(summary.daysActiveThisWeek, [1, 2, 4, 6]),
    goals: goalCount > 0 ? Math.min(5, 3 + Math.min(goalCount, 2)) : 3,
  };

  return WELLBEING_METRICS.map((metric) => ({
    id: metric.id,
    label: metric.label,
    detail: metric.detail,
    stars: values[metric.id],
  }));
}

export function getAssistiveLog(): AssistiveLog {
  if (typeof window === "undefined") return EMPTY_ASSISTIVE;
  try {
    const raw = window.localStorage.getItem("hero-assistive-v1");
    return raw ? { ...EMPTY_ASSISTIVE, ...(JSON.parse(raw) as AssistiveLog) } : EMPTY_ASSISTIVE;
  } catch {
    return EMPTY_ASSISTIVE;
  }
}

export function recordAssistiveUse(kind: keyof AssistiveLog) {
  if (typeof window === "undefined") return;
  const current = getAssistiveLog();
  const next = { ...current, [kind]: current[kind] + 1 };
  window.localStorage.setItem("hero-assistive-v1", JSON.stringify(next));
  window.dispatchEvent(new Event("hero-store-change"));
}

export function suggestFocusDomains(ratings: DomainRating[]): LearningDomainId[] {
  return ratings
    .filter((r) => r.status === "growing" || r.status === "exploring")
    .sort((a, b) => a.stars - b.stars)
    .slice(0, 3)
    .map((r) => r.id);
}
