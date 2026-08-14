import type { ScienceTier } from "@/lib/hero/science";

export type ResearchItem = {
  title: string;
  summary: string;
  takeaway: string;
  sourceLabel: string;
  tier: ScienceTier;
  href?: string;
};

export const researchFindings: ResearchItem[] = [
  {
    title: "Dyslexia is language processing—not letter reversal",
    summary:
      "Current research points to differences in phonological and language processing, reading networks, automaticity, and—in some individuals—visual/temporal processing, with substantial variation between people.",
    takeaway: "HERO builds around phonics, morphology, fluency, and assistive reading—not myths about reversed letters.",
    sourceLabel: "International Dyslexia Association",
    tier: "evidence-based",
    href: "https://dyslexiaida.org/",
  },
  {
    title: "Structured Literacy: phonics, morphology & explicit instruction",
    summary:
      "Evidence-based support centers on phonemic awareness, systematic phonics, blending, segmenting, decoding, syllables, spelling patterns, and morphology—taught explicitly rather than discovered alone.",
    takeaway: "Reader and Play & Train target sound–letter mapping, word parts, and controlled decoding.",
    sourceLabel: "Yale Center for Dyslexia & Creativity",
    tier: "evidence-based",
    href: "https://dyslexia.yale.edu/",
  },
  {
    title: "Morphological awareness for older learners",
    summary:
      "Structured Literacy includes morphology: teaching meaningful word parts (un + help + ful, re + write, predict + ion) supports decoding and vocabulary for children through adults.",
    takeaway: "HERO Word Parts trains morphology—especially valuable for teens and adults.",
    sourceLabel: "Structured Literacy / IDA guidance",
    tier: "evidence-based",
    href: "https://dyslexiaida.org/",
  },
  {
    title: "Letter spacing often helps more than specialty fonts",
    summary:
      "Studies comparing Dyslexie and OpenDyslexic with common fonts often find little benefit from letter shapes alone. Spacing within and between words is a frequent reason readers improve.",
    takeaway: "In Reading Style, increase spacing first—then try fonts and keep what feels clearest.",
    sourceLabel: "Marinus et al.; Wery & Diliberto",
    tier: "evidence-informed",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5629233/",
  },
  {
    title: "Assistive technology & text-to-speech",
    summary:
      "Assistive technologies can help adolescents and adults with learning disabilities, though results differ by tool and person. Text-to-speech meta-analyses show modest positive effects on reading comprehension.",
    takeaway: "Scan → Read → Listen → Highlight → Save is a flagship HERO loop—not a replacement for instruction.",
    sourceLabel: "Assistive technology & TTS research summaries",
    tier: "evidence-informed",
  },
  {
    title: "Game-based dyslexia learning: promising but limited",
    summary:
      "Systematic reviews find serious games can improve some phonological skills and engagement, but evidence is relatively small and gains do not always transfer to every untreated reading skill. Adult dyslexia remains underserved in game-based research.",
    takeaway: "HERO Adult is an opportunity—games support practice without overclaiming transfer.",
    sourceLabel: "Serious games systematic reviews (incl. 2026 primary-school concentration)",
    tier: "evidence-informed",
  },
  {
    title: "Neuroplasticity without oversimplification",
    summary:
      "Reading intervention can accompany changes in brain systems involved in reading, but neuroscience findings are heterogeneous. This should not be simplified into 'this app rewires your brain.'",
    takeaway: "HERO Mind supports focus separately—never marketed as dyslexia treatment.",
    sourceLabel: "Reading intervention neuroscience literature",
    tier: "evidence-informed",
  },
  {
    title: "Neurofeedback does not establish reading benefits alone",
    summary:
      "A 2025 systematic review concluded current evidence does not establish significant reading benefits from neurofeedback alone for dyslexia.",
    takeaway: "HERO takes Mendi-inspired UX inspiration—calm interface, focus sessions—not neurofeedback therapy claims.",
    sourceLabel: "Neurofeedback systematic review (2025)",
    tier: "experimental",
  },
  {
    title: "The scrambled-text myth is not diagnostic",
    summary:
      "Viral posts claim only people with dyslexia can read jumbled words. Most readers decode when first and last letters stay put. It is not a diagnostic test.",
    takeaway: "Scramble Challenge is for myth-busting fun—real progress comes from structured practice.",
    sourceLabel: "Typoglycemia folklore",
    tier: "evidence-informed",
  },
  {
    title: "Emerging: AI, eye tracking, VR/AR, neurostimulation",
    summary:
      "Recent reviews describe AI-assisted screening, handwriting analysis, immersive technologies, and brain-stimulation approaches. Many are not mature enough to present as established treatments.",
    takeaway: "HERO Labs keeps experimental capabilities clearly separated from evidence-based reading support.",
    sourceLabel: "Emerging dyslexia technology reviews",
    tier: "experimental",
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
    why: "Generates nonsense words so learners must sound out phonemes instead of guessing familiar words.",
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
    why: "Systematic phonics and phonemic awareness practice.",
    href: "https://www.starfall.com/",
  },
  {
    name: "Lexy",
    kind: "AI phonics tutor",
    why: "Gamified structured phonics with adaptive pacing for short sessions.",
    href: "https://apps.apple.com/us/app/lexy-literacy-phonic-games/id1564885095",
  },
  {
    name: "University of Michigan DyslexiaHelp games list",
    kind: "Curated directory",
    why: "Trusted list of word games, phonics sites, and apps useful for struggling readers.",
    href: "https://dyslexiahelp.umich.edu/tools/fun-games-for-dyslexics/",
  },
];
