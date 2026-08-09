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

export type MilitaryRank =
  | 'Recruit'
  | 'Private'
  | 'Corporal'
  | 'Sergeant'
  | 'Staff Sergeant'
  | 'Master Sergeant'
  | 'Lieutenant'
  | 'Captain'
  | 'Major'
  | 'Colonel'
  | 'Elite';

export interface UserProfile {
  id: string;
  firstName: string;
  email?: string;
  age?: number;
  sex?: Sex;
  heightCm?: number;
  currentWeightKg?: number;
  goalWeightKg?: number;
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

export interface WorkoutSessionLog {
  id: string;
  programId: string;
  day: number;
  startedAt: string;
  completedAt?: string;
  durationSec?: number;
  difficultyRating?: number;
  notes?: string;
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
