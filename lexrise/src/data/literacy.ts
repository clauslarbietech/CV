/** Structured Literacy content — phonics, morphology, syllables, fluency, spelling */

export type MorphologyItem = {
  word: string;
  parts: string[];
  meaning: string;
  /** Correct order of parts */
  answer: string[];
};

export type PhonemeItem = {
  word: string;
  phonemes: string[];
  prompt: string;
  answer: string;
  options: string[];
};

export type SyllableItem = {
  word: string;
  syllables: string[];
  pattern: string;
};

export type SpellingItem = {
  prompt: string;
  sounds: string;
  answer: string;
  pattern: string;
};

export type FluencyPassage = {
  id: string;
  title: string;
  text: string;
  wordCount: number;
  /** Soft target seconds — never used punitively */
  gentlePaceSec: number;
  comprehension: {
    prompt: string;
    options: string[];
    answer: string;
  };
};

/** Morphological awareness — evidence-based for older learners */
export const morphologyItems: MorphologyItem[] = [
  {
    word: "unhelpful",
    parts: ["un", "help", "ful"],
    meaning: "not giving help",
    answer: ["un", "help", "ful"],
  },
  {
    word: "rewrite",
    parts: ["re", "write"],
    meaning: "write again",
    answer: ["re", "write"],
  },
  {
    word: "prediction",
    parts: ["predict", "ion"],
    meaning: "something said before it happens",
    answer: ["predict", "ion"],
  },
  {
    word: "careless",
    parts: ["care", "less"],
    meaning: "without care",
    answer: ["care", "less"],
  },
  {
    word: "disappear",
    parts: ["dis", "appear"],
    meaning: "go out of sight",
    answer: ["dis", "appear"],
  },
  {
    word: "teacher",
    parts: ["teach", "er"],
    meaning: "one who teaches",
    answer: ["teach", "er"],
  },
  {
    word: "happiness",
    parts: ["happy", "ness"],
    meaning: "the state of being happy",
    answer: ["happy", "ness"],
  },
  {
    word: "transport",
    parts: ["trans", "port"],
    meaning: "carry across",
    answer: ["trans", "port"],
  },
  {
    word: "preview",
    parts: ["pre", "view"],
    meaning: "see beforehand",
    answer: ["pre", "view"],
  },
  {
    word: "kindness",
    parts: ["kind", "ness"],
    meaning: "the quality of being kind",
    answer: ["kind", "ness"],
  },
  {
    word: "uncomfortable",
    parts: ["un", "comfort", "able"],
    meaning: "not able to feel comfort",
    answer: ["un", "comfort", "able"],
  },
  {
    word: "international",
    parts: ["inter", "nation", "al"],
    meaning: "between nations",
    answer: ["inter", "nation", "al"],
  },
  {
    word: "reconstruction",
    parts: ["re", "construct", "ion"],
    meaning: "the act of building again",
    answer: ["re", "construct", "ion"],
  },
  {
    word: "misunderstand",
    parts: ["mis", "under", "stand"],
    meaning: "understand wrongly",
    answer: ["mis", "under", "stand"],
  },
  {
    word: "biography",
    parts: ["bio", "graphy"],
    meaning: "writing about a life",
    answer: ["bio", "graphy"],
  },
];

/** Phonemic awareness — identify / blend / segment sounds */
export const phonemeItems: PhonemeItem[] = [
  {
    word: "cat",
    phonemes: ["/k/", "/a/", "/t/"],
    prompt: "What is the first sound in cat?",
    answer: "/k/",
    options: ["/k/", "/a/", "/t/", "/s/"],
  },
  {
    word: "ship",
    phonemes: ["/sh/", "/i/", "/p/"],
    prompt: "What is the first sound in ship?",
    answer: "/sh/",
    options: ["/s/", "/sh/", "/ch/", "/th/"],
  },
  {
    word: "dog",
    phonemes: ["/d/", "/o/", "/g/"],
    prompt: "What is the last sound in dog?",
    answer: "/g/",
    options: ["/d/", "/o/", "/g/", "/b/"],
  },
  {
    word: "fish",
    phonemes: ["/f/", "/i/", "/sh/"],
    prompt: "What is the middle sound in fish?",
    answer: "/i/",
    options: ["/f/", "/i/", "/a/", "/sh/"],
  },
  {
    word: "chat",
    phonemes: ["/ch/", "/a/", "/t/"],
    prompt: "What is the first sound in chat?",
    answer: "/ch/",
    options: ["/c/", "/ch/", "/sh/", "/k/"],
  },
  {
    word: "blend",
    phonemes: ["/b/", "/l/", "/e/", "/n/", "/d/"],
    prompt: "How many sounds do you hear in blend?",
    answer: "5",
    options: ["3", "4", "5", "6"],
  },
  {
    word: "thin",
    phonemes: ["/th/", "/i/", "/n/"],
    prompt: "What is the first sound in thin?",
    answer: "/th/",
    options: ["/t/", "/th/", "/f/", "/s/"],
  },
  {
    word: "map",
    phonemes: ["/m/", "/a/", "/p/"],
    prompt: "If you change /m/ to /t/ in map, what word do you get?",
    answer: "tap",
    options: ["tap", "cap", "nap", "sap"],
  },
];

/** Syllable division — Structured Literacy */
export const syllableItems: SyllableItem[] = [
  { word: "window", syllables: ["win", "dow"], pattern: "VC/CV" },
  { word: "rabbit", syllables: ["rab", "bit"], pattern: "VC/CV" },
  { word: "open", syllables: ["o", "pen"], pattern: "V/CV" },
  { word: "tiger", syllables: ["ti", "ger"], pattern: "V/CV" },
  { word: "basket", syllables: ["bas", "ket"], pattern: "VC/CV" },
  { word: "music", syllables: ["mu", "sic"], pattern: "V/CV" },
  { word: "problem", syllables: ["prob", "lem"], pattern: "VC/CV" },
  { word: "silent", syllables: ["si", "lent"], pattern: "V/CV" },
  { word: "carpet", syllables: ["car", "pet"], pattern: "VC/CV" },
  { word: "robot", syllables: ["ro", "bot"], pattern: "V/CV" },
];

/** Spelling patterns — encoding alongside phonics */
export const spellingItems: SpellingItem[] = [
  { prompt: "Spell the word for a pet that meows", sounds: "/k/ /a/ /t/", answer: "cat", pattern: "CVC" },
  { prompt: "Spell the word that means a boat", sounds: "/sh/ /i/ /p/", answer: "ship", pattern: "digraph" },
  { prompt: "Spell the word for when you talk", sounds: "/ch/ /a/ /t/", answer: "chat", pattern: "digraph" },
  { prompt: "Spell the word for not thick", sounds: "/th/ /i/ /n/", answer: "thin", pattern: "digraph" },
  { prompt: "Spell the word for a store", sounds: "/sh/ /o/ /p/", answer: "shop", pattern: "digraph" },
  { prompt: "Spell the word for a color", sounds: "/r/ /e/ /d/", answer: "red", pattern: "CVC" },
  { prompt: "Spell the word for a bright sky object", sounds: "/s/ /u/ /n/", answer: "sun", pattern: "CVC" },
  { prompt: "Spell the word that lives in water", sounds: "/f/ /i/ /sh/", answer: "fish", pattern: "digraph" },
];

/** Fluency passages — repeated reading without speed punishment */
export const fluencyPassages: FluencyPassage[] = [
  {
    id: "stars",
    title: "Night sky",
    text: "The night sky is full of stars. Some look bright. Some look soft and far away. People look up and wonder. Reading about stars can feel like a quiet adventure.",
    wordCount: 38,
    gentlePaceSec: 45,
    comprehension: {
      prompt: "What fills the night sky in this passage?",
      options: ["Stars", "Clouds", "Birds", "Planes"],
      answer: "Stars",
    },
  },
  {
    id: "garden",
    title: "The garden",
    text: "In the garden, seeds wait under the soil. Rain comes. Sun comes. Green leaves push up. Growth takes time. Strong readers grow the same way—one careful step at a time.",
    wordCount: 36,
    gentlePaceSec: 42,
    comprehension: {
      prompt: "What do seeds need before green leaves push up?",
      options: ["Rain and sun", "Wind only", "Ice", "Noise"],
      answer: "Rain and sun",
    },
  },
  {
    id: "bridge",
    title: "Crossing the bridge",
    text: "A bridge connects two sides of a river. Words connect sounds to meaning. When you read a sentence again, the path feels clearer. Practice builds a bridge you can trust.",
    wordCount: 35,
    gentlePaceSec: 40,
    comprehension: {
      prompt: "According to the passage, what builds a bridge you can trust?",
      options: ["Practice", "Luck", "Speed", "Silence"],
      answer: "Practice",
    },
  },
];

/** Simple text simplification heuristics for LIVE assistive loop */
export function simplifyText(input: string): string {
  return input
    .replace(/\butilize\b/gi, "use")
    .replace(/\bapproximately\b/gi, "about")
    .replace(/\bdemonstrate\b/gi, "show")
    .replace(/\badditional\b/gi, "more")
    .replace(/\bcommence\b/gi, "start")
    .replace(/\bterminate\b/gi, "end")
    .replace(/\bpurchase\b/gi, "buy")
    .replace(/\bassist\b/gi, "help")
    .replace(/\brequire\b/gi, "need")
    .replace(/\bobtain\b/gi, "get")
    .replace(/\bregarding\b/gi, "about")
    .replace(/\bin order to\b/gi, "to")
    .replace(/\bdue to the fact that\b/gi, "because")
    .replace(/\bat this point in time\b/gi, "now")
    .replace(/([.!?])\s+/g, "$1\n\n")
    .trim();
}
