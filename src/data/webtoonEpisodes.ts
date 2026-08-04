export type WebtoonBubble = {
  text: string;
  tone: "narration" | "dialogue" | "whisper";
};

export type WebtoonPanel = {
  id: string;
  image: number;
  bubble?: WebtoonBubble;
};

export type WebtoonEpisode = {
  id: string;
  bookId: string;
  chapterNumber: number;
  seriesTitle: string;
  episodeLabel: string;
  title: string;
  subtitle: string;
  panels: WebtoonPanel[];
};

const garden = require("../../assets/webtoon/genesis-3/01-garden.jpg");
const whisper = require("../../assets/webtoon/genesis-3/02-whisper.jpg");
const eveBites = require("../../assets/webtoon/genesis-3/03-eve-bites.jpg");
const offer = require("../../assets/webtoon/genesis-3/04-offer.jpg");
const serpent = require("../../assets/webtoon/genesis-3/05-serpent.jpg");

/** Mature anime webtoon episodes (family-safe scripture). */
export const WEBTOON_EPISODES: WebtoonEpisode[] = [
  {
    id: "genesis-3-ep1",
    bookId: "genesis",
    chapterNumber: 3,
    seriesTitle: "Genesis",
    episodeLabel: "Episode 1",
    title: "The Fall",
    subtitle: "When trust breaks in the garden",
    panels: [
      {
        id: "p1",
        image: garden,
        bubble: {
          tone: "narration",
          text: "In the cool of the garden, one tree glowed with a dangerous beauty…",
        },
      },
      {
        id: "p2",
        image: whisper,
        bubble: {
          tone: "whisper",
          text: "“Did God really say…?”",
        },
      },
      {
        id: "p3",
        image: eveBites,
        bubble: {
          tone: "narration",
          text: "While Adam’s back was turned, Eve reached for what was forbidden.",
        },
      },
      {
        id: "p4",
        image: offer,
        bubble: {
          tone: "dialogue",
          text: "She offered it to Adam… and he also ate.",
        },
      },
      {
        id: "p5",
        image: serpent,
        bubble: {
          tone: "narration",
          text: "And the serpent watched — as trust unraveled in the garden.",
        },
      },
    ],
  },
];

export function getWebtoonEpisode(
  bookId: string,
  chapterNumber: number
): WebtoonEpisode | undefined {
  return WEBTOON_EPISODES.find(
    (episode) =>
      episode.bookId === bookId && episode.chapterNumber === chapterNumber
  );
}
