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

export type HeroProfile = {
  displayName: string;
  mode: HeroMode;
  goals: HeroGoal[];
  onboardingComplete: boolean;
  accessibility: AccessibilityPreference;
  tts: TTSPreference;
  learning: LearningProfile;
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

export const DEFAULT_PROFILE: HeroProfile = {
  displayName: "",
  mode: "adult",
  goals: [],
  onboardingComplete: false,
  accessibility: DEFAULT_ACCESSIBILITY,
  tts: DEFAULT_TTS,
  learning: DEFAULT_LEARNING,
};

export const SAMPLE_SCAN_TEXT =
  "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world. — Albert Einstein";

export const READ_SKILLS = [
  { id: "phonemic", label: "Phonemic awareness", detail: "Hear and match sounds" },
  { id: "mapping", label: "Sound–letter mapping", detail: "Connect letters to sounds" },
  { id: "decoding", label: "Decoding", detail: "Sound out new words" },
  { id: "syllables", label: "Syllables", detail: "Break words into parts" },
  { id: "fluency", label: "Fluency", detail: "Read smoothly with meaning" },
] as const;
