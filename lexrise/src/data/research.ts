export type ResearchItem = {
  title: string;
  summary: string;
  takeaway: string;
  sourceLabel: string;
  href?: string;
};

export const researchFindings: ResearchItem[] = [
  {
    title: "Letter spacing often helps more than “dyslexia fonts”",
    summary:
      "Studies comparing Dyslexie and OpenDyslexic with Arial or Times New Roman often find little or no benefit from special letter shapes alone. When readers improve, extra spacing within and between words is a common reason.",
    takeaway:
      "In LexRise Font Lab, start by increasing letter and word spacing—then try Lexend or OpenDyslexic and keep what feels clearest for you.",
    sourceLabel: "Marinus et al.; Wery & Diliberto; Edutopia summary",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5629233/",
  },
  {
    title: "Structured phonics beats guessing games",
    summary:
      "Evidence-based dyslexia support centers on phonemic awareness, systematic phonics, decoding practice, and lots of successful reading reps—often aligned with Orton–Gillingham / Science of Reading principles.",
    takeaway:
      "Our games target sound–letter mapping, confusable letters (b/d/p/q), and nonsense-word decoding so readers cannot rely on memorized whole-word guessing.",
    sourceLabel: "Yale Center for Dyslexia & Creativity guidance",
    href: "https://dyslexia.yale.edu/",
  },
  {
    title: "The “only dyslexics can read scrambled text” claim is a myth",
    summary:
      "Viral posts say only people with dyslexia can read jumbled words (typoglycemia). In reality, most readers can decode text when first and last letters stay put. It is not a diagnostic test and not unique to dyslexia.",
    takeaway:
      "Try our Scramble Challenge for fun—and read the myth-bust note beside it. Real progress comes from phonics practice, not viral quizzes.",
    sourceLabel: "Typoglycemia / Cambridge-style letter scramble folklore",
  },
  {
    title: "Dyslexia is about language processing, not intelligence",
    summary:
      "Dyslexia is a neurological difference in how the brain processes written language. Many people with dyslexia excel in spatial reasoning, big-picture thinking, storytelling, entrepreneurship, and the arts.",
    takeaway:
      "Visit Accomplishments to see real-world stories—then use Font Lab and Games as daily tools, not as a measure of worth.",
    sourceLabel: "International Dyslexia Association",
    href: "https://dyslexiaida.org/",
  },
];

export type ExternalGame = {
  name: string;
  kind: string;
  why: string;
  href: string;
};

export const externalGames: ExternalGame[] = [
  {
    name: "Nonsense!",
    kind: "Phonics decoding app",
    why: "Generates nonsense words so learners must sound out phonemes instead of guessing familiar words. Built for dyslexia and struggling readers.",
    href: "https://apps.apple.com/us/app/nonsense/id938907017",
  },
  {
    name: "Nessy",
    kind: "Structured literacy games",
    why: "Orton–Gillingham–inspired phonics, spelling, and reading games for ages roughly 5–12.",
    href: "https://www.nessy.com/",
  },
  {
    name: "Starfall",
    kind: "Free phonics site",
    why: "Systematic phonics and phonemic awareness practice recommended by University of Michigan DyslexiaHelp.",
    href: "https://www.starfall.com/",
  },
  {
    name: "I Play Phonics",
    kind: "Voice-interactive phonics",
    why: "Progressive phoneme levels with voice practice and dyslexia-aware repetition design.",
    href: "https://iplayphonics.com/",
  },
  {
    name: "The Magic Potion (VR)",
    kind: "Empathy simulation",
    why: "VR experience from the Vrailexia project that presents a recipe written like phonological dyslexia perception—useful for allies, not a reading curriculum.",
    href: "https://eyeguas.itch.io/the-magic-potion-in-the-shoes-of-dyslexic-students-for-meta-quest-2",
  },
  {
    name: "Lexy",
    kind: "AI phonics tutor",
    why: "Gamified structured phonics lessons with adaptive pacing for dyslexia and ADHD-friendly short sessions.",
    href: "https://apps.apple.com/us/app/lexy-literacy-phonic-games/id1564885095",
  },
  {
    name: "ABZ Reading Scramble Mania",
    kind: "Phonics unscramble",
    why: "Picture-supported word unscrambling across CVC, digraphs, blends, vowel teams, and more.",
    href: "https://abzlearning.com/games/reading_scramble_mania/rsm.html",
  },
  {
    name: "University of Michigan DyslexiaHelp games list",
    kind: "Curated directory",
    why: "Trusted list of word games, phonics sites, and apps useful for dyslexic learners.",
    href: "https://dyslexiahelp.umich.edu/tools/fun-games-for-dyslexics/",
  },
];
