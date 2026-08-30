import { ExperienceLevel, FitnessGoal, DifficultyTier } from '@/types';

/** Map onboarding answers to a starting program + difficulty tier. */
export function recommendEnrollment(
  goal: FitnessGoal,
  experience: ExperienceLevel,
): { programId: string; difficulty: DifficultyTier; reason: string } {
  if (experience === 'advanced') {
    if (goal === 'endurance') {
      return {
        programId: 'operation-long-train',
        difficulty: 'elite',
        reason: 'Long Train · Challenging — built for serious endurance work.',
      };
    }
    if (goal === 'build_muscle') {
      return {
        programId: 'operation-long-train',
        difficulty: 'elite',
        reason: 'Long Train · Challenging — 12-week strength and density progression.',
      };
    }
    return {
      programId: 'operation-calisthenics',
      difficulty: 'elite',
      reason:
        'Bodyweight Basics · Challenging — foundation reps (not wall/skill moves yet).',
    };
  }

  if (goal === 'build_muscle') {
    if (experience === 'intermediate') {
      return {
        programId: 'operation-long-train',
        difficulty: 'soldier',
        reason: 'Long Train · Standard — progressive strength blocks.',
      };
    }
    return {
      programId: 'operation-iron-30',
      difficulty: 'soldier',
      reason: '30-Day Home Plan · Standard — muscle-friendly volume.',
    };
  }

  if (goal === 'endurance') {
    return {
      programId: 'operation-long-train',
      difficulty: 'recruit',
      reason: 'Long Train · Easy — build stamina week by week.',
    };
  }

  return {
    programId: 'operation-iron-30',
    difficulty: 'recruit',
    reason: '30-Day Home Plan · Easy — everyday home start.',
  };
}

export function nutritionHeadline(goal?: FitnessGoal | null): {
  title: string;
  accent: string;
  subtitle: string;
} {
  switch (goal) {
    case 'build_muscle':
      return {
        title: 'Fuel to',
        accent: 'Build',
        subtitle: 'Protein-forward meals for strength and recovery.',
      };
    case 'endurance':
      return {
        title: 'Fuel for',
        accent: 'Endurance',
        subtitle: 'Carbs and hydration for longer training blocks.',
      };
    case 'lose_fat':
      return {
        title: 'Eat to',
        accent: 'Shred',
        subtitle: 'Meal plans for training weeks. Each workout also gets a fuel list.',
      };
    default:
      return {
        title: 'Eat to',
        accent: 'Perform',
        subtitle: 'Balanced fuel for everyday training.',
      };
  }
}

export function defaultFuelTrackForGoal(
  goal?: FitnessGoal | null,
): 'short' | 'long' | 'tactical' {
  if (goal === 'build_muscle' || goal === 'endurance') return 'long';
  if (goal === 'lose_fat') return 'short';
  return 'tactical';
}
