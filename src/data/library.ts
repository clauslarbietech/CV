import {
  GENESIS_CHAPTERS,
  type GenesisChapterMeta,
} from "./genesisChapters";
import {
  buildGenesisComicPanels,
  buildGenesisGuideScript,
} from "./genesisChapterSlides";

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
};

const day1 = require("../../assets/panels/genesis-day1-light.jpg");
const genesisCover = require("../../assets/covers/genesis.jpg");
const journeyStart = require("../../assets/journeys/start.jpg");

function buildGuide(meta: GenesisChapterMeta): ChapterGuide {
  const script = buildGenesisGuideScript(meta);
  return {
    title: meta.title,
    narrator: "Anime Audio Guide · ESV",
    durationSeconds: Math.max(420, script.length * 18),
    script,
  };
}

function buildPanels(meta: GenesisChapterMeta): ComicPanel[] {
  return buildGenesisComicPanels(meta.number);
}

const genesisChapters: BibleChapter[] = GENESIS_CHAPTERS.map((meta) => ({
  number: meta.number,
  title: meta.title,
  passageQuery: meta.passageQuery,
  guide: buildGuide(meta),
  panels: buildPanels(meta),
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
  },
];

export const FEATURED_BOOK_ID = "genesis";

export function getBook(bookId: string): BibleBook | undefined {
  return BOOKS.find((book) => book.id === bookId);
}

export function getChapter(
  bookId: string,
  chapterNumber: number
): BibleChapter | undefined {
  return getBook(bookId)?.chapters.find(
    (chapter) => chapter.number === chapterNumber
  );
}

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
