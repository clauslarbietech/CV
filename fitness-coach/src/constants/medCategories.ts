export type MedCategory =
  | 'morning'
  | 'midday'
  | 'evening'
  | 'bedtime'
  | 'as-needed'
  | 'supplement';

export const MED_CATEGORIES: MedCategory[] = [
  'morning',
  'midday',
  'evening',
  'bedtime',
  'as-needed',
  'supplement',
];

export const MED_CATEGORY_LABELS: Record<MedCategory, string> = {
  morning: 'Morning',
  midday: 'Midday',
  evening: 'Evening',
  bedtime: 'Bedtime',
  'as-needed': 'As needed',
  supplement: 'Supplements',
};

export function inferMedCategory(
  name?: string,
  timeLabel?: string,
): MedCategory {
  const hay = `${name ?? ''} ${timeLabel ?? ''}`.toLowerCase();
  if (hay.includes('supplement') || hay.includes('vitamin')) return 'supplement';
  if (hay.includes('bedtime') || hay.includes('sleep')) return 'bedtime';
  if (hay.includes('midday') || hay.includes('noon') || hay.includes('lunch'))
    return 'midday';
  if (hay.includes('evening') || hay.includes('night') || hay.includes('pm'))
    return 'evening';
  if (hay.includes('as needed') || hay.includes('prn')) return 'as-needed';
  if (hay.includes('morning') || hay.includes('am')) return 'morning';
  return 'morning';
}
