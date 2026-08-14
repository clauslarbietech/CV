/** Science classification for HERO features — prevents speculative claims at evidence-based tier. */

export type ScienceTier = "evidence-based" | "evidence-informed" | "experimental";

export type LearningDomainId =
  | "sounds"
  | "letters"
  | "words"
  | "word-parts"
  | "spelling"
  | "fluency"
  | "comprehension"
  | "working-memory"
  | "attention"
  | "listening";

export type WellbeingMetricId =
  | "confidence"
  | "independence"
  | "persistence"
  | "assistive-use"
  | "enjoyment"
  | "reading-frequency"
  | "goals";

export const SCIENCE_TIER_META: Record<
  ScienceTier,
  { label: string; description: string; color: string }
> = {
  "evidence-based": {
    label: "Evidence-Based",
    description: "Supported by systematic reviews, meta-analyses, or established structured literacy guidance.",
    color: "#34c759",
  },
  "evidence-informed": {
    label: "Evidence-Informed",
    description: "Grounded in research with mixed or context-dependent outcomes; benefits vary by learner.",
    color: "#ff9f0a",
  },
  experimental: {
    label: "Experimental",
    description: "Emerging or exploratory — not presented as established dyslexia treatment.",
    color: "#8e8e93",
  },
};

/** Maps exercise skill ids to learning profile domains */
export const SKILL_TO_DOMAIN: Record<string, LearningDomainId> = {
  phonemic: "sounds",
  mapping: "letters",
  decoding: "words",
  syllables: "word-parts",
  morphology: "word-parts",
  spelling: "spelling",
  fluency: "fluency",
  comprehension: "comprehension",
  "working-memory": "working-memory",
  attention: "attention",
  listening: "listening",
};

export const LEARNING_DOMAINS: {
  id: LearningDomainId;
  label: string;
  detail: string;
  tier: ScienceTier;
  researchNote: string;
}[] = [
  {
    id: "sounds",
    label: "Sounds",
    detail: "Phonological awareness — hear & manipulate phonemes",
    tier: "evidence-based",
    researchNote: "Phonological awareness and systematic phonics are core to Structured Literacy.",
  },
  {
    id: "letters",
    label: "Letters",
    detail: "Sound–symbol mapping & letter knowledge",
    tier: "evidence-based",
    researchNote: "Explicit sound–letter instruction supports decoding development.",
  },
  {
    id: "words",
    label: "Words",
    detail: "Decoding unfamiliar words",
    tier: "evidence-based",
    researchNote: "Nonsense-word and controlled decoding reduce whole-word guessing.",
  },
  {
    id: "word-parts",
    label: "Word Parts",
    detail: "Morphology — prefixes, roots & suffixes",
    tier: "evidence-based",
    researchNote: "Morphological awareness is part of Structured Literacy, especially for older learners.",
  },
  {
    id: "spelling",
    label: "Spelling",
    detail: "Encoding patterns & spelling rules",
    tier: "evidence-based",
    researchNote: "Spelling patterns taught explicitly alongside phonics.",
  },
  {
    id: "fluency",
    label: "Fluency",
    detail: "Accurate, efficient word recognition",
    tier: "evidence-informed",
    researchNote: "Repeated reading and paced practice support automaticity without punishing slow reading.",
  },
  {
    id: "comprehension",
    label: "Comprehension",
    detail: "Understanding what you read",
    tier: "evidence-informed",
    researchNote: "Assistive read-aloud shows modest comprehension benefits in meta-analyses.",
  },
  {
    id: "working-memory",
    label: "Working Memory",
    detail: "Holding & manipulating information",
    tier: "evidence-informed",
    researchNote: "Working memory supports reading but HERO Mind is not dyslexia treatment.",
  },
  {
    id: "attention",
    label: "Attention",
    detail: "Focus during reading tasks",
    tier: "evidence-informed",
    researchNote: "Focus training inspired by premium UX — not neurofeedback therapy.",
  },
  {
    id: "listening",
    label: "Listening",
    detail: "Auditory processing & text-to-speech use",
    tier: "evidence-informed",
    researchNote: "Text-to-speech can support comprehension; results vary by individual.",
  },
];

export const WELLBEING_METRICS: {
  id: WellbeingMetricId;
  label: string;
  detail: string;
}[] = [
  { id: "confidence", label: "Confidence", detail: "Belief that reading can improve" },
  { id: "independence", label: "Independence", detail: "Reading without constant help" },
  { id: "persistence", label: "Reading persistence", detail: "Coming back after difficulty" },
  { id: "assistive-use", label: "Assistive tools", detail: "Scan, Listen & Reader usage" },
  { id: "enjoyment", label: "Enjoyment", detail: "Finding reading activities rewarding" },
  { id: "reading-frequency", label: "Reading frequency", detail: "How often you engage with HERO" },
  { id: "goals", label: "Self-selected goals", detail: "Progress toward what you chose" },
];

export type HeroFeature = {
  id: string;
  name: string;
  tier: ScienceTier;
  domains: LearningDomainId[];
  summary: string;
  claim: string;
};

/** HERO feature catalog with science tier — use in UI to label modules honestly */
export const HERO_FEATURES: HeroFeature[] = [
  {
    id: "phonics-games",
    name: "Play & Train (phonics games)",
    tier: "evidence-informed",
    domains: ["sounds", "letters", "words"],
    summary: "Systematic reviews find serious games can improve some phonological skills and engagement.",
    claim: "May support phonics practice; gains do not always transfer to every reading skill.",
  },
  {
    id: "structured-reader",
    name: "Reader (Structured Literacy)",
    tier: "evidence-based",
    domains: ["sounds", "letters", "words", "word-parts", "spelling", "fluency"],
    summary: "Structured Literacy emphasizes explicit phonics, syllables, morphology, and spelling patterns.",
    claim: "Core reading instruction aligned with evidence-based structured literacy principles.",
  },
  {
    id: "scan-listen-loop",
    name: "Scan → Read → Listen → Highlight → Save",
    tier: "evidence-informed",
    domains: ["comprehension", "listening", "fluency"],
    summary: "Assistive technology meta-analyses show modest comprehension benefits from read-aloud tools.",
    claim: "Supports everyday reading with assistive presentation — not a replacement for instruction.",
  },
  {
    id: "morphology",
    name: "Word Parts (morphology)",
    tier: "evidence-based",
    domains: ["word-parts", "spelling", "comprehension"],
    summary: "Morphological instruction is included in Structured Literacy for older learners.",
    claim: "Teaches meaningful word parts (un + help + ful) for decoding and vocabulary.",
  },
  {
    id: "focus-lab",
    name: "Focus / Memory Lab",
    tier: "evidence-informed",
    domains: ["working-memory", "attention"],
    summary: "Neurofeedback alone does not show established reading benefits in recent systematic reviews.",
    claim: "Focus and memory exercises — separate from dyslexia intervention claims.",
  },
  {
    id: "presentation",
    name: "Reading Style (fonts & spacing)",
    tier: "evidence-informed",
    domains: ["fluency", "comprehension"],
    summary: "Letter spacing often helps more than specialty font shapes alone in comparative studies.",
    claim: "Personalized presentation; spacing and contrast may help more than font choice alone.",
  },
  {
    id: "hero-labs",
    name: "HERO Labs",
    tier: "experimental",
    domains: ["comprehension"],
    summary: "AI screening, eye tracking, VR/AR, and neurostimulation remain emerging research areas.",
    claim: "Experimental capabilities clearly distinguished from established reading support.",
  },
];

export const RESEARCH_PILLARS = [
  {
    id: "phonological",
    title: "Phonological awareness & phonics",
    tier: "evidence-based" as ScienceTier,
    summary:
      "Dyslexia involves differences in phonological/language processing—not simply reversing letters. Structured Literacy builds sound awareness, blending, segmenting, and explicit decoding.",
  },
  {
    id: "morphology",
    title: "Morphological awareness",
    tier: "evidence-based" as ScienceTier,
    summary:
      "Older children and adults benefit from seeing words as meaningful pieces: un + help + ful, re + write, predict + ion. Included in Structured Literacy approaches.",
  },
  {
    id: "fluency",
    title: "Fluency & automaticity",
    tier: "evidence-informed" as ScienceTier,
    summary:
      "Move from 'figure this word out' toward efficient recognition via paced reading, repeated reading, and controlled challenges—without punishing slow reading.",
  },
  {
    id: "assistive",
    title: "Assistive technology",
    tier: "evidence-informed" as ScienceTier,
    summary:
      "Scan, Listen, and read-aloud tools can support adolescents and adults. Text-to-speech meta-analyses show modest comprehension benefits; results vary by person and tool.",
  },
  {
    id: "games",
    title: "Game-based learning",
    tier: "evidence-informed" as ScienceTier,
    summary:
      "Serious games can improve some phonological skills and engagement, but evidence is still relatively small. Adult dyslexia remains underserved in game-based research.",
  },
  {
    id: "neuroplasticity",
    title: "Neuroplasticity",
    tier: "evidence-informed" as ScienceTier,
    summary:
      "Reading intervention can accompany brain changes in reading networks, but findings are heterogeneous. Do not simplify to 'this game rewires your brain.'",
  },
  {
    id: "neurofeedback",
    title: "Neurofeedback",
    tier: "experimental" as ScienceTier,
    summary:
      "Current evidence does not establish significant reading benefits from neurofeedback alone for dyslexia. HERO takes UX inspiration—not clinical neurofeedback claims.",
  },
  {
    id: "emerging",
    title: "Emerging: AI, eye tracking, VR/AR",
    tier: "experimental" as ScienceTier,
    summary:
      "AI-assisted screening, handwriting analysis, immersive tech, and neurostimulation are active research areas—not yet established treatments.",
  },
];

export function getFeatureTier(featureId: string): ScienceTier {
  return HERO_FEATURES.find((f) => f.id === featureId)?.tier ?? "evidence-informed";
}

export function getDomainMeta(id: LearningDomainId) {
  return LEARNING_DOMAINS.find((d) => d.id === id);
}
