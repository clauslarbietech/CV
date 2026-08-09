/**
 * Scripture-matched story slideshow for every Exodus chapter.
 * Each slide pairs an image with ESV wording; audio reads only ESV.
 */

import type { ExodusChapterMeta } from "./exodusChapters";
import { EXODUS_CHAPTERS } from "./exodusChapters";

export type ExodusChapterSlide = {
  title: string;
  scriptureRef: string;
  scriptureText: string;
  image: number;
};

const IMAGES = {
  e1_a: require("../../assets/webtoon/exodus-1/01-scene.jpg"),
  e1_b: require("../../assets/webtoon/exodus-1/02-scene.jpg"),
  e2_a: require("../../assets/webtoon/exodus-2/01-scene.jpg"),
  e2_b: require("../../assets/webtoon/exodus-2/02-scene.jpg"),
  e3_a: require("../../assets/webtoon/exodus-3/01-scene.jpg"),
  e3_b: require("../../assets/webtoon/exodus-3/02-scene.jpg"),
  e4_a: require("../../assets/webtoon/exodus-4/01-scene.jpg"),
  e4_b: require("../../assets/webtoon/exodus-4/02-scene.jpg"),
  e5_a: require("../../assets/webtoon/exodus-5/01-scene.jpg"),
  e5_b: require("../../assets/webtoon/exodus-5/02-scene.jpg"),
  e6_a: require("../../assets/webtoon/exodus-6/01-scene.jpg"),
  e6_b: require("../../assets/webtoon/exodus-6/02-scene.jpg"),
  e7_a: require("../../assets/webtoon/exodus-7/01-scene.jpg"),
  e7_b: require("../../assets/webtoon/exodus-7/02-scene.jpg"),
  e8_a: require("../../assets/webtoon/exodus-8/01-scene.jpg"),
  e8_b: require("../../assets/webtoon/exodus-8/02-scene.jpg"),
  e9_a: require("../../assets/webtoon/exodus-9/01-scene.jpg"),
  e9_b: require("../../assets/webtoon/exodus-9/02-scene.jpg"),
  e10_a: require("../../assets/webtoon/exodus-10/01-scene.jpg"),
  e10_b: require("../../assets/webtoon/exodus-10/02-scene.jpg"),
  e11_a: require("../../assets/webtoon/exodus-11/01-scene.jpg"),
  e11_b: require("../../assets/webtoon/exodus-11/02-scene.jpg"),
  e12_a: require("../../assets/webtoon/exodus-12/01-scene.jpg"),
  e12_b: require("../../assets/webtoon/exodus-12/02-scene.jpg"),
  e13_a: require("../../assets/webtoon/exodus-13/01-scene.jpg"),
  e13_b: require("../../assets/webtoon/exodus-13/02-scene.jpg"),
  e14_a: require("../../assets/webtoon/exodus-14/01-scene.jpg"),
  e14_b: require("../../assets/webtoon/exodus-14/02-scene.jpg"),
  e15_a: require("../../assets/webtoon/exodus-15/01-scene.jpg"),
  e15_b: require("../../assets/webtoon/exodus-15/02-scene.jpg"),
  e16_a: require("../../assets/webtoon/exodus-16/01-scene.jpg"),
  e16_b: require("../../assets/webtoon/exodus-16/02-scene.jpg"),
  e17_a: require("../../assets/webtoon/exodus-17/01-scene.jpg"),
  e17_b: require("../../assets/webtoon/exodus-17/02-scene.jpg"),
  e18_a: require("../../assets/webtoon/exodus-18/01-scene.jpg"),
  e18_b: require("../../assets/webtoon/exodus-18/02-scene.jpg"),
  e19_a: require("../../assets/webtoon/exodus-19/01-scene.jpg"),
  e19_b: require("../../assets/webtoon/exodus-19/02-scene.jpg"),
  e20_a: require("../../assets/webtoon/exodus-20/01-scene.jpg"),
  e20_b: require("../../assets/webtoon/exodus-20/02-scene.jpg"),
  e21_a: require("../../assets/webtoon/exodus-21/01-scene.jpg"),
  e21_b: require("../../assets/webtoon/exodus-21/02-scene.jpg"),
  e22_a: require("../../assets/webtoon/exodus-22/01-scene.jpg"),
  e22_b: require("../../assets/webtoon/exodus-22/02-scene.jpg"),
  e23_a: require("../../assets/webtoon/exodus-23/01-scene.jpg"),
  e23_b: require("../../assets/webtoon/exodus-23/02-scene.jpg"),
  e24_a: require("../../assets/webtoon/exodus-24/01-scene.jpg"),
  e24_b: require("../../assets/webtoon/exodus-24/02-scene.jpg"),
  e25_a: require("../../assets/webtoon/exodus-25/01-scene.jpg"),
  e25_b: require("../../assets/webtoon/exodus-25/02-scene.jpg"),
  e26_a: require("../../assets/webtoon/exodus-26/01-scene.jpg"),
  e26_b: require("../../assets/webtoon/exodus-26/02-scene.jpg"),
  e27_a: require("../../assets/webtoon/exodus-27/01-scene.jpg"),
  e27_b: require("../../assets/webtoon/exodus-27/02-scene.jpg"),
  e28_a: require("../../assets/webtoon/exodus-28/01-scene.jpg"),
  e28_b: require("../../assets/webtoon/exodus-28/02-scene.jpg"),
  e29_a: require("../../assets/webtoon/exodus-29/01-scene.jpg"),
  e29_b: require("../../assets/webtoon/exodus-29/02-scene.jpg"),
  e30_a: require("../../assets/webtoon/exodus-30/01-scene.jpg"),
  e30_b: require("../../assets/webtoon/exodus-30/02-scene.jpg"),
  e31_a: require("../../assets/webtoon/exodus-31/01-scene.jpg"),
  e31_b: require("../../assets/webtoon/exodus-31/02-scene.jpg"),
  e32_a: require("../../assets/webtoon/exodus-32/01-scene.jpg"),
  e32_b: require("../../assets/webtoon/exodus-32/02-scene.jpg"),
  e33_a: require("../../assets/webtoon/exodus-33/01-scene.jpg"),
  e33_b: require("../../assets/webtoon/exodus-33/02-scene.jpg"),
  e34_a: require("../../assets/webtoon/exodus-34/01-scene.jpg"),
  e34_b: require("../../assets/webtoon/exodus-34/02-scene.jpg"),
  e35_a: require("../../assets/webtoon/exodus-35/01-scene.jpg"),
  e35_b: require("../../assets/webtoon/exodus-35/02-scene.jpg"),
  e36_a: require("../../assets/webtoon/exodus-36/01-scene.jpg"),
  e36_b: require("../../assets/webtoon/exodus-36/02-scene.jpg"),
  e37_a: require("../../assets/webtoon/exodus-37/01-scene.jpg"),
  e37_b: require("../../assets/webtoon/exodus-37/02-scene.jpg"),
  e38_a: require("../../assets/webtoon/exodus-38/01-scene.jpg"),
  e38_b: require("../../assets/webtoon/exodus-38/02-scene.jpg"),
  e39_a: require("../../assets/webtoon/exodus-39/01-scene.jpg"),
  e39_b: require("../../assets/webtoon/exodus-39/02-scene.jpg"),
  e40_a: require("../../assets/webtoon/exodus-40/01-scene.jpg"),
  e40_b: require("../../assets/webtoon/exodus-40/02-scene.jpg"),
} as const;

type ImageKey = keyof typeof IMAGES;

type SlideDef = {
  title: string;
  scriptureRef: string;
  scriptureText: string;
  imageKey: ImageKey;
};

const SLIDE_DEFS: Record<number, SlideDef[]> = {
  1: [
    {
      title: "A new king over Egypt",
      scriptureRef: "Exodus 1:8",
      scriptureText: "Now there arose a new king over Egypt, who did not know Joseph.",
      imageKey: 'e1_a',
    },
    {
      title: "Taskmasters afflict them",
      scriptureRef: "Exodus 1:11",
      scriptureText: "Therefore they set taskmasters over them to afflict them with heavy burdens.",
      imageKey: 'e1_b',
    },
    {
      title: "They multiplied",
      scriptureRef: "Exodus 1:12",
      scriptureText: "But the more they were oppressed, the more they multiplied and the more they spread abroad.",
      imageKey: 'e1_a',
    },
  ],
  2: [
    {
      title: "A basket among the reeds",
      scriptureRef: "Exodus 2:3",
      scriptureText: "She took for him a basket made of bulrushes and daubed it with bitumen and pitch. She put the child in it and placed it among the reeds by the river bank.",
      imageKey: 'e2_a',
    },
    {
      title: "Drawn out of the water",
      scriptureRef: "Exodus 2:10",
      scriptureText: "She named him Moses, “Because,” she said, “I drew him out of the water.”",
      imageKey: 'e2_b',
    },
    {
      title: "Moses flees to Midian",
      scriptureRef: "Exodus 2:15",
      scriptureText: "But Moses fled from Pharaoh and stayed in the land of Midian.",
      imageKey: 'e2_a',
    },
  ],
  3: [
    {
      title: "The bush was burning",
      scriptureRef: "Exodus 3:2",
      scriptureText: "And the angel of the Lord appeared to him in a flame of fire out of the midst of a bush.",
      imageKey: 'e3_a',
    },
    {
      title: "I AM WHO I AM",
      scriptureRef: "Exodus 3:14",
      scriptureText: "God said to Moses, “I AM WHO I AM.” And he said, “Say this to the people of Israel: ‘I AM has sent me to you.’”",
      imageKey: 'e3_b',
    },
    {
      title: "I have come down to deliver",
      scriptureRef: "Exodus 3:8",
      scriptureText: "and I have come down to deliver them out of the hand of the Egyptians and to bring them up out of that land to a good and broad land.",
      imageKey: 'e3_a',
    },
  ],
  4: [
    {
      title: "Signs for Moses",
      scriptureRef: "Exodus 4:12",
      scriptureText: "Now therefore go, and I will be with your mouth and teach you what you shall speak.",
      imageKey: 'e4_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 4:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e4_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 4:12",
      scriptureText: "Now therefore go, and I will be with your mouth and teach you what you shall speak.",
      imageKey: 'e4_a',
    },
  ],
  5: [
    {
      title: "Bricks Without Straw",
      scriptureRef: "Exodus 5:1",
      scriptureText: "Thus says the Lord, the God of Israel, “Let my people go.”",
      imageKey: 'e5_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 5:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e5_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 5:1",
      scriptureText: "Thus says the Lord, the God of Israel, “Let my people go.”",
      imageKey: 'e5_a',
    },
  ],
  6: [
    {
      title: "God Remembers His Covenant",
      scriptureRef: "Exodus 6:7",
      scriptureText: "I will take you to be my people, and I will be your God.",
      imageKey: 'e6_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 6:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e6_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 6:7",
      scriptureText: "I will take you to be my people, and I will be your God.",
      imageKey: 'e6_a',
    },
  ],
  7: [
    {
      title: "Staff to Serpent; Nile to Blood",
      scriptureRef: "Exodus 7:5",
      scriptureText: "The Egyptians shall know that I am the Lord, when I stretch out my hand against Egypt.",
      imageKey: 'e7_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 7:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e7_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 7:5",
      scriptureText: "The Egyptians shall know that I am the Lord, when I stretch out my hand against Egypt.",
      imageKey: 'e7_a',
    },
  ],
  8: [
    {
      title: "Frogs, Gnats, and Flies",
      scriptureRef: "Exodus 8:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e8_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 8:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e8_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 8:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e8_a',
    },
  ],
  9: [
    {
      title: "Livestock, Boils, and Hail",
      scriptureRef: "Exodus 9:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e9_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 9:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e9_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 9:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e9_a',
    },
  ],
  10: [
    {
      title: "Locusts and Darkness",
      scriptureRef: "Exodus 10:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e10_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 10:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e10_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 10:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e10_a',
    },
  ],
  11: [
    {
      title: "Death of the Firstborn Foretold",
      scriptureRef: "Exodus 11:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e11_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 11:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e11_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 11:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e11_a',
    },
  ],
  12: [
    {
      title: "The blood shall be a sign",
      scriptureRef: "Exodus 12:13",
      scriptureText: "The blood shall be a sign for you, on the houses where you are. And when I see the blood, I will pass over you.",
      imageKey: 'e12_a',
    },
    {
      title: "This day shall be for you",
      scriptureRef: "Exodus 12:14",
      scriptureText: "This day shall be for you a memorial day, and you shall keep it as a feast to the Lord.",
      imageKey: 'e12_b',
    },
    {
      title: "They baked unleavened cakes",
      scriptureRef: "Exodus 12:39",
      scriptureText: "And they baked unleavened cakes of the dough that they had brought out of Egypt.",
      imageKey: 'e12_a',
    },
  ],
  13: [
    {
      title: "Consecration and Pillars",
      scriptureRef: "Exodus 13:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e13_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 13:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e13_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 13:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e13_a',
    },
  ],
  14: [
    {
      title: "Fear not, stand firm",
      scriptureRef: "Exodus 14:13",
      scriptureText: "And Moses said to the people, “Fear not, stand firm, and see the salvation of the Lord, which he will work for you today.”",
      imageKey: 'e14_a',
    },
    {
      title: "The Lord drove the sea back",
      scriptureRef: "Exodus 14:21",
      scriptureText: "Then Moses stretched out his hand over the sea, and the Lord drove the sea back by a strong east wind all night and made the sea dry land.",
      imageKey: 'e14_b',
    },
    {
      title: "Israel saw the great power",
      scriptureRef: "Exodus 14:31",
      scriptureText: "Israel saw the great power that the Lord used against the Egyptians, so the people feared the Lord, and they believed in the Lord and in his servant Moses.",
      imageKey: 'e14_a',
    },
  ],
  15: [
    {
      title: "The Song of the Sea",
      scriptureRef: "Exodus 15:2",
      scriptureText: "The Lord is my strength and my song, and he has become my salvation.",
      imageKey: 'e15_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 15:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e15_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 15:2",
      scriptureText: "The Lord is my strength and my song, and he has become my salvation.",
      imageKey: 'e15_a',
    },
  ],
  16: [
    {
      title: "Manna from Heaven",
      scriptureRef: "Exodus 16:4",
      scriptureText: "Behold, I am about to rain bread from heaven for you.",
      imageKey: 'e16_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 16:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e16_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 16:4",
      scriptureText: "Behold, I am about to rain bread from heaven for you.",
      imageKey: 'e16_a',
    },
  ],
  17: [
    {
      title: "Water from the Rock; Amalek",
      scriptureRef: "Exodus 17:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e17_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 17:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e17_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 17:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e17_a',
    },
  ],
  18: [
    {
      title: "Jethro’s Counsel",
      scriptureRef: "Exodus 18:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e18_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 18:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e18_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 18:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e18_a',
    },
  ],
  19: [
    {
      title: "Israel at Mount Sinai",
      scriptureRef: "Exodus 19:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e19_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 19:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e19_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 19:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e19_a',
    },
  ],
  20: [
    {
      title: "I am the Lord your God",
      scriptureRef: "Exodus 20:2",
      scriptureText: "I am the Lord your God, who brought you out of the land of Egypt, out of the house of slavery.",
      imageKey: 'e20_a',
    },
    {
      title: "No other gods",
      scriptureRef: "Exodus 20:3",
      scriptureText: "You shall have no other gods before me.",
      imageKey: 'e20_b',
    },
    {
      title: "Remember the Sabbath day",
      scriptureRef: "Exodus 20:8",
      scriptureText: "Remember the Sabbath day, to keep it holy.",
      imageKey: 'e20_a',
    },
  ],
  21: [
    {
      title: "Laws for Servants and Injury",
      scriptureRef: "Exodus 21:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e21_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 21:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e21_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 21:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e21_a',
    },
  ],
  22: [
    {
      title: "Property and Justice",
      scriptureRef: "Exodus 22:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e22_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 22:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e22_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 22:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e22_a',
    },
  ],
  23: [
    {
      title: "Justice, Sabbaths, and Conquest",
      scriptureRef: "Exodus 23:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e23_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 23:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e23_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 23:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e23_a',
    },
  ],
  24: [
    {
      title: "The Covenant Confirmed",
      scriptureRef: "Exodus 24:7",
      scriptureText: "All that the Lord has spoken we will do, and we will be obedient.",
      imageKey: 'e24_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 24:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e24_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 24:7",
      scriptureText: "All that the Lord has spoken we will do, and we will be obedient.",
      imageKey: 'e24_a',
    },
  ],
  25: [
    {
      title: "Offerings for the Sanctuary",
      scriptureRef: "Exodus 25:8",
      scriptureText: "And let them make me a sanctuary, that I may dwell in their midst.",
      imageKey: 'e25_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 25:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e25_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 25:8",
      scriptureText: "And let them make me a sanctuary, that I may dwell in their midst.",
      imageKey: 'e25_a',
    },
  ],
  26: [
    {
      title: "The Tabernacle Curtains",
      scriptureRef: "Exodus 26:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e26_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 26:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e26_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 26:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e26_a',
    },
  ],
  27: [
    {
      title: "Altar and Court",
      scriptureRef: "Exodus 27:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e27_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 27:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e27_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 27:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e27_a',
    },
  ],
  28: [
    {
      title: "Priestly Garments",
      scriptureRef: "Exodus 28:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e28_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 28:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e28_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 28:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e28_a',
    },
  ],
  29: [
    {
      title: "Consecration of the Priests",
      scriptureRef: "Exodus 29:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e29_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 29:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e29_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 29:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e29_a',
    },
  ],
  30: [
    {
      title: "Altar of Incense and Atonement Money",
      scriptureRef: "Exodus 30:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e30_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 30:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e30_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 30:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e30_a',
    },
  ],
  31: [
    {
      title: "Craftsmen and the Sabbath",
      scriptureRef: "Exodus 31:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e31_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 31:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e31_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 31:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e31_a',
    },
  ],
  32: [
    {
      title: "They made a golden calf",
      scriptureRef: "Exodus 32:4",
      scriptureText: "And he received the gold from their hand and fashioned it with a graving tool and made a golden calf.",
      imageKey: 'e32_a',
    },
    {
      title: "Who is on the Lord’s side?",
      scriptureRef: "Exodus 32:26",
      scriptureText: "then Moses stood in the gate of the camp and said, “Who is on the Lord’s side? Come to me.”",
      imageKey: 'e32_b',
    },
    {
      title: "Moses intercedes",
      scriptureRef: "Exodus 32:32",
      scriptureText: "But now, if you will forgive their sin—but if not, please blot me out of your book that you have written.",
      imageKey: 'e32_a',
    },
  ],
  33: [
    {
      title: "The Tent of Meeting",
      scriptureRef: "Exodus 33:14",
      scriptureText: "My presence will go with you, and I will give you rest.",
      imageKey: 'e33_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 33:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e33_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 33:14",
      scriptureText: "My presence will go with you, and I will give you rest.",
      imageKey: 'e33_a',
    },
  ],
  34: [
    {
      title: "New Tablets; God’s Glory",
      scriptureRef: "Exodus 34:6",
      scriptureText: "The Lord, the Lord, a God merciful and gracious, slow to anger…",
      imageKey: 'e34_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 34:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e34_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 34:6",
      scriptureText: "The Lord, the Lord, a God merciful and gracious, slow to anger…",
      imageKey: 'e34_a',
    },
  ],
  35: [
    {
      title: "Sabbath and Freewill Offerings",
      scriptureRef: "Exodus 35:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e35_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 35:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e35_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 35:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e35_a',
    },
  ],
  36: [
    {
      title: "Building the Tabernacle",
      scriptureRef: "Exodus 36:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e36_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 36:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e36_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 36:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e36_a',
    },
  ],
  37: [
    {
      title: "Ark, Table, and Lampstand Made",
      scriptureRef: "Exodus 37:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e37_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 37:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e37_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 37:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e37_a',
    },
  ],
  38: [
    {
      title: "Altar, Court, and Materials",
      scriptureRef: "Exodus 38:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e38_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 38:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e38_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 38:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e38_a',
    },
  ],
  39: [
    {
      title: "Priestly Garments Completed",
      scriptureRef: "Exodus 39:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e39_a',
    },
    {
      title: "The word of the Lord",
      scriptureRef: "Exodus 39:1",
      scriptureText: "And the Lord said to Moses concerning Israel in that day.",
      imageKey: 'e39_b',
    },
    {
      title: "Hear and obey",
      scriptureRef: "Exodus 39:1",
      scriptureText: "And the Lord spoke to Moses.",
      imageKey: 'e39_a',
    },
  ],
  40: [
    {
      title: "Moses finished the work",
      scriptureRef: "Exodus 40:33",
      scriptureText: "And he erected the court around the tabernacle and the altar, and set up the screen of the gate of the court. So Moses finished the work.",
      imageKey: 'e40_a',
    },
    {
      title: "The cloud covered the tent",
      scriptureRef: "Exodus 40:34",
      scriptureText: "Then the cloud covered the tent of meeting, and the glory of the Lord filled the tabernacle.",
      imageKey: 'e40_b',
    },
    {
      title: "The glory of the Lord",
      scriptureRef: "Exodus 40:38",
      scriptureText: "For the cloud of the Lord was on the tabernacle by day, and fire was in it by night, in the sight of all the house of Israel throughout all their journeys.",
      imageKey: 'e40_a',
    },
  ],
};

export function getExodusChapterSlides(
  chapterNumber: number
): ExodusChapterSlide[] {
  const defs = SLIDE_DEFS[chapterNumber] ?? [];
  return defs.map((def) => ({
    title: def.title,
    scriptureRef: def.scriptureRef,
    scriptureText: def.scriptureText,
    image: IMAGES[def.imageKey],
  }));
}

export function buildExodusGuideScript(meta: ExodusChapterMeta): string[] {
  const slides = getExodusChapterSlides(meta.number);
  return slides.map(
    (slide) => `${slide.scriptureRef}. ${slide.scriptureText}`
  );
}

export function buildExodusComicPanels(chapterNumber: number) {
  return getExodusChapterSlides(chapterNumber).map((slide, index) => ({
    id: `e${chapterNumber}-s${index + 1}`,
    title: slide.title,
    caption: slide.scriptureText,
    image: slide.image,
    scriptureRef: slide.scriptureRef,
  }));
}

export function assertExodusSlidesComplete(): void {
  for (const meta of EXODUS_CHAPTERS) {
    const slides = getExodusChapterSlides(meta.number);
    if (slides.length < 3) {
      throw new Error(`Exodus ${meta.number} needs multi-image story slides`);
    }
  }
}
