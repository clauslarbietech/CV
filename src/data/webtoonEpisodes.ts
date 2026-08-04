export type WebtoonBubble = {
  text: string;
  tone: "narration" | "dialogue" | "whisper" | "scripture";
};

export type WebtoonPanel = {
  id: string;
  image: number;
  /** ESV reference shown on the panel (e.g. Genesis 1:3). */
  scriptureRef?: string;
  /** Exact ESV wording for this scene (read aloud + shown). */
  scriptureText?: string;
  bubble?: WebtoonBubble;
};

export type WebtoonEpisode = {
  id: string;
  bookId: string;
  chapterNumber: number;
  /** One storyline chunk at a time (e.g. day-1, eve-from-rib). */
  storylineId: string;
  seriesTitle: string;
  episodeLabel: string;
  title: string;
  subtitle: string;
  panels: WebtoonPanel[];
};

const g1Darkness = require("../../assets/webtoon/genesis-1/01-darkness.jpg");
const g1Light = require("../../assets/webtoon/genesis-1/02-light.jpg");
const g1DayNight = require("../../assets/webtoon/genesis-1/03-day-night.jpg");

const g2AdamSleep = require("../../assets/webtoon/genesis-2/01-adam-sleep-light.jpg");
const g2EdenTogether = require("../../assets/webtoon/genesis-2/02-eden-together.jpg");
const g2EveAwakens = require("../../assets/webtoon/genesis-2/03-eve-awakens.jpg");

const g3Garden = require("../../assets/webtoon/genesis-3/01-garden.jpg");
const g3Whisper = require("../../assets/webtoon/genesis-3/02-whisper.jpg");
const g3EveBites = require("../../assets/webtoon/genesis-3/03-eve-bites.jpg");
const g3Offer = require("../../assets/webtoon/genesis-3/04-offer.jpg");
const g3Serpent = require("../../assets/webtoon/genesis-3/05-serpent.jpg");

/**
 * Mature anime webtoon storylines (family-safe).
 * Built one storyline at a time — ESV text attributed to Crossway.
 */
export const WEBTOON_EPISODES: WebtoonEpisode[] = [
  {
    id: "genesis-1-day-1",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-1",
    seriesTitle: "Genesis",
    episodeLabel: "Storyline 1",
    title: "Day 1 · Let There Be Light",
    subtitle: "In the beginning — heavens, earth, and the first light",
    panels: [
      {
        id: "g1-d1-1",
        image: g1Darkness,
        scriptureRef: "Genesis 1:1–2",
        scriptureText:
          "In the beginning, God created the heavens and the earth. The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.",
        bubble: {
          tone: "scripture",
          text: "In the beginning, God created the heavens and the earth.",
        },
      },
      {
        id: "g1-d1-2",
        image: g1Light,
        scriptureRef: "Genesis 1:3–4",
        scriptureText:
          'And God said, “Let there be light,” and there was light. And God saw that the light was good. And God separated the light from the darkness.',
        bubble: {
          tone: "dialogue",
          text: "“Let there be light.”",
        },
      },
      {
        id: "g1-d1-3",
        image: g1DayNight,
        scriptureRef: "Genesis 1:5",
        scriptureText:
          "God called the light Day, and the darkness he called Night. And there was evening and there was morning, the first day.",
        bubble: {
          tone: "narration",
          text: "And there was evening and there was morning, the first day.",
        },
      },
    ],
  },
  {
    id: "genesis-2-eve-from-rib",
    bookId: "genesis",
    chapterNumber: 2,
    storylineId: "eve-from-rib",
    seriesTitle: "Genesis",
    episodeLabel: "Storyline · Eve",
    title: "Eve from Adam’s Side",
    subtitle:
      "Unclothed without shame — tasteful angles only (family-safe, no explicit anatomy)",
    panels: [
      {
        id: "g2-eve-1",
        image: g2AdamSleep,
        scriptureRef: "Genesis 2:21",
        scriptureText:
          "So the Lord God caused a deep sleep to fall upon the man, and while he slept took one of his ribs and closed up its place with flesh.",
        bubble: {
          tone: "scripture",
          text: "…the Lord God caused a deep sleep to fall upon the man…",
        },
      },
      {
        id: "g2-eve-2",
        image: g2EveAwakens,
        scriptureRef: "Genesis 2:22",
        scriptureText:
          "And the rib that the Lord God had taken from the man he made into a woman and brought her to the man.",
        bubble: {
          tone: "narration",
          text: "From his side, God made woman — and she stood in the garden.",
        },
      },
      {
        id: "g2-eve-3",
        image: g2EdenTogether,
        scriptureRef: "Genesis 2:25",
        scriptureText:
          "And the man and his wife were both naked and were not ashamed.",
        bubble: {
          tone: "scripture",
          text: "And the man and his wife were both naked and were not ashamed.",
        },
      },
    ],
  },
  {
    id: "genesis-3-ep1",
    bookId: "genesis",
    chapterNumber: 3,
    storylineId: "the-fall",
    seriesTitle: "Genesis",
    episodeLabel: "Episode 1",
    title: "The Fall",
    subtitle: "When trust breaks in the garden",
    panels: [
      {
        id: "p1",
        image: g3Garden,
        scriptureRef: "Genesis 3:1",
        scriptureText:
          "Now the serpent was more crafty than any other beast of the field that the Lord God had made. He said to the woman, “Did God actually say, ‘You shall not eat of any tree in the garden’?”",
        bubble: {
          tone: "narration",
          text: "In the cool of the garden, one tree glowed with a dangerous beauty…",
        },
      },
      {
        id: "p2",
        image: g3Whisper,
        scriptureRef: "Genesis 3:1",
        scriptureText:
          "He said to the woman, “Did God actually say, ‘You shall not eat of any tree in the garden’?”",
        bubble: {
          tone: "whisper",
          text: "“Did God really say…?”",
        },
      },
      {
        id: "p3",
        image: g3EveBites,
        scriptureRef: "Genesis 3:6",
        scriptureText:
          "So when the woman saw that the tree was good for food, and that it was a delight to the eyes, and that the tree was to be desired to make one wise, she took of its fruit and ate…",
        bubble: {
          tone: "narration",
          text: "While Adam’s back was turned, Eve reached for what was forbidden.",
        },
      },
      {
        id: "p4",
        image: g3Offer,
        scriptureRef: "Genesis 3:6",
        scriptureText: "…and she also gave some to her husband who was with her, and he ate.",
        bubble: {
          tone: "dialogue",
          text: "She offered it to Adam… and he also ate.",
        },
      },
      {
        id: "p5",
        image: g3Serpent,
        scriptureRef: "Genesis 3:6–7",
        scriptureText:
          "Then the eyes of both were opened, and they knew that they were naked. And they sewed fig leaves together and made themselves loincloths.",
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
  chapterNumber: number,
  storylineId?: string
): WebtoonEpisode | undefined {
  const matches = WEBTOON_EPISODES.filter(
    (episode) =>
      episode.bookId === bookId && episode.chapterNumber === chapterNumber
  );
  if (storylineId) {
    return matches.find((episode) => episode.storylineId === storylineId);
  }
  return matches[0];
}

export function listWebtoonEpisodes(bookId?: string): WebtoonEpisode[] {
  if (!bookId) {
    return WEBTOON_EPISODES;
  }
  return WEBTOON_EPISODES.filter((episode) => episode.bookId === bookId);
}

/** Text spoken by TTS for a panel (prefer full ESV verse). */
export function getPanelAudioText(panel: WebtoonPanel): string {
  if (panel.scriptureText) {
    const ref = panel.scriptureRef ? `${panel.scriptureRef}. ` : "";
    return `${ref}${panel.scriptureText}`;
  }
  return panel.bubble?.text ?? "";
}
