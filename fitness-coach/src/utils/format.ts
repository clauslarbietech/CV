export function formatDuration(minutes: { min: number; max: number }): string {
  if (minutes.min === minutes.max) return `${minutes.min} minutes`;
  return `${minutes.min}-${minutes.max} minutes`;
}

export function formatRest(rest?: { min: number; max: number }): string | null {
  if (!rest) return null;
  return `${rest.min}-${rest.max} seconds`;
}

export function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
