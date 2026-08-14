export type HeroMode = "kids" | "adult";

export type HeroGoal =
  | "reading"
  | "confidence"
  | "school"
  | "work"
  | "focus"
  | "listen";

export type ReadingFont = "lexend" | "opendyslexic" | "atkinson" | "verdana" | "system";

export type AccessibilityPreference = {
  font: ReadingFont;
  fontSize: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  background: "dark" | "soft" | "cream" | "high-contrast";
  lineFocus: boolean;
  highlightWords: boolean;
  maskUnfocused: boolean;
  showSyllables: boolean;
};

export type TTSPreference = {
  rate: number;
  voiceLabel: string;
  highlightWords: boolean;
};

export type LearningProfile = {
  phonicsLevel: number;
  preferredDifficulty: "easy" | "medium" | "hard";
  recentSkills: string[];
};

export type ExperiencePreference = {
  reduceMotion: boolean;
  skipIntro: boolean;
  soundOff: boolean;
  /** User has seen the full cinematic intro at least once */
  introSeenOnce: boolean;
  lastIntroAt: string | null;
};

export type HeroProfile = {
  displayName: string;
  mode: HeroMode;
  goals: HeroGoal[];
  onboardingComplete: boolean;
  accessibility: AccessibilityPreference;
  tts: TTSPreference;
  learning: LearningProfile;
  experience: ExperiencePreference;
};

export type PerformanceEvent = {
  id: string;
  skill: string;
  exerciseId: string;
  correct: boolean;
  responseMs: number;
  hintsUsed: number;
  timestamp: string;
};

export type PracticeSummary = {
  totalSessions: number;
  totalMinutes: number;
  activitiesCompleted: number;
  lastActiveDate: string | null;
  /** Encouragement only — never punitive for kids */
  daysActiveThisWeek: number;
};

export type LibraryItem = {
  id: string;
  title: string;
  text: string;
  source: "scan" | "paste" | "sample";
  createdAt: string;
};

export type ExerciseAttempt = {
  id: string;
  exerciseId: string;
  skill: string;
  correct: boolean;
  responseMs: number;
  hintsUsed: number;
  createdAt: string;
};

export const DEFAULT_ACCESSIBILITY: AccessibilityPreference = {
  font: "lexend",
  fontSize: 18,
  letterSpacing: 0.06,
  wordSpacing: 0.14,
  lineHeight: 1.75,
  background: "dark",
  lineFocus: false,
  highlightWords: true,
  maskUnfocused: false,
  showSyllables: false,
};

export const DEFAULT_TTS: TTSPreference = {
  rate: 1,
  voiceLabel: "Calm",
  highlightWords: true,
};

export const DEFAULT_LEARNING: LearningProfile = {
  phonicsLevel: 1,
  preferredDifficulty: "easy",
  recentSkills: [],
};

export const DEFAULT_EXPERIENCE: ExperiencePreference = {
  reduceMotion: false,
  skipIntro: false,
  soundOff: false,
  introSeenOnce: false,
  lastIntroAt: null,
};

export const DEFAULT_PROFILE: HeroProfile = {
  displayName: "",
  mode: "adult",
  goals: [],
  onboardingComplete: false,
  accessibility: DEFAULT_ACCESSIBILITY,
  tts: DEFAULT_TTS,
  learning: DEFAULT_LEARNING,
  experience: DEFAULT_EXPERIENCE,
};

export const SAMPLE_SCAN_TEXT =
  "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world. — Albert Einstein";

export const READ_SKILLS = [
  { id: "phonemic", label: "Sound Quest", detail: "Hear and match sounds", tier: "evidence-based" as const },
  { id: "mapping", label: "Letter Match", detail: "Connect letters to sounds", tier: "evidence-based" as const },
  { id: "decoding", label: "Word Builder", detail: "Sound out new words", tier: "evidence-based" as const },
  { id: "morphology", label: "Word Parts", detail: "Prefixes, roots & suffixes", tier: "evidence-based" as const },
  { id: "syllables", label: "Syllable Split", detail: "Break words into parts", tier: "evidence-based" as const },
  { id: "fluency", label: "Reader Flow", detail: "Read smoothly with meaning", tier: "evidence-informed" as const },
] as const;

export const HERO_FLOW_OPTIONS = [
  { id: "scan", icon: "📷", label: "Scan something", href: "/scan", zone: "live" as const },
  { id: "listen", icon: "🔊", label: "Listen to something", href: "/listen", zone: "live" as const },
  { id: "read", icon: "📖", label: "Help me read", href: "/read", zone: "grow" as const },
  { id: "write", icon: "✏️", label: "Help me write", href: "/reader", zone: "grow" as const },
  { id: "play", icon: "🎮", label: "Play & train", href: "/games", zone: "play" as const },
  { id: "focus", icon: "🧠", label: "Focus", href: "/train", zone: "play" as const },
  { id: "simplify", icon: "✨", label: "Simplify something", href: "/scan", zone: "live" as const },
] as const;
