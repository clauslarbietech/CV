import { LEARNING_DOMAINS, type LearningDomainId, type ScienceTier } from "./science";
import type { DomainRating } from "./learning-profile";

export type LiteracyActivity = {
  id: string;
  title: string;
  detail: string;
  domain: LearningDomainId;
  skill: string;
  tier: ScienceTier;
  href: string;
  audience: "kids" | "adult" | "all";
  why: string;
};

/** Canonical Structured Literacy + assistive activity map */
export const LITERACY_ACTIVITIES: LiteracyActivity[] = [
  {
    id: "sound-quest",
    title: "Sound Quest",
    detail: "Hear and identify phonemes in words",
    domain: "sounds",
    skill: "phonemic",
    tier: "evidence-based",
    href: "/games?skill=phonemic",
    audience: "all",
    why: "Phonological awareness is a core Structured Literacy foundation.",
  },
  {
    id: "letter-match",
    title: "Letter Match",
    detail: "Connect letters to sounds (b/d, p/q)",
    domain: "letters",
    skill: "mapping",
    tier: "evidence-based",
    href: "/games?skill=mapping",
    audience: "all",
    why: "Explicit sound–symbol mapping supports decoding.",
  },
  {
    id: "word-builder",
    title: "Word Builder",
    detail: "Build words from sounds and letters",
    domain: "words",
    skill: "decoding",
    tier: "evidence-based",
    href: "/games?skill=decoding",
    audience: "all",
    why: "Decoding practice reduces whole-word guessing.",
  },
  {
    id: "nonsense-decode",
    title: "Nonsense Decode",
    detail: "Sound out made-up words",
    domain: "words",
    skill: "decoding",
    tier: "evidence-based",
    href: "/games?skill=nonsense",
    audience: "all",
    why: "Nonsense words force phonics instead of memorized guessing.",
  },
  {
    id: "word-parts",
    title: "Word Parts",
    detail: "Build words from prefixes, roots & suffixes",
    domain: "word-parts",
    skill: "morphology",
    tier: "evidence-based",
    href: "/games?skill=morphology",
    audience: "all",
    why: "Morphology is especially valuable for older children and adults.",
  },
  {
    id: "syllable-split",
    title: "Syllable Split",
    detail: "Break words into syllable chunks",
    domain: "word-parts",
    skill: "syllables",
    tier: "evidence-based",
    href: "/games?skill=syllables",
    audience: "all",
    why: "Syllable division is part of explicit Structured Literacy instruction.",
  },
  {
    id: "spelling-lab",
    title: "Spelling Lab",
    detail: "Encode sounds into written words",
    domain: "spelling",
    skill: "spelling",
    tier: "evidence-based",
    href: "/games?skill=spelling",
    audience: "all",
    why: "Spelling patterns taught explicitly alongside phonics.",
  },
  {
    id: "reader-flow",
    title: "Reader Flow",
    detail: "Repeated reading for accuracy and ease",
    domain: "fluency",
    skill: "fluency",
    tier: "evidence-informed",
    href: "/games?skill=fluency",
    audience: "all",
    why: "Repeated reading supports automaticity without punishing slow pace.",
  },
  {
    id: "scan-listen",
    title: "Scan → Listen",
    detail: "Capture text and hear it with highlights",
    domain: "listening",
    skill: "listening",
    tier: "evidence-informed",
    href: "/scan",
    audience: "adult",
    why: "Text-to-speech shows modest comprehension benefits in meta-analyses.",
  },
  {
    id: "simplify",
    title: "Simplify",
    detail: "Make difficult text easier to read",
    domain: "comprehension",
    skill: "comprehension",
    tier: "evidence-informed",
    href: "/simplify",
    audience: "adult",
    why: "Assistive presentation supports access; results vary by learner.",
  },
  {
    id: "memory-lab",
    title: "Memory Lab",
    detail: "Focus and working memory practice",
    domain: "working-memory",
    skill: "working-memory",
    tier: "evidence-informed",
    href: "/train",
    audience: "all",
    why: "Supports focus separately—not marketed as dyslexia treatment.",
  },
];

export function activitiesForDomain(domain: LearningDomainId): LiteracyActivity[] {
  return LITERACY_ACTIVITIES.filter((a) => a.domain === domain);
}

export function recommendActivities(
  focusDomains: LearningDomainId[],
  mode: "kids" | "adult",
  limit = 3,
): LiteracyActivity[] {
  const picks: LiteracyActivity[] = [];
  const seen = new Set<string>();

  for (const domain of focusDomains) {
    for (const activity of activitiesForDomain(domain)) {
      if (activity.audience !== "all" && activity.audience !== mode) continue;
      if (seen.has(activity.id)) continue;
      picks.push(activity);
      seen.add(activity.id);
      if (picks.length >= limit) return picks;
    }
  }

  // Fallback: evidence-based phonics path
  for (const activity of LITERACY_ACTIVITIES) {
    if (activity.tier !== "evidence-based") continue;
    if (activity.audience !== "all" && activity.audience !== mode) continue;
    if (seen.has(activity.id)) continue;
    picks.push(activity);
    seen.add(activity.id);
    if (picks.length >= limit) break;
  }

  return picks;
}

export function domainLabel(id: LearningDomainId): string {
  return LEARNING_DOMAINS.find((d) => d.id === id)?.label ?? id;
}

export function rankedFocusFromRatings(ratings: DomainRating[]): LearningDomainId[] {
  return ratings
    .filter((r) => r.status === "growing" || r.status === "exploring")
    .sort((a, b) => a.stars - b.stars)
    .map((r) => r.id);
}
