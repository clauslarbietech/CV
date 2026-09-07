export type MetricStatus = 'good' | 'normal' | 'low' | 'high';

export function ratioStatus(
  value: number,
  target: number,
  opts?: { lowBelow?: number; highAbove?: number },
): MetricStatus {
  if (target <= 0) return 'normal';
  const ratio = value / target;
  const lowBelow = opts?.lowBelow ?? 0.6;
  const highAbove = opts?.highAbove ?? 1.15;
  if (ratio >= 0.85 && ratio <= 1.05) return 'good';
  if (ratio >= lowBelow && ratio <= highAbove) return 'normal';
  if (ratio < lowBelow) return 'low';
  return 'high';
}

export function readinessScore(input: {
  programProgress: number;
  workoutDone: boolean;
  medsProgress: number;
  fuelProgress: number;
  streakDays: number;
}): number {
  const streakBoost = Math.min(1, input.streakDays / 7) * 0.1;
  const workout = input.workoutDone ? 0.25 : 0;
  const score =
    input.programProgress * 0.3 +
    workout +
    input.medsProgress * 0.15 +
    input.fuelProgress * 0.2 +
    streakBoost;
  return Math.round(Math.max(0, Math.min(100, score * 100)));
}

export function readinessLabel(score: number): MetricStatus {
  if (score >= 80) return 'good';
  if (score >= 60) return 'normal';
  if (score >= 40) return 'low';
  return 'low';
}

export function readinessWord(score: number): string {
  const status = readinessLabel(score);
  if (status === 'good') return 'Good';
  if (status === 'normal') return 'Normal';
  return 'Low';
}

export function averageProgress(ratios: number[]): number {
  if (!ratios.length) return 0;
  return ratios.reduce((sum, r) => sum + Math.min(1, r), 0) / ratios.length;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}hr ${m}min` : `${h}hr`;
}

export function formatMl(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`;
  return `${ml}ml`;
}
