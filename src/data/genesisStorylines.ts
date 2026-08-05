/**
 * Genesis storyline catalog for Anime Audio Bible webtoon browsing.
 * Every chapter has scripture-matched story slides (hasArt: true).
 */

import type { GenesisArc } from "./genesisChapters";
import { GENESIS_CHAPTERS, getGenesisChapter } from "./genesisChapters";
import { getGenesisChapterSlides } from "./genesisChapterSlides";

export type StorylineCatalogEntry = {
  id: string;
  bookId: "genesis";
  chapterNumber: number;
  storylineId: string;
  title: string;
  subtitle: string;
  arc: GenesisArc;
  hasArt: boolean;
  panelCount: number;
};

/** Illustrated Genesis 1 creation-day storylines (day-1 … day-7). */
const GENESIS_1_DAY_STORYLINES: StorylineCatalogEntry[] = [
  {
    id: "genesis-1-day-1",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-1",
    title: "Day 1 · Let There Be Light",
    subtitle: "In the beginning — heavens, earth, and the first light",
    arc: "Creation",
    hasArt: true,
    panelCount: 3,
  },
  {
    id: "genesis-1-day-2",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-2",
    title: "Day 2 · The Expanse",
    subtitle: "God separates the waters and names the Heaven",
    arc: "Creation",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-1-day-3",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-3",
    title: "Day 3 · Land and Plants",
    subtitle: "Dry land appears, and the earth brings forth vegetation",
    arc: "Creation",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-1-day-4",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-4",
    title: "Day 4 · Sun, Moon, and Stars",
    subtitle: "Lights in the expanse to rule day and night",
    arc: "Creation",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-1-day-5",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-5",
    title: "Day 5 · Fish and Birds",
    subtitle: "Living creatures fill the waters and the sky",
    arc: "Creation",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-1-day-6",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-6",
    title: "Day 6 · Animals and Humankind",
    subtitle: "Beasts of the earth — and humanity in God’s image",
    arc: "Creation",
    hasArt: true,
    panelCount: 3,
  },
  {
    id: "genesis-1-day-7",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-7",
    title: "Day 7 · God Rests",
    subtitle: "God finishes His work and blesses the seventh day",
    arc: "Creation",
    hasArt: true,
    panelCount: 1,
  },
];

const GENESIS_2_EVE: StorylineCatalogEntry = {
  id: "genesis-2-eve-from-rib",
  bookId: "genesis",
  chapterNumber: 2,
  storylineId: "eve-from-rib",
  title: "Eve from Adam’s Side",
  subtitle: "From deep sleep to one flesh — without shame",
  arc: "Creation",
  hasArt: true,
  panelCount: 3,
};

const GENESIS_3_FALL: StorylineCatalogEntry = {
  id: "genesis-3-the-fall",
  bookId: "genesis",
  chapterNumber: 3,
  storylineId: "the-fall",
  title: "The Fall",
  subtitle: "When trust breaks in the garden",
  arc: "Fall",
  hasArt: true,
  panelCount: 5,
};

function slideStorylineForChapter(n: number): StorylineCatalogEntry {
  const meta = getGenesisChapter(n);
  if (!meta) {
    throw new Error(`Missing Genesis chapter metadata for chapter ${n}`);
  }
  const slides = getGenesisChapterSlides(n);
  return {
    id: `genesis-${n}-slides`,
    bookId: "genesis",
    chapterNumber: n,
    storylineId: `ch-${n}`,
    title: meta.title,
    subtitle: meta.summary,
    arc: meta.arc,
    hasArt: slides.length > 0,
    panelCount: slides.length,
  };
}

const SPECIAL_CHAPTERS = new Set([1, 2, 3]);

/** Full-book storyline catalog: multi-day packs for 1–3 + slides for every chapter. */
export const GENESIS_STORYLINES: StorylineCatalogEntry[] = [
  ...GENESIS_1_DAY_STORYLINES,
  GENESIS_2_EVE,
  GENESIS_3_FALL,
  ...GENESIS_CHAPTERS.filter((meta) => !SPECIAL_CHAPTERS.has(meta.number)).map(
    (meta) => slideStorylineForChapter(meta.number)
  ),
].sort((a, b) => {
  if (a.chapterNumber !== b.chapterNumber) {
    return a.chapterNumber - b.chapterNumber;
  }
  return a.id.localeCompare(b.id);
});

export function getGenesisStoryline(
  chapterNumber: number,
  storylineId?: string
): StorylineCatalogEntry | undefined {
  const matches = GENESIS_STORYLINES.filter(
    (entry) => entry.chapterNumber === chapterNumber
  );
  if (storylineId) {
    return matches.find((entry) => entry.storylineId === storylineId);
  }
  return matches[0];
}

export function listGenesisStorylinesByChapter(
  chapterNumber: number
): StorylineCatalogEntry[] {
  return GENESIS_STORYLINES.filter(
    (entry) => entry.chapterNumber === chapterNumber
  );
}

export function listGenesisStorylinesWithArt(): StorylineCatalogEntry[] {
  return GENESIS_STORYLINES.filter((entry) => entry.hasArt);
}
