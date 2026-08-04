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
const g1Day2 = require("../../assets/webtoon/genesis-1/04-day2-expanse.jpg");
const g1Day3 = require("../../assets/webtoon/genesis-1/05-day3-land.jpg");
const g1Day4 = require("../../assets/webtoon/genesis-1/06-day4-lights.jpg");
const g1Day5 = require("../../assets/webtoon/genesis-1/07-day5-creatures.jpg");
const g1Day6Animals = require("../../assets/webtoon/genesis-1/08-day6-animals.jpg");
const g1Day6Adam = require("../../assets/webtoon/genesis-1/09-day6-adam.jpg");
const g1Day7 = require("../../assets/webtoon/genesis-1/10-day7-rest.jpg");

const g2AdamRib = require("../../assets/webtoon/genesis-2/01-adam-rib-bush.jpg");
const g2EveBush = require("../../assets/webtoon/genesis-2/02-eve-bush.jpg");
const g2EdenTogether = require("../../assets/webtoon/genesis-2/02-eden-together.jpg");

const g3Garden = require("../../assets/webtoon/genesis-3/01-garden.jpg");
const g3Whisper = require("../../assets/webtoon/genesis-3/02-whisper.jpg");
const g3EveBites = require("../../assets/webtoon/genesis-3/03-eve-bites.jpg");
const g3Offer = require("../../assets/webtoon/genesis-3/04-offer.jpg");
const g3Serpent = require("../../assets/webtoon/genesis-3/05-serpent.jpg");

/**
 * Illustrated anime webtoon storylines (family-safe).
 * Genesis art ships storyline-by-storyline; ESV text attributed to Crossway.
 */
export const WEBTOON_EPISODES: WebtoonEpisode[] = [
  {
    id: "genesis-1-day-1",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-1",
    seriesTitle: "Genesis",
    episodeLabel: "Day 1",
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
    id: "genesis-1-day-2",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-2",
    seriesTitle: "Genesis",
    episodeLabel: "Day 2",
    title: "Day 2 · The Expanse",
    subtitle: "God separates the waters and calls the expanse Heaven",
    panels: [
      {
        id: "g1-d2-1",
        image: g1Day2,
        scriptureRef: "Genesis 1:6–8",
        scriptureText:
          'And God said, “Let there be an expanse in the midst of the waters, and let it separate the waters from the waters.” And God made the expanse and separated the waters that were under the expanse from the waters that were above the expanse. And it was so. And God called the expanse Heaven. And there was evening and there was morning, the second day.',
        bubble: {
          tone: "dialogue",
          text: "“Let there be an expanse in the midst of the waters…”",
        },
      },
    ],
  },
  {
    id: "genesis-1-day-3",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-3",
    seriesTitle: "Genesis",
    episodeLabel: "Day 3",
    title: "Day 3 · Land and Plants",
    subtitle: "Dry land appears — and the earth brings forth vegetation",
    panels: [
      {
        id: "g1-d3-1",
        image: g1Day3,
        scriptureRef: "Genesis 1:9–13",
        scriptureText:
          'And God said, “Let the waters under the heavens be gathered together into one place, and let the dry land appear.” And it was so. God called the dry land Earth, and the waters that were gathered together he called Seas. And God saw that it was good. And God said, “Let the earth sprout vegetation, plants yielding seed, and fruit trees bearing fruit in which is their seed, each according to its kind, on the earth.” And it was so. The earth brought forth vegetation, plants yielding seed according to their own kinds, and trees bearing fruit in which is their seed, each according to its kind. And God saw that it was good. And there was evening and there was morning, the third day.',
        bubble: {
          tone: "dialogue",
          text: "“Let the dry land appear.”",
        },
      },
    ],
  },
  {
    id: "genesis-1-day-4",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-4",
    seriesTitle: "Genesis",
    episodeLabel: "Day 4",
    title: "Day 4 · Sun, Moon, and Stars",
    subtitle: "Lights in the expanse to rule the day and the night",
    panels: [
      {
        id: "g1-d4-1",
        image: g1Day4,
        scriptureRef: "Genesis 1:14–19",
        scriptureText:
          'And God said, “Let there be lights in the expanse of the heavens to separate the day from the night. And let them be for signs and for seasons, and for days and years, and let them be lights in the expanse of the heavens to give light upon the earth.” And it was so. And God made the two great lights—the greater light to rule the day and the lesser light to rule the night—and the stars. And God set them in the expanse of the heavens to give light on the earth, to rule over the day and over the night, and to separate the light from the darkness. And God saw that it was good. And there was evening and there was morning, the fourth day.',
        bubble: {
          tone: "dialogue",
          text: "“Let there be lights in the expanse of the heavens…”",
        },
      },
    ],
  },
  {
    id: "genesis-1-day-5",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-5",
    seriesTitle: "Genesis",
    episodeLabel: "Day 5",
    title: "Day 5 · Fish and Birds",
    subtitle: "Living creatures fill the waters and the sky",
    panels: [
      {
        id: "g1-d5-1",
        image: g1Day5,
        scriptureRef: "Genesis 1:20–23",
        scriptureText:
          'And God said, “Let the waters swarm with swarms of living creatures, and let birds fly above the earth across the expanse of the heavens.” So God created the great sea creatures and every living creature that moves, with which the waters swarm, according to their kinds, and every winged bird according to its kind. And God saw that it was good. And God blessed them, saying, “Be fruitful and multiply and fill the waters in the seas, and let birds multiply on the earth.” And there was evening and there was morning, the fifth day.',
        bubble: {
          tone: "dialogue",
          text: "“Let the waters swarm with swarms of living creatures…”",
        },
      },
    ],
  },
  {
    id: "genesis-1-day-6",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-6",
    seriesTitle: "Genesis",
    episodeLabel: "Day 6",
    title: "Day 6 · Animals and Humankind",
    subtitle: "Living creatures on the earth — and God creates man",
    panels: [
      {
        id: "g1-d6-1",
        image: g1Day6Animals,
        scriptureRef: "Genesis 1:24–25",
        scriptureText:
          'And God said, “Let the earth bring forth living creatures according to their kinds—livestock and creeping things and beasts of the earth according to their kinds.” And it was so. And God made the beasts of the earth according to their kinds and the livestock according to their kinds, and everything that creeps on the ground according to its kind. And God saw that it was good.',
        bubble: {
          tone: "dialogue",
          text: "“Let the earth bring forth living creatures…”",
        },
      },
      {
        id: "g1-d6-2",
        image: g1Day6Adam,
        scriptureRef: "Genesis 1:26–27",
        scriptureText:
          'Then God said, “Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth.” So God created man in his own image, in the image of God he created him; male and female he created them.',
        bubble: {
          tone: "scripture",
          text: "So God created man in his own image…",
        },
      },
      {
        id: "g1-d6-3",
        image: g1Day6Adam,
        scriptureRef: "Genesis 1:31",
        scriptureText:
          "And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day.",
        bubble: {
          tone: "narration",
          text: "And behold, it was very good.",
        },
      },
    ],
  },
  {
    id: "genesis-1-day-7",
    bookId: "genesis",
    chapterNumber: 1,
    storylineId: "day-7",
    seriesTitle: "Genesis",
    episodeLabel: "Day 7",
    title: "Day 7 · God Rests",
    subtitle: "The heavens and the earth were finished — and God blessed the seventh day",
    panels: [
      {
        id: "g1-d7-1",
        image: g1Day7,
        scriptureRef: "Genesis 2:1–3",
        scriptureText:
          "Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done. So God blessed the seventh day and made it holy, because on it God rested from all his work that he had done in creation.",
        bubble: {
          tone: "scripture",
          text: "So God blessed the seventh day and made it holy…",
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
    episodeLabel: "Eden · Eve",
    title: "Eve from Adam’s Side",
    subtitle:
      "Naked and not ashamed — bush/branch hovering (family-safe angles)",
    panels: [
      {
        id: "g2-eve-1",
        image: g2AdamRib,
        scriptureRef: "Genesis 2:21–22",
        scriptureText:
          "So the Lord God caused a deep sleep to fall upon the man, and while he slept took one of his ribs and closed up its place with flesh. And the rib that the Lord God had taken from the man he made into a woman and brought her to the man.",
        bubble: {
          tone: "scripture",
          text: "…took one of his ribs… and made into a woman…",
        },
      },
      {
        id: "g2-eve-2",
        image: g2EveBush,
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
    episodeLabel: "The Fall",
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
        scriptureText:
          "…and she also gave some to her husband who was with her, and he ate.",
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

/** Text spoken by TTS for a panel — all on-screen text for non-readers. */
export function getPanelAudioText(panel: WebtoonPanel): string {
  const parts: string[] = [];

  if (panel.scriptureRef && panel.scriptureText) {
    parts.push(`${panel.scriptureRef}. ${panel.scriptureText}`);
  } else if (panel.scriptureText) {
    parts.push(panel.scriptureText);
  }

  if (panel.bubble?.text) {
    const bubble = panel.bubble.text.trim();
    // Avoid repeating the same line if bubble is only a short quote already in scripture.
    const alreadyCovered =
      panel.scriptureText &&
      panel.scriptureText.includes(bubble.replace(/[“”"]/g, "").slice(0, 24));
    if (!alreadyCovered || panel.bubble.tone === "whisper") {
      const lead =
        panel.bubble.tone === "whisper"
          ? "The whisper says: "
          : panel.bubble.tone === "dialogue"
            ? "God said: "
            : panel.bubble.tone === "scripture"
              ? ""
              : "The story says: ";
      if (lead || !panel.scriptureText) {
        parts.push(`${lead}${bubble}`);
      }
    }
  }

  return parts.filter(Boolean).join(" ");
}

/** Shorter speech-only line (bubble) for kids who want dialogue alone. */
export function getPanelSpeechOnlyText(panel: WebtoonPanel): string {
  return panel.bubble?.text?.trim() ?? "";
}
