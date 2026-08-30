import { displayRank } from '@/constants/displayLabels';
import { MilitaryRank } from '@/types';

export const XP_REWARDS = {
  workoutCompleted: 100,
  proteinTarget: 30,
  stepTarget: 25,
  dailyCheckIn: 10,
  challengeCompleted: 500,
} as const;

export const RANK_THRESHOLDS: Array<{ rank: MilitaryRank; xp: number }> = [
  { rank: 'Starter', xp: 0 },
  { rank: 'Active', xp: 200 },
  { rank: 'Steady', xp: 500 },
  { rank: 'Strong', xp: 1000 },
  { rank: 'Dedicated', xp: 1800 },
  { rank: 'Advanced', xp: 2800 },
  { rank: 'Focused', xp: 4000 },
  { rank: 'Committed', xp: 5500 },
  { rank: 'Powerhouse', xp: 7500 },
  { rank: 'Champion', xp: 10000 },
  { rank: 'Peak', xp: 14000 },
];

export function rankFromXp(xp: number): MilitaryRank {
  let current: MilitaryRank = 'Starter';
  for (const tier of RANK_THRESHOLDS) {
    if (xp >= tier.xp) current = tier.rank;
  }
  return displayRank(current);
}
