export type FitnessGoal =
  | 'lose_fat'
  | 'build_muscle'
  | 'recomposition'
  | 'general_fitness'
  | 'endurance'
  | 'strength';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'athlete';

export type WorkoutLocation = 'home' | 'gym' | 'both';

export type Equipment =
  | 'none'
  | 'resistance_bands'
  | 'dumbbells'
  | 'kettlebells'
  | 'pull_up_bar'
  | 'full_gym';

export type CoachPersonality =
  | 'drill_sergeant'
  | 'motivator'
  | 'professional_trainer'
  | 'calm_coach';

export type Sex = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type DietaryPreference =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'keto'
  | 'paleo'
  | 'halal'
  | 'kosher';

export type DifficultyTier = 'recruit' | 'soldier' | 'elite';

export type ProgramCategory =
  | 'fat_burn'
  | 'muscle'
  | 'conditioning'
  | 'discipline'
  | 'calisthenics'
  | 'strength'
  | 'endurance';

/** Everyday fitness level (legacy military rank names may still exist in storage). */
export type MilitaryRank =
  | 'Starter'
  | 'Active'
  | 'Steady'
  | 'Strong'
  | 'Dedicated'
  | 'Advanced'
  | 'Focused'
  | 'Committed'
  | 'Powerhouse'
  | 'Champion'
  | 'Peak';

/** Visual body frame — not clothing size; used for Now/Goal silhouettes. */
export type BodyFrameSize =
  | 'small'
  | 'mid'
  | 'medium'
  | 'large'
  | 'xl'
  | 'xxl'
  | 'plus';

export interface ProgressPhotoEntry {
  id: string;
  uri: string;
  capturedAt: string;
  weightKg?: number;
  note?: string;
}

export interface BodyVisionState {
  currentFrame: BodyFrameSize;
  goalFrame: BodyFrameSize;
  currentPhotoUri?: string | null;
  /** Weight when vision was first set — anchors weight-linked journey. */
  startWeightKg?: number;
  /** Dated full-body check-ins for side-by-side comparison. */
  photoTimeline?: ProgressPhotoEntry[];
  linkedProgramId?: string;
  updatedAt: string;
}

export type WeightUnit = 'kg' | 'lb';

export interface UserProfile {
  id: string;
  firstName: string;
  email?: string;
  age?: number;
  sex?: Sex;
  heightCm?: number;
  currentWeightKg?: number;
  goalWeightKg?: number;
  /** Preferred display unit for weight inputs and summaries. */
  weightUnit?: WeightUnit;
  bodyVision?: BodyVisionState;
  primaryGoal?: FitnessGoal;
  experienceLevel?: ExperienceLevel;
  activityLevel?: ActivityLevel;
  workoutLocation?: WorkoutLocation;
  equipment: Equipment[];
  trainingDaysPerWeek?: number;
  preferredDurationMin?: number;
  dietaryPreference?: DietaryPreference;
  foodAllergies: string[];
  physicalLimitations: string[];
  injuries: string[];
  coachPersonality: CoachPersonality;
  notificationEnabled: boolean;
  onboardingCompleted: boolean;
  xp: number;
  rank: MilitaryRank;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  reps?: number | string;
  durationSec?: number;
  perSide?: boolean;
  notes?: string;
  recruit?: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
  soldier?: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
  elite?: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
}

export interface ProgramDay {
  day: number;
  title: string;
  subtitle?: string;
  focus: string[];
  rounds?: number;
  restSec?: { min: number; max: number };
  estimatedMinutes: { min: number; max: number };
  exercises: ExerciseDefinition[];
  isRecovery?: boolean;
  isFinalTest?: boolean;
  coachMessage?: string;
  extraBlocks?: Array<{
    title: string;
    description: string;
  }>;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  subtitle: string;
  categories: ProgramCategory[];
  durationDays: number;
  equipment: string;
  averageWorkout: string;
  difficulty: string;
  goals: string[];
  featured: boolean;
  militaryThemed: boolean;
  days: ProgramDay[];
}

export interface UserProgramEnrollment {
  programId: string;
  currentDay: number;
  difficulty: DifficultyTier;
  startedAt: string;
  completedDayIds: number[];
  completedAt?: string;
}

export interface ExerciseSetLog {
  exerciseId: string;
  exerciseName: string;
  round: number;
  targetReps?: number;
  completedReps?: number;
  targetDurationSec?: number;
  completedDurationSec?: number;
  skipped?: boolean;
  modified?: boolean;
  completedAt: string;
}

export interface WorkoutSessionLog {
  id: string;
  programId: string;
  day: number;
  startedAt: string;
  completedAt?: string;
  durationSec?: number;
  difficultyRating?: number;
  notes?: string;
  exerciseLogs: ExerciseSetLog[];
  roundsCompleted: number;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export type SessionPhase =
  | 'briefing'
  | 'exercise'
  | 'hold'
  | 'rest'
  | 'rating'
  | 'complete';

export interface ActiveWorkoutSession {
  id: string;
  programId: string;
  day: number;
  difficulty: DifficultyTier;
  /** Present when mission was converted to an 8/10/15-min express strategy. */
  expressMinutes?: 8 | 10 | 15;
  startedAt: string;
  elapsedSec: number;
  currentRound: number;
  totalRounds: number;
  exerciseIndex: number;
  phase: SessionPhase;
  restRemainingSec: number;
  holdRemainingSec: number;
  exerciseLogs: ExerciseSetLog[];
  difficultyRating?: number;
}

export interface DailyProgress {
  date: string;
  workoutCompleted: boolean;
  steps: number;
  stepsTarget: number;
  proteinG: number;
  proteinTarget: number;
  calories: number;
  calorieTarget: number;
  waterMl: number;
  waterTarget: number;
  checkInCompleted: boolean;
  supplementsCompleted: boolean;
  medicationsLogged: boolean;
  /** Self-reported energy (1–5). Drives score range + workout route. */
  energyLevel?: 1 | 2 | 3 | 4 | 5 | null;
}

export interface StreakState {
  workoutStreak: number;
  activityStreak: number;
  nutritionStreak: number;
  longestWorkoutStreak: number;
}

export interface BodyMeasurements {
  weightKg?: number;
  waistCm?: number;
  chestCm?: number;
  armsCm?: number;
  legsCm?: number;
  recordedAt: string;
}

export interface OnboardingDraft {
  firstName: string;
  age: string;
  sex: Sex | '';
  heightCm: string;
  currentWeightKg: string;
  goalWeightKg: string;
  primaryGoal: FitnessGoal | '';
  experienceLevel: ExperienceLevel | '';
  activityLevel: ActivityLevel | '';
  workoutLocation: WorkoutLocation | '';
  equipment: Equipment[];
  trainingDaysPerWeek: number;
  preferredDurationMin: number;
  dietaryPreference: DietaryPreference;
  foodAllergies: string;
  physicalLimitations: string;
  injuries: string;
  coachPersonality: CoachPersonality;
  notificationEnabled: boolean;
}
