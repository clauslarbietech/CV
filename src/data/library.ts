import {
  GENESIS_CHAPTERS,
  type GenesisChapterMeta,
} from "./genesisChapters";

export type ComicPanel = {
  id: string;
  title: string;
  caption: string;
  image: number;
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
};

const day1 = require("../../assets/panels/genesis-day1-light.jpg");
const waters = require("../../assets/panels/genesis-waters-dawn.jpg");
const fallEveBites = require("../../assets/panels/fall-01-eve-bites.jpg");
const fallHandsApple = require("../../assets/panels/fall-02-eve-hands-adam.jpg");
const fallSerpent = require("../../assets/panels/fall-03-serpent-smirk.jpg");
const genesisCover = require("../../assets/covers/genesis.jpg");
const journeyStart = require("../../assets/journeys/start.jpg");

const ARC_THUMBS: Record<string, number> = {
  Creation: day1,
  Fall: fallSerpent,
  Flood: waters,
  Nations: genesisCover,
  Abraham: journeyStart,
  Isaac: genesisCover,
  Jacob: waters,
  Joseph: journeyStart,
};

function buildGuide(meta: GenesisChapterMeta): ChapterGuide {
  return {
    title: meta.title,
    narrator: "Anime Audio Guide · ESV",
    durationSeconds: 420,
    script: [
      `Welcome to ${meta.passageQuery} — ${meta.title}.`,
      meta.summary,
      `Key verse · ${meta.keyVerseRef}: ${meta.keyVerseEsV}`,
      "Open the ESV text below, listen along, and come back tomorrow for the next chapter.",
      "This free app walks Genesis end-to-end — one storyline at a time.",
    ],
  };
}

function buildPanels(meta: GenesisChapterMeta): ComicPanel[] {
  if (meta.number === 1) {
    return [
      {
        id: "g1-1",
        title: "Day 1 · Let there be light",
        caption:
          "Darkness covered the deep — then a warm burst of light split the void.",
        image: day1,
      },
      {
        id: "g1-2",
        title: "The waters · Dawn over the deep",
        caption:
          "Spirit hovered over the waters as golden dawn painted the horizon.",
        image: waters,
      },
    ];
  }
  if (meta.number === 2) {
    return [
      {
        id: "g2-1",
        title: "Breath of life",
        caption: "From dust and breath — a living soul awakens in the garden.",
        image: genesisCover,
      },
      {
        id: "g2-2",
        title: "Tree of life",
        caption: "Two trees stand at the center — gift, trust, and choice.",
        image: waters,
      },
    ];
  }
  if (meta.number === 3) {
    return [
      {
        id: "g3-1",
        title: "Eve bites",
        caption:
          "While Adam’s back is turned, Eve tastes the forbidden fruit — a quiet choice that shakes the garden.",
        image: fallEveBites,
      },
      {
        id: "g3-2",
        title: "She offers it",
        caption:
          "Eve hands the apple to Adam… and he bites too. What began alone becomes a shared fall.",
        image: fallHandsApple,
      },
      {
        id: "g3-3",
        title: "The serpent smirks",
        caption:
          "Coiled in the tree, the serpent lingers with a smirk — watching trust unravel.",
        image: fallSerpent,
      },
    ];
  }

  const thumb = ARC_THUMBS[meta.arc] ?? genesisCover;
  return [
    {
      id: `g${meta.number}-1`,
      title: meta.title,
      caption: meta.summary,
      image: thumb,
    },
    {
      id: `g${meta.number}-2`,
      title: meta.keyVerseRef,
      caption: meta.keyVerseEsV,
      image: thumb,
    },
  ];
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
  },
  {
    id: "journey-creation",
    number: 2,
    title: "Creation Week",
    booksLabel: "Genesis 1–2 · illustrated",
    days: 8,
    cover: day1,
    bookIds: ["genesis"],
  },
  {
    id: "journey-promise",
    number: 3,
    title: "Promise & Family",
    booksLabel: "Abraham → Joseph",
    days: 39,
    cover: genesisCover,
    bookIds: ["genesis"],
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
