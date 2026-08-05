import {
  getGenesisChapterSlides,
} from "./genesisChapterSlides";
import { getGenesisChapter } from "./genesisChapters";

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

const g4Offerings = require("../../assets/webtoon/genesis-4/01-offerings.jpg");
const g4Brothers = require("../../assets/webtoon/genesis-4/02-brothers.jpg");
const g6Ark = require("../../assets/webtoon/genesis-6/01-ark.jpg");
const g7Flood = require("../../assets/webtoon/genesis-7/01-flood.jpg");
const g9Rainbow = require("../../assets/webtoon/genesis-9/01-rainbow.jpg");
const g11Babel = require("../../assets/webtoon/genesis-11/01-babel.jpg");
const g12Stars = require("../../assets/webtoon/genesis-12/01-stars.jpg");
const g15Covenant = require("../../assets/webtoon/genesis-15/01-covenant.jpg");
const g22Moriah = require("../../assets/webtoon/genesis-22/01-moriah.jpg");
const g25Stew = require("../../assets/webtoon/genesis-25/01-stew.jpg");
const g28Bethel = require("../../assets/webtoon/genesis-28/01-bethel.jpg");
const g37Coat = require("../../assets/webtoon/genesis-37/01-coat.jpg");
const g37Caravan = require("../../assets/webtoon/genesis-37/02-caravan.jpg");
const g41Dreams = require("../../assets/webtoon/genesis-41/01-dreams.jpg");
const g45Reunion = require("../../assets/webtoon/genesis-45/01-reunion.jpg");
const g21IsaacBorn = require("../../assets/webtoon/genesis-21/01-isaac-born.jpg");
const g38JudahTamar = require("../../assets/webtoon/genesis-38/01-judah-tamar.jpg");
const g39Potiphar = require("../../assets/webtoon/genesis-39/01-potiphar.jpg");

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
  {
    id: "genesis-4-cain-abel",
    bookId: "genesis",
    chapterNumber: 4,
    storylineId: "cain-abel",
    seriesTitle: "Genesis",
    episodeLabel: "Cain & Abel",
    title: "Cain and Abel",
    subtitle: "Two brothers bring offerings — and jealousy rises",
    panels: [
      {
        id: "g4-1",
        image: g4Offerings,
        scriptureRef: "Genesis 4:3–4",
        scriptureText:
          "In the course of time Cain brought to the Lord an offering of the fruit of the ground, and Abel also brought of the firstborn of his flock and of their fat portions. And the Lord had regard for Abel and his offering,",
        bubble: {
          tone: "narration",
          text: "Abel brought the firstborn of his flock. Cain brought fruit from the ground.",
        },
      },
      {
        id: "g4-2",
        image: g4Brothers,
        scriptureRef: "Genesis 4:5–7",
        scriptureText:
          "but for Cain and his offering he had no regard. So Cain was very angry, and his face fell. The Lord said to Cain, “Why are you angry, and why has your face fallen? If you do well, will you not be accepted? And if you do not do well, sin is crouching at the door. Its desire is contrary to you, but you must rule over it.”",
        bubble: {
          tone: "dialogue",
          text: "“Sin is crouching at the door… but you must rule over it.”",
        },
      },
    ],
  },
  {
    id: "genesis-6-noah-ark",
    bookId: "genesis",
    chapterNumber: 6,
    storylineId: "noah-ark",
    seriesTitle: "Genesis",
    episodeLabel: "The Ark",
    title: "Noah Builds the Ark",
    subtitle: "When the earth was filled with violence, God made a way",
    panels: [
      {
        id: "g6-1",
        image: g6Ark,
        scriptureRef: "Genesis 6:13–14",
        scriptureText:
          'And God said to Noah, “I have determined to make an end of all flesh, for the earth is filled with violence through them. Behold, I will destroy them with the earth. Make yourself an ark of gopher wood. Make rooms in the ark, and cover it inside and out with pitch.”',
        bubble: {
          tone: "dialogue",
          text: "“Make yourself an ark of gopher wood.”",
        },
      },
    ],
  },
  {
    id: "genesis-7-the-flood",
    bookId: "genesis",
    chapterNumber: 7,
    storylineId: "the-flood",
    seriesTitle: "Genesis",
    episodeLabel: "The Flood",
    title: "The Flood Waters Rise",
    subtitle: "Rain falls — and the ark carries life through the storm",
    panels: [
      {
        id: "g7-1",
        image: g7Flood,
        scriptureRef: "Genesis 7:17–18",
        scriptureText:
          "The flood continued forty days on the earth. The waters increased and bore up the ark, and it rose high above the earth. The waters prevailed and increased greatly on the earth, and the ark floated on the face of the waters.",
        bubble: {
          tone: "narration",
          text: "The waters prevailed — and the ark floated on the face of the waters.",
        },
      },
    ],
  },
  {
    id: "genesis-9-rainbow",
    bookId: "genesis",
    chapterNumber: 9,
    storylineId: "rainbow-covenant",
    seriesTitle: "Genesis",
    episodeLabel: "Rainbow",
    title: "The Rainbow Covenant",
    subtitle: "God sets a sign in the clouds — a promise of mercy",
    panels: [
      {
        id: "g9-1",
        image: g9Rainbow,
        scriptureRef: "Genesis 9:12–13",
        scriptureText:
          'And God said, “This is the sign of the covenant that I make between me and you and every living creature that is with you, for all future generations: I have set my bow in the cloud, and it shall be a sign of the covenant between me and the earth.”',
        bubble: {
          tone: "dialogue",
          text: "“I have set my bow in the cloud…”",
        },
      },
    ],
  },
  {
    id: "genesis-11-babel",
    bookId: "genesis",
    chapterNumber: 11,
    storylineId: "babel",
    seriesTitle: "Genesis",
    episodeLabel: "Babel",
    title: "The Tower of Babel",
    subtitle: "One language, one city — then scattered across the earth",
    panels: [
      {
        id: "g11-1",
        image: g11Babel,
        scriptureRef: "Genesis 11:4",
        scriptureText:
          'Then they said, “Come, let us build ourselves a city and a tower with its top in the heavens, and let us make a name for ourselves, lest we be dispersed over the face of the whole earth.”',
        bubble: {
          tone: "dialogue",
          text: "“Let us build ourselves a city and a tower…”",
        },
      },
    ],
  },
  {
    id: "genesis-12-call",
    bookId: "genesis",
    chapterNumber: 12,
    storylineId: "call-of-abraham",
    seriesTitle: "Genesis",
    episodeLabel: "Abraham",
    title: "The Call of Abraham",
    subtitle: "Go to the land I will show you — and I will bless you",
    panels: [
      {
        id: "g12-1",
        image: g12Stars,
        scriptureRef: "Genesis 12:1–2",
        scriptureText:
          'Now the Lord said to Abram, “Go from your country and your kindred and your father’s house to the land that I will show you. And I will make of you a great nation, and I will bless you and make your name great, so that you will be a blessing.”',
        bubble: {
          tone: "dialogue",
          text: "“Go… to the land that I will show you.”",
        },
      },
    ],
  },
  {
    id: "genesis-15-covenant",
    bookId: "genesis",
    chapterNumber: 15,
    storylineId: "covenant-stars",
    seriesTitle: "Genesis",
    episodeLabel: "Covenant",
    title: "Stars Without Number",
    subtitle: "Abram believes the Lord — and it is counted as righteousness",
    panels: [
      {
        id: "g15-1",
        image: g15Covenant,
        scriptureRef: "Genesis 15:5–6",
        scriptureText:
          'And he brought him outside and said, “Look toward heaven, and number the stars, if you are able to number them.” Then he said to him, “So shall your offspring be.” And he believed the Lord, and he counted it to him as righteousness.',
        bubble: {
          tone: "dialogue",
          text: "“Look toward heaven… So shall your offspring be.”",
        },
      },
    ],
  },
  {
    id: "genesis-21-isaac-born",
    bookId: "genesis",
    chapterNumber: 21,
    storylineId: "isaac-born",
    seriesTitle: "Genesis",
    episodeLabel: "Isaac",
    title: "Isaac Is Born",
    subtitle: "The promised son arrives — laughter becomes joy",
    panels: [
      {
        id: "g21-1",
        image: g21IsaacBorn,
        scriptureRef: "Genesis 21:1–3",
        scriptureText:
          "The Lord visited Sarah as he had said, and the Lord did to Sarah as he had promised. And Sarah conceived and bore Abraham a son in his old age at the time of which God had spoken to him. Abraham called the name of his son who was born to him, whom Sarah bore him, Isaac.",
        bubble: {
          tone: "narration",
          text: "Sarah bore Abraham a son — and he called his name Isaac.",
        },
      },
    ],
  },
  {
    id: "genesis-22-moriah",
    bookId: "genesis",
    chapterNumber: 22,
    storylineId: "moriah",
    seriesTitle: "Genesis",
    episodeLabel: "Moriah",
    title: "On Mount Moriah",
    subtitle: "Abraham and Isaac climb — and God provides",
    panels: [
      {
        id: "g22-1",
        image: g22Moriah,
        scriptureRef: "Genesis 22:7–8",
        scriptureText:
          'And Isaac said to his father Abraham, “My father!” And he said, “Here I am, my son.” He said, “Behold, the fire and the wood, but where is the lamb for a burnt offering?” Abraham said, “God will provide for himself the lamb for a burnt offering, my son.” So they went both of them together.',
        bubble: {
          tone: "dialogue",
          text: "“God will provide for himself the lamb…”",
        },
      },
    ],
  },
  {
    id: "genesis-25-birthright",
    bookId: "genesis",
    chapterNumber: 25,
    storylineId: "birthright",
    seriesTitle: "Genesis",
    episodeLabel: "Birthright",
    title: "Stew for a Birthright",
    subtitle: "Esau and Jacob — hunger, haste, and a costly trade",
    panels: [
      {
        id: "g25-1",
        image: g25Stew,
        scriptureRef: "Genesis 25:29–34",
        scriptureText:
          "Once when Jacob was cooking stew, Esau came in from the field, and he was exhausted. And Esau said to Jacob, “Let me eat some of that red stew, for I am exhausted!” … Jacob said, “Sell me your birthright now.” Esau said, “I am about to die; of what use is a birthright to me?” … So he swore to him and sold his birthright to Jacob. Then Jacob gave Esau bread and lentil stew, and he ate and drank and rose and went his way. Thus Esau despised his birthright.",
        bubble: {
          tone: "narration",
          text: "For a bowl of stew, Esau sold his birthright.",
        },
      },
    ],
  },
  {
    id: "genesis-28-bethel",
    bookId: "genesis",
    chapterNumber: 28,
    storylineId: "bethel",
    seriesTitle: "Genesis",
    episodeLabel: "Bethel",
    title: "Jacob’s Dream at Bethel",
    subtitle: "A ladder between earth and heaven — and a promise repeated",
    panels: [
      {
        id: "g28-1",
        image: g28Bethel,
        scriptureRef: "Genesis 28:12–13",
        scriptureText:
          'And he dreamed, and behold, there was a ladder set up on the earth, and the top of it reached to heaven. And behold, the angels of God were ascending and descending on it! And behold, the Lord stood above it and said, “I am the Lord, the God of Abraham your father and the God of Isaac. The land on which you lie I will give to you and to your offspring.”',
        bubble: {
          tone: "scripture",
          text: "Behold, a ladder… and the angels of God ascending and descending.",
        },
      },
    ],
  },
  {
    id: "genesis-37-coat",
    bookId: "genesis",
    chapterNumber: 37,
    storylineId: "joseph-coat",
    seriesTitle: "Genesis",
    episodeLabel: "Joseph",
    title: "The Coat and the Caravan",
    subtitle: "Favored son, bitter brothers — and a road toward Egypt",
    panels: [
      {
        id: "g37-1",
        image: g37Coat,
        scriptureRef: "Genesis 37:3",
        scriptureText:
          "Now Israel loved Joseph more than any other of his sons, because he was the son of his old age. And he made him a robe of many colors.",
        bubble: {
          tone: "narration",
          text: "Israel loved Joseph — and made him a robe of many colors.",
        },
      },
      {
        id: "g37-2",
        image: g37Caravan,
        scriptureRef: "Genesis 37:28",
        scriptureText:
          "Then Midianite traders passed by. And they drew Joseph up and lifted him out of the pit, and sold him to the Ishmaelites for twenty shekels of silver. They took Joseph to Egypt.",
        bubble: {
          tone: "narration",
          text: "They sold Joseph — and the caravan carried him toward Egypt.",
        },
      },
    ],
  },
  {
    id: "genesis-38-judah-tamar",
    bookId: "genesis",
    chapterNumber: 38,
    storylineId: "judah-tamar",
    seriesTitle: "Genesis",
    episodeLabel: "Judah",
    title: "Judah and Tamar",
    subtitle: "A broken family line — and a surprising turn toward mercy",
    panels: [
      {
        id: "g38-1",
        image: g38JudahTamar,
        scriptureRef: "Genesis 38:26",
        scriptureText:
          'Then Judah identified them and said, “She is more righteous than I, since I did not give her to my son Shelah.” And he did not know her again.',
        bubble: {
          tone: "dialogue",
          text: "“She is more righteous than I…”",
        },
      },
    ],
  },
  {
    id: "genesis-39-potiphar",
    bookId: "genesis",
    chapterNumber: 39,
    storylineId: "potiphar",
    seriesTitle: "Genesis",
    episodeLabel: "Potiphar",
    title: "In Potiphar’s House",
    subtitle: "Joseph serves in Egypt — and the Lord is with him",
    panels: [
      {
        id: "g39-1",
        image: g39Potiphar,
        scriptureRef: "Genesis 39:2–4",
        scriptureText:
          "The Lord was with Joseph, and he became a successful man, and he was in the house of his Egyptian master. His master saw that the Lord was with him and that the Lord caused all that he did to succeed in his hands. So Joseph found favor in his sight and attended him, and he made him overseer of his house and put him in charge of all that he had.",
        bubble: {
          tone: "scripture",
          text: "The Lord was with Joseph, and he became a successful man…",
        },
      },
    ],
  },
  {
    id: "genesis-41-dreams",
    bookId: "genesis",
    chapterNumber: 41,
    storylineId: "pharaoh-dreams",
    seriesTitle: "Genesis",
    episodeLabel: "Dreams",
    title: "Pharaoh’s Dreams",
    subtitle: "Grain and cattle — Joseph speaks wisdom before the throne",
    panels: [
      {
        id: "g41-1",
        image: g41Dreams,
        scriptureRef: "Genesis 41:25–30",
        scriptureText:
          'Then Joseph said to Pharaoh, “The dreams of Pharaoh are one; God has revealed to Pharaoh what he is about to do. The seven good cows are seven years, and the seven good ears are seven years; the dreams are one. The seven lean and ugly cows that came up after them are seven years, and the seven empty ears blighted by the east wind are also seven years of famine. … There will come seven years of great plenty throughout all the land of Egypt, but after them there will arise seven years of famine…”',
        bubble: {
          tone: "dialogue",
          text: "“God has revealed to Pharaoh what he is about to do.”",
        },
      },
    ],
  },
  {
    id: "genesis-45-reunion",
    bookId: "genesis",
    chapterNumber: 45,
    storylineId: "reunion",
    seriesTitle: "Genesis",
    episodeLabel: "Reunion",
    title: "Joseph Revealed",
    subtitle: "Tears, forgiveness, and a family made whole again",
    panels: [
      {
        id: "g45-1",
        image: g45Reunion,
        scriptureRef: "Genesis 45:4–5",
        scriptureText:
          'So Joseph said to his brothers, “Come near to me, please.” And they came near. And he said, “I am your brother, Joseph, whom you sold into Egypt. And now do not be distressed or angry with yourselves because you sold me here, for God sent me before you to preserve life.”',
        bubble: {
          tone: "dialogue",
          text: "“I am your brother, Joseph… God sent me before you to preserve life.”",
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
    const found = matches.find((episode) => episode.storylineId === storylineId);
    if (found) {
      return found;
    }
  }
  if (matches[0]) {
    return matches[0];
  }
  // Every Genesis chapter has scripture-matched slides — use them as a storyline.
  if (bookId === "genesis") {
    return slidesAsWebtoonEpisode(chapterNumber);
  }
  return undefined;
}

function slidesAsWebtoonEpisode(
  chapterNumber: number
): WebtoonEpisode | undefined {
  const meta = getGenesisChapter(chapterNumber);
  const slides = getGenesisChapterSlides(chapterNumber);
  if (!meta || slides.length === 0) {
    return undefined;
  }
  return {
    id: `genesis-${chapterNumber}-slides`,
    bookId: "genesis",
    chapterNumber,
    storylineId: `ch-${chapterNumber}`,
    seriesTitle: "Genesis",
    episodeLabel: `Ch. ${chapterNumber}`,
    title: meta.title,
    subtitle: meta.summary,
    panels: slides.map((slide, index) => ({
      id: `g${chapterNumber}-slide-${index + 1}`,
      image: slide.image,
      scriptureRef: slide.scriptureRef,
      scriptureText: slide.scriptureText,
      bubble: {
        tone: "narration" as const,
        text: slide.narration,
      },
    })),
  };
}

export function listWebtoonEpisodes(bookId?: string): WebtoonEpisode[] {
  const base = bookId
    ? WEBTOON_EPISODES.filter((episode) => episode.bookId === bookId)
    : WEBTOON_EPISODES;
  if (bookId && bookId !== "genesis") {
    return base;
  }
  const covered = new Set(
    base.filter((episode) => episode.bookId === "genesis").map((episode) => episode.chapterNumber)
  );
  const fromSlides: WebtoonEpisode[] = [];
  for (let chapter = 1; chapter <= 50; chapter += 1) {
    if (covered.has(chapter)) {
      continue;
    }
    const episode = slidesAsWebtoonEpisode(chapter);
    if (episode) {
      fromSlides.push(episode);
    }
  }
  return [...base, ...fromSlides].sort((a, b) => {
    if (a.chapterNumber !== b.chapterNumber) {
      return a.chapterNumber - b.chapterNumber;
    }
    return a.id.localeCompare(b.id);
  });
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
