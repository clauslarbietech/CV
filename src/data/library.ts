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
const arcFallCain = require("../../assets/panels/arc-fall-cain.jpg");
const arcFlood = require("../../assets/panels/arc-flood.jpg");
const arcNations = require("../../assets/panels/arc-nations.jpg");
const arcAbraham = require("../../assets/panels/arc-abraham.jpg");
const arcIsaac = require("../../assets/panels/arc-isaac.jpg");
const arcJacob = require("../../assets/panels/arc-jacob.jpg");
const arcJoseph = require("../../assets/panels/arc-joseph.jpg");
const g9Rainbow = require("../../assets/webtoon/genesis-9/01-rainbow.jpg");
const g15Covenant = require("../../assets/webtoon/genesis-15/01-covenant.jpg");
const g25Stew = require("../../assets/webtoon/genesis-25/01-stew.jpg");
const g37Caravan = require("../../assets/webtoon/genesis-37/02-caravan.jpg");
const g41Dreams = require("../../assets/webtoon/genesis-41/01-dreams.jpg");
const g45Reunion = require("../../assets/webtoon/genesis-45/01-reunion.jpg");

const ARC_THUMBS: Record<string, number> = {
  Creation: day1,
  Fall: arcFallCain,
  Flood: arcFlood,
  Nations: arcNations,
  Abraham: arcAbraham,
  Isaac: arcIsaac,
  Jacob: arcJacob,
  Joseph: arcJoseph,
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

  // Dedicated comic beats for illustrated arc chapters (Ken-Burns storyboards).
  const illustratedBeats: Record<
    number,
    { title: string; caption: string; image: number }[]
  > = {
    4: [
      {
        title: "Offerings",
        caption: "Abel brings the flock; Cain brings fruit from the ground.",
        image: arcFallCain,
      },
    ],
    6: [
      {
        title: "Build the ark",
        caption: "God tells Noah to make an ark of gopher wood.",
        image: arcFlood,
      },
    ],
    7: [
      {
        title: "Waters rise",
        caption: "The ark floats on the face of the waters.",
        image: arcFlood,
      },
    ],
    9: [
      {
        title: "Bow in the cloud",
        caption: "God sets a rainbow as the sign of His covenant.",
        image: g9Rainbow,
      },
    ],
    11: [
      {
        title: "Tower of Babel",
        caption: "One language reaches for the heavens — then the nations scatter.",
        image: arcNations,
      },
    ],
    12: [
      {
        title: "Go to the land",
        caption: "Abram leaves home under a sky full of promise.",
        image: arcAbraham,
      },
    ],
    15: [
      {
        title: "Number the stars",
        caption: "Abram believes the Lord — counted as righteousness.",
        image: g15Covenant,
      },
    ],
    22: [
      {
        title: "Mount Moriah",
        caption: "Abraham and Isaac climb — God will provide the lamb.",
        image: arcIsaac,
      },
    ],
    25: [
      {
        title: "Birthright stew",
        caption: "Esau sells his birthright for a bowl of stew.",
        image: g25Stew,
      },
    ],
    28: [
      {
        title: "Ladder at Bethel",
        caption: "Jacob dreams of a ladder between earth and heaven.",
        image: arcJacob,
      },
    ],
    37: [
      {
        title: "Coat of many colors",
        caption: "Israel loves Joseph — and makes him a robe of many colors.",
        image: arcJoseph,
      },
      {
        title: "Sold to Egypt",
        caption: "The caravan carries Joseph toward Egypt.",
        image: g37Caravan,
      },
    ],
    41: [
      {
        title: "Pharaoh’s dreams",
        caption: "Joseph interprets seven years of plenty and famine.",
        image: g41Dreams,
      },
    ],
    45: [
      {
        title: "I am Joseph",
        caption: "God sent me before you to preserve life.",
        image: g45Reunion,
      },
    ],
  };

  const beats = illustratedBeats[meta.number];
  if (beats) {
    return beats.map((beat, index) => ({
      id: `g${meta.number}-${index + 1}`,
      title: beat.title,
      caption: beat.caption,
      image: beat.image,
    }));
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
