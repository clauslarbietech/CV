import { MilitaryRank } from '@/types';

export const XP_REWARDS = {
  workoutCompleted: 100,
  proteinTarget: 30,
  stepTarget: 25,
  dailyCheckIn: 10,
  challengeCompleted: 500,
} as const;

export const RANK_THRESHOLDS: Array<{ rank: MilitaryRank; xp: number }> = [
  { rank: 'Recruit', xp: 0 },
  { rank: 'Private', xp: 200 },
  { rank: 'Corporal', xp: 500 },
  { rank: 'Sergeant', xp: 1000 },
  { rank: 'Staff Sergeant', xp: 1800 },
  { rank: 'Master Sergeant', xp: 2800 },
  { rank: 'Lieutenant', xp: 4000 },
  { rank: 'Captain', xp: 5500 },
  { rank: 'Major', xp: 7500 },
  { rank: 'Colonel', xp: 10000 },
  { rank: 'Elite', xp: 14000 },
];

export function rankFromXp(xp: number): MilitaryRank {
  let current: MilitaryRank = 'Recruit';
  for (const tier of RANK_THRESHOLDS) {
    if (xp >= tier.xp) current = tier.rank;
  }
  return current;
}
