import { ExpressBudget } from '@/constants/programs/expressMissions';
import { DifficultyTier } from '@/types';

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export type EnergyRoute = {
  level: EnergyLevel;
  label: string;
  scoreRange: string;
  status: 'low' | 'normal' | 'good';
  description: string;
  difficulty: DifficultyTier;
  expressMinutes?: ExpressBudget;
  routeLabel: string;
};

export const ENERGY_ROUTES: EnergyRoute[] = [
  {
    level: 1,
    label: 'Drained',
    scoreRange: '0–20',
    status: 'low',
    description: 'Protect recovery. Mobility + easy volume only.',
    difficulty: 'recruit',
    expressMinutes: 8,
    routeLabel: 'Recovery · 8 min',
  },
  {
    level: 2,
    label: 'Low',
    scoreRange: '21–40',
    status: 'low',
    description: 'Keep the streak with a short tactical blast.',
    difficulty: 'recruit',
    expressMinutes: 10,
    routeLabel: 'Express · 10 min',
  },
  {
    level: 3,
    label: 'Steady',
    scoreRange: '41–60',
    status: 'normal',
    description: 'Standard mission pace — full day plan, soldier tier.',
    difficulty: 'soldier',
    routeLabel: 'Full mission · Soldier',
  },
  {
    level: 4,
    label: 'Strong',
    scoreRange: '61–80',
    status: 'good',
    description: 'Push density. Full mission with tighter rest.',
    difficulty: 'soldier',
    routeLabel: 'Full mission · Push',
  },
  {
    level: 5,
    label: 'Peak',
    scoreRange: '81–100',
    status: 'good',
    description: 'Elite stimulus — full mission at max intensity.',
    difficulty: 'elite',
    routeLabel: 'Full mission · Elite',
  },
];

export function energyToScore(level: EnergyLevel): number {
  const map: Record<EnergyLevel, number> = {
    1: 13,
    2: 32,
    3: 55,
    4: 72,
    5: 90,
  };
  return map[level];
}

export function routeForEnergy(level: EnergyLevel): EnergyRoute {
  return ENERGY_ROUTES.find((r) => r.level === level) ?? ENERGY_ROUTES[2];
}

export function nearestEnergyFromScore(score: number): EnergyLevel {
  if (score <= 20) return 1;
  if (score <= 40) return 2;
  if (score <= 60) return 3;
  if (score <= 80) return 4;
  return 5;
}
