import {
  GENESIS_CHAPTERS,
  type GenesisChapterMeta,
} from "./genesisChapters";
import {
  buildGenesisComicPanels,
  buildGenesisGuideScript,
} from "./genesisChapterSlides";
import {
  EXODUS_CHAPTERS,
  type ExodusChapterMeta,
} from "./exodusChapters";
import {
  buildExodusComicPanels,
  buildExodusGuideScript,
} from "./exodusChapterSlides";
import { BRAND } from "../content/brand";

export type ComicPanel = {
  id: string;
  title: string;
  caption: string;
  image: number;
  scriptureRef?: string;
};

export type ChapterGuide = {
  title: string;
  narrator: string;
  durationSeconds: number;
  /** Short audio-guide style narration script (TTW-inspired). */
  script: string[];
};

export type BibleChapter = {
  number: number;
  title: string;
  passageQuery: string;
  guide: ChapterGuide;
  panels: ComicPanel[];
};

export type BibleBook = {
  id: string;
  name: string;
  abbreviation: string;
  testament: "OT" | "NT";
  days: number;
  tagline: string;
  cover: number;
  chapters: BibleChapter[];
};

export type Journey = {
  id: string;
  number: number;
  title: string;
  booksLabel: string;
  days: number;
  cover: number;
  bookIds: string[];
  /** Chapter to open when this journey is started. */
  startChapter: number;
  /** Last chapter in this journey (inclusive). Defaults to startChapter. */
  endChapter?: number;
};

const day1 = require("../../assets/panels/genesis-day1-light.jpg");
const genesisCover = require("../../assets/covers/genesis.jpg");
const exodusCover = require("../../assets/covers/exodus.jpg");
const journeyStart = require("../../assets/journeys/start.jpg");
const journeyExodus = require("../../assets/journeys/exodus-start.jpg");
const exodusSea = require("../../assets/panels/arc-exodus-deliverance.jpg");
const exodusSinai = require("../../assets/panels/arc-exodus-sinai.jpg");

function buildGenesisGuide(meta: GenesisChapterMeta): ChapterGuide {
  const script = buildGenesisGuideScript(meta);
  return {
    title: meta.title,
    narrator: BRAND.audioGuideLabel,
    durationSeconds: Math.max(420, script.length * 18),
    script,
  };
}

function buildExodusGuide(meta: ExodusChapterMeta): ChapterGuide {
  const script = buildExodusGuideScript(meta);
  return {
    title: meta.title,
    narrator: BRAND.audioGuideLabel,
    durationSeconds: Math.max(420, script.length * 18),
    script,
  };
}

const genesisChapters: BibleChapter[] = GENESIS_CHAPTERS.map((meta) => ({
  number: meta.number,
  title: meta.title,
  passageQuery: meta.passageQuery,
  guide: buildGenesisGuide(meta),
  panels: buildGenesisComicPanels(meta.number),
}));

const exodusChapters: BibleChapter[] = EXODUS_CHAPTERS.map((meta) => ({
  number: meta.number,
  title: meta.title,
  passageQuery: meta.passageQuery,
  guide: buildExodusGuide(meta),
  panels: buildExodusComicPanels(meta.number),
}));

export const BOOKS: BibleBook[] = [
  {
    id: "genesis",
    name: "Genesis",
    abbreviation: "Ge",
    testament: "OT",
    days: 50,
    tagline: "Beginnings — creation through Joseph · all 50 chapters · ESV",
    cover: genesisCover,
    chapters: genesisChapters,
  },
  {
    id: "exodus",
    name: "Exodus",
    abbreviation: "Ex",
    testament: "OT",
    days: 40,
    tagline: "Deliverance — from Egypt to the glory of the tent · all 40 chapters · ESV",
    cover: exodusCover,
    chapters: exodusChapters,
  },
];

export const JOURNEYS: Journey[] = [
  {
    id: "journey-genesis",
    number: 1,
    title: "Genesis",
    booksLabel: "All 50 chapters · ESV",
    days: 50,
    cover: journeyStart,
    bookIds: ["genesis"],
    startChapter: 1,
    endChapter: 50,
  },
  {
    id: "journey-creation",
    number: 2,
    title: "Creation Week",
    booksLabel: "Genesis 1–2 · illustrated",
    days: 8,
    cover: day1,
    bookIds: ["genesis"],
    startChapter: 1,
    endChapter: 2,
  },
  {
    id: "journey-promise",
    number: 3,
    title: "Promise & Family",
    booksLabel: "Abraham → Joseph",
    days: 39,
    cover: genesisCover,
    bookIds: ["genesis"],
    startChapter: 12,
    endChapter: 50,
  },
  {
    id: "journey-exodus",
    number: 4,
    title: "Exodus",
    booksLabel: "All 40 chapters · ESV",
    days: 40,
    cover: journeyExodus,
    bookIds: ["exodus"],
    startChapter: 1,
    endChapter: 40,
  },
  {
    id: "journey-deliverance",
    number: 5,
    title: "Out of Egypt",
    booksLabel: "Exodus 1–15 · deliverance",
    days: 15,
    cover: exodusSea,
    bookIds: ["exodus"],
    startChapter: 1,
    endChapter: 15,
  },
  {
    id: "journey-sinai",
    number: 6,
    title: "Sinai & Dwelling",
    booksLabel: "Exodus 16–40 · covenant",
    days: 25,
    cover: exodusSinai,
    bookIds: ["exodus"],
    startChapter: 16,
    endChapter: 40,
  },
];

export const FEATURED_BOOK_ID = "genesis";

/** Illustrated books featured on Browse (same UX; Genesis is the template). */
export const FEATURED_BOOK_IDS = ["genesis", "exodus"] as const;

export function getBook(bookId: string): BibleBook | undefined {
  return BOOKS.find((book) => book.id === bookId);
}

export function getJourney(journeyId: string): Journey | undefined {
  return JOURNEYS.find((journey) => journey.id === journeyId);
}

export function getJourneyChapterRange(journey: Journey): {
  start: number;
  end: number;
} {
  return {
    start: journey.startChapter,
    end: journey.endChapter ?? journey.startChapter,
  };
}

export function getJourneyChapters(
  journey: Journey,
  bookId?: string
): BibleChapter[] {
  const id = bookId ?? journey.bookIds[0];
  const book = getBook(id);
  if (!book) {
    return [];
  }
  const { start, end } = getJourneyChapterRange(journey);
  return book.chapters.filter(
    (chapter) => chapter.number >= start && chapter.number <= end
  );
}

export function getChapter(
  bookId: string,
  chapterNumber: number
): BibleChapter | undefined {
  return getBook(bookId)?.chapters.find(
    (chapter) => chapter.number === chapterNumber
  );
}

/** Books with full illustrated Guide + arc cards (same UX everywhere). */
export function isIllustratedBook(bookId: string): boolean {
  return bookId === "genesis" || bookId === "exodus";
}

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
