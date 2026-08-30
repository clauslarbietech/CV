import { CoachPersonality, DifficultyTier, MilitaryRank } from '@/types';

/** User-facing difficulty — internal keys stay recruit/soldier/elite for saved data. */
export const DIFFICULTY_LABELS: Record<DifficultyTier, string> = {
  recruit: 'Easy',
  soldier: 'Standard',
  elite: 'Challenging',
};

export function difficultyLabel(tier: DifficultyTier): string {
  return DIFFICULTY_LABELS[tier] ?? tier;
}

/** Maps legacy military ranks to everyday fitness levels. */
const RANK_ALIASES: Record<string, MilitaryRank> = {
  Recruit: 'Starter',
  Private: 'Active',
  Corporal: 'Steady',
  Sergeant: 'Strong',
  'Staff Sergeant': 'Dedicated',
  'Master Sergeant': 'Advanced',
  Lieutenant: 'Focused',
  Captain: 'Committed',
  Major: 'Powerhouse',
  Colonel: 'Champion',
  Elite: 'Peak',
  Starter: 'Starter',
  Active: 'Active',
  Steady: 'Steady',
  Strong: 'Strong',
  Dedicated: 'Dedicated',
  Advanced: 'Advanced',
  Focused: 'Focused',
  Committed: 'Committed',
  Powerhouse: 'Powerhouse',
  Champion: 'Champion',
  Peak: 'Peak',
};

export function displayRank(rank?: string | null): MilitaryRank {
  if (!rank) return 'Starter';
  return RANK_ALIASES[rank] ?? 'Starter';
}

export const COACH_DISPLAY_NAMES: Record<CoachPersonality, string> = {
  drill_sergeant: 'Straight Talk',
  motivator: 'Cheer Coach',
  professional_trainer: 'Pro Tips',
  calm_coach: 'Gentle Guide',
};

export function coachDisplayName(id: CoachPersonality): string {
  return COACH_DISPLAY_NAMES[id] ?? 'Coach';
}
