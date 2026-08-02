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

export const BOOKS: BibleBook[] = [
  {
    id: "genesis",
    name: "Genesis",
    abbreviation: "Ge",
    testament: "OT",
    days: 50,
    tagline: "Beginnings — creation, promise, and family",
    cover: genesisCover,
    chapters: [
      {
        number: 1,
        title: "Creation Dawn",
        passageQuery: "Genesis 1",
        guide: {
          title: "Let There Be Light",
          narrator: "Anime Audio Guide",
          durationSeconds: 540,
          script: [
            "Welcome to Genesis 1 — the opening chapter of the whole story.",
            "Before anything else, God speaks. Darkness covers the deep, and then light breaks in.",
            "Watch the comic panels as you listen: creation isn’t chaos — it’s craftsmanship.",
            "Day by day, God shapes a world that is good, then very good.",
            "As you read, ask: What does it mean that you are made in God’s image?",
          ],
        },
        panels: [
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
        ],
      },
      {
        number: 2,
        title: "Garden Rest",
        passageQuery: "Genesis 2",
        guide: {
          title: "The Garden Story",
          narrator: "Anime Audio Guide",
          durationSeconds: 480,
          script: [
            "Genesis 2 zooms in — from the wide canvas of creation to a garden and a friendship.",
            "God forms humanity from dust and breathes life — intimate and personal.",
            "The garden is a gift: work, rest, and relationship without shame.",
            "Notice the river, the trees, and the call to keep and cultivate.",
            "This chapter invites you into God’s nearness, not just His power.",
          ],
        },
        panels: [
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
        ],
      },
      {
        number: 3,
        title: "The Fall",
        passageQuery: "Genesis 3",
        guide: {
          title: "When Trust Breaks",
          narrator: "Anime Audio Guide",
          durationSeconds: 510,
          script: [
            "Genesis 3 is the hinge of the Bible — the moment trust is traded for fear.",
            "Watch Eve reach for the fruit while Adam’s back is turned — desire before discernment.",
            "Then she offers it to Adam… and he bites too. The break becomes shared.",
            "Notice the serpent lingering with a smirk — evil loves when trust collapses.",
            "Yet even here, God seeks them out — and a promise of rescue begins to glow.",
          ],
        },
        panels: [
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
        ],
      },
    ],
  },
];

export const JOURNEYS: Journey[] = [
  {
    id: "journey-1",
    number: 1,
    title: "Start",
    booksLabel: "Genesis · Creation arc",
    days: 7,
    cover: journeyStart,
    bookIds: ["genesis"],
  },
  {
    id: "journey-2",
    number: 2,
    title: "The Big Picture",
    booksLabel: "Key chapters overview",
    days: 24,
    cover: waters,
    bookIds: ["genesis"],
  },
  {
    id: "journey-3",
    number: 3,
    title: "Foundations",
    booksLabel: "Genesis, Daniel, Romans",
    days: 92,
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
