import type { HeroMode } from "./types";
import type { LearningDomainId } from "./science";
import { LITERACY_ACTIVITIES, recommendActivities, rankedFocusFromRatings, type LiteracyActivity } from "./activity-engine";
import type { DomainRating } from "./learning-profile";

export type SessionStep = {
  order: number;
  activity: LiteracyActivity;
  minutes: number;
  instruction: string;
};

/**
 * Structured Literacy session plan:
 * warm-up sounds → mapping → decoding/morphology → fluency/assistive cool-down
 * Explicit sequence rather than random games (OG / Science of Reading aligned).
 */
export function buildPracticeSession(ratings: DomainRating[], mode: HeroMode): SessionStep[] {
  const focus = rankedFocusFromRatings(ratings);
  const seed = focus.length ? focus : (["sounds", "letters", "words"] as LearningDomainId[]);
  const recommended = recommendActivities(seed, mode, 4);

  const preferredOrder = ["sounds", "letters", "words", "word-parts", "spelling", "fluency", "listening"] as LearningDomainId[];
  const sorted = [...recommended].sort((a, b) => preferredOrder.indexOf(a.domain) - preferredOrder.indexOf(b.domain));

  if (!sorted.some((a) => a.domain === "sounds" || a.domain === "words")) {
    const fallback = LITERACY_ACTIVITIES.find((a) => a.id === "sound-quest");
    if (fallback) sorted.unshift(fallback);
  }

  return sorted.slice(0, 3).map((activity, i) => ({
    order: i + 1,
    activity,
    minutes: activity.domain === "fluency" ? 4 : 3,
    instruction: sessionInstruction(activity.domain, mode),
  }));
}

function sessionInstruction(domain: LearningDomainId, mode: HeroMode): string {
  switch (domain) {
    case "sounds":
      return "Warm-up: listen for individual sounds. Say them out loud if you can.";
    case "letters":
      return "Connect each sound to its letter. Take your time—accuracy first.";
    case "words":
      return "Decode carefully. Sound it out; don't guess from the whole word.";
    case "word-parts":
      return mode === "adult"
        ? "Look for meaningful pieces—prefixes, roots, suffixes."
        : "Build the word from its parts, one piece at a time.";
    case "spelling":
      return "Hear the sounds, then write them. Encoding strengthens reading.";
    case "fluency":
      return "Read for ease. You can repeat the passage—speed is not a score.";
    case "listening":
      return "Use your ears. Listening while reading supports comprehension.";
    default:
      return "Practice with focus. Mistakes are information, not failure.";
  }
}

export function sessionMinutes(steps: SessionStep[]): number {
  return steps.reduce((sum, step) => sum + step.minutes, 0);
}
