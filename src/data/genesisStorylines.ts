/**
 * Genesis storyline catalog for Anime Audio Bible webtoon browsing.
 * Entries with hasArt map to illustrated storylines; others are placeholders.
 */

import type { GenesisArc } from "./genesisChapters";
import { getGenesisChapter } from "./genesisChapters";

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

/** Key illustrated arcs across Genesis 4–45 (Ken-Burns webtoon packs). */
const GENESIS_ARC_STORYLINES: StorylineCatalogEntry[] = [
  {
    id: "genesis-4-cain-abel",
    bookId: "genesis",
    chapterNumber: 4,
    storylineId: "cain-abel",
    title: "Cain and Abel",
    subtitle: "Two brothers bring offerings — and jealousy rises",
    arc: "Fall",
    hasArt: true,
    panelCount: 2,
  },
  {
    id: "genesis-6-noah-ark",
    bookId: "genesis",
    chapterNumber: 6,
    storylineId: "noah-ark",
    title: "Noah Builds the Ark",
    subtitle: "When the earth was filled with violence, God made a way",
    arc: "Flood",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-7-the-flood",
    bookId: "genesis",
    chapterNumber: 7,
    storylineId: "the-flood",
    title: "The Flood Waters Rise",
    subtitle: "Rain falls — and the ark carries life through the storm",
    arc: "Flood",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-9-rainbow",
    bookId: "genesis",
    chapterNumber: 9,
    storylineId: "rainbow-covenant",
    title: "The Rainbow Covenant",
    subtitle: "God sets a sign in the clouds — a promise of mercy",
    arc: "Flood",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-11-babel",
    bookId: "genesis",
    chapterNumber: 11,
    storylineId: "babel",
    title: "The Tower of Babel",
    subtitle: "One language, one city — then scattered across the earth",
    arc: "Nations",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-12-call",
    bookId: "genesis",
    chapterNumber: 12,
    storylineId: "call-of-abraham",
    title: "The Call of Abraham",
    subtitle: "Go to the land I will show you — and I will bless you",
    arc: "Abraham",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-15-covenant",
    bookId: "genesis",
    chapterNumber: 15,
    storylineId: "covenant-stars",
    title: "Stars Without Number",
    subtitle: "Abram believes the Lord — and it is counted as righteousness",
    arc: "Abraham",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-21-isaac-born",
    bookId: "genesis",
    chapterNumber: 21,
    storylineId: "isaac-born",
    title: "Isaac Is Born",
    subtitle: "The promised son arrives — laughter becomes joy",
    arc: "Isaac",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-22-moriah",
    bookId: "genesis",
    chapterNumber: 22,
    storylineId: "moriah",
    title: "On Mount Moriah",
    subtitle: "Abraham and Isaac climb — and God provides",
    arc: "Isaac",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-25-birthright",
    bookId: "genesis",
    chapterNumber: 25,
    storylineId: "birthright",
    title: "Stew for a Birthright",
    subtitle: "Esau and Jacob — hunger, haste, and a costly trade",
    arc: "Jacob",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-28-bethel",
    bookId: "genesis",
    chapterNumber: 28,
    storylineId: "bethel",
    title: "Jacob’s Dream at Bethel",
    subtitle: "A ladder between earth and heaven — and a promise repeated",
    arc: "Jacob",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-37-coat",
    bookId: "genesis",
    chapterNumber: 37,
    storylineId: "joseph-coat",
    title: "The Coat and the Caravan",
    subtitle: "Favored son, bitter brothers — and a road toward Egypt",
    arc: "Joseph",
    hasArt: true,
    panelCount: 2,
  },
  {
    id: "genesis-38-judah-tamar",
    bookId: "genesis",
    chapterNumber: 38,
    storylineId: "judah-tamar",
    title: "Judah and Tamar",
    subtitle: "A broken family line — and a surprising turn toward mercy",
    arc: "Joseph",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-39-potiphar",
    bookId: "genesis",
    chapterNumber: 39,
    storylineId: "potiphar",
    title: "In Potiphar’s House",
    subtitle: "Joseph serves in Egypt — and the Lord is with him",
    arc: "Joseph",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-41-dreams",
    bookId: "genesis",
    chapterNumber: 41,
    storylineId: "pharaoh-dreams",
    title: "Pharaoh’s Dreams",
    subtitle: "Grain and cattle — Joseph speaks wisdom before the throne",
    arc: "Joseph",
    hasArt: true,
    panelCount: 1,
  },
  {
    id: "genesis-45-reunion",
    bookId: "genesis",
    chapterNumber: 45,
    storylineId: "reunion",
    title: "Joseph Revealed",
    subtitle: "Tears, forgiveness, and a family made whole again",
    arc: "Joseph",
    hasArt: true,
    panelCount: 1,
  },
];

const ILLUSTRATED_CHAPTERS = new Set(
  [
    ...GENESIS_1_DAY_STORYLINES,
    GENESIS_2_EVE,
    GENESIS_3_FALL,
    ...GENESIS_ARC_STORYLINES,
  ].map((entry) => entry.chapterNumber)
);

function placeholderForChapter(n: number): StorylineCatalogEntry {
  const meta = getGenesisChapter(n);
  if (!meta) {
    throw new Error(`Missing Genesis chapter metadata for chapter ${n}`);
  }
  return {
    id: `genesis-${n}-ch-${n}`,
    bookId: "genesis",
    chapterNumber: n,
    storylineId: `ch-${n}`,
    title: meta.title,
    subtitle: meta.summary,
    arc: meta.arc,
    hasArt: false,
    panelCount: 0,
  };
}

/** Full-book storyline catalog: illustrated chunks + chapter placeholders. */
export const GENESIS_STORYLINES: StorylineCatalogEntry[] = [
  ...GENESIS_1_DAY_STORYLINES,
  GENESIS_2_EVE,
  GENESIS_3_FALL,
  ...GENESIS_ARC_STORYLINES,
  // Remaining chapters 4–50 without dedicated art packs
  ...Array.from({ length: 47 }, (_, i) => i + 4)
    .filter((n) => !ILLUSTRATED_CHAPTERS.has(n))
    .map(placeholderForChapter),
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
