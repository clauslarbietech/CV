import {
  ActivityLevel,
  DietaryPreference,
  Equipment,
  ExperienceLevel,
  FitnessGoal,
  Sex,
  WorkoutLocation,
} from '@/types';

export const FITNESS_GOALS: Array<{ id: FitnessGoal; label: string }> = [
  { id: 'lose_fat', label: 'Lose fat' },
  { id: 'build_muscle', label: 'Build muscle' },
  { id: 'recomposition', label: 'Recomposition' },
  { id: 'general_fitness', label: 'Improve general fitness' },
  { id: 'endurance', label: 'Improve endurance' },
  { id: 'strength', label: 'Improve strength' },
];

export const EXPERIENCE_LEVELS: Array<{ id: ExperienceLevel; label: string }> = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export const ACTIVITY_LEVELS: Array<{ id: ActivityLevel; label: string }> = [
  { id: 'sedentary', label: 'Sedentary' },
  { id: 'lightly_active', label: 'Lightly active' },
  { id: 'moderately_active', label: 'Moderately active' },
  { id: 'very_active', label: 'Very active' },
  { id: 'athlete', label: 'Athlete' },
];

export const WORKOUT_LOCATIONS: Array<{ id: WorkoutLocation; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'gym', label: 'Gym' },
  { id: 'both', label: 'Both' },
];

export const EQUIPMENT_OPTIONS: Array<{ id: Equipment; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'resistance_bands', label: 'Resistance bands' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'kettlebells', label: 'Kettlebells' },
  { id: 'pull_up_bar', label: 'Pull-up bar' },
  { id: 'full_gym', label: 'Full gym' },
];

export const SEX_OPTIONS: Array<{ id: Sex; label: string }> = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
  { id: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const DIETARY_OPTIONS: Array<{ id: DietaryPreference; label: string }> = [
  { id: 'none', label: 'No preference' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
];
