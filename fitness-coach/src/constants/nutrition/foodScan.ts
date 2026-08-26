export type FoodScanResult = {
  label: string;
  confidence: number;
  estimatedCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  coachingNote: string;
  tags: string[];
};

/** Lightweight on-device heuristic until a vision model is wired. */
export function analyzeFoodFromFilename(fileName: string, sizeBytes: number): FoodScanResult {
  const name = fileName.toLowerCase();
  const hits = (words: string[]) => words.some((w) => name.includes(w));

  if (hits(['egg', 'omelet', 'omelette'])) {
    return {
      label: 'Eggs / egg dish',
      confidence: 0.78,
      estimatedCalories: 220,
      proteinG: 18,
      carbsG: 2,
      fatG: 16,
      coachingNote: 'Strong protein hit. Pair with veggies or fruit for fiber.',
      tags: ['protein', 'breakfast'],
    };
  }
  if (hits(['chicken', 'turkey', 'grill'])) {
    return {
      label: 'Lean poultry',
      confidence: 0.74,
      estimatedCalories: 320,
      proteinG: 42,
      carbsG: 0,
      fatG: 8,
      coachingNote: 'Excellent post-mission protein. Add rice or potatoes if this is a hard-training day.',
      tags: ['protein', 'lean'],
    };
  }
  if (hits(['salad', 'greens', 'bowl'])) {
    return {
      label: 'Salad / veggie bowl',
      confidence: 0.7,
      estimatedCalories: 280,
      proteinG: 12,
      carbsG: 24,
      fatG: 14,
      coachingNote: 'Great volume food. Add eggs, fish, or chicken if protein is still short.',
      tags: ['fiber', 'volume'],
    };
  }
  if (hits(['rice', 'pasta', 'noodle', 'bread', 'bagel'])) {
    return {
      label: 'Carb staple',
      confidence: 0.68,
      estimatedCalories: 350,
      proteinG: 8,
      carbsG: 62,
      fatG: 4,
      coachingNote: 'Solid fuel for training days. Anchor it with a protein source.',
      tags: ['carbs', 'fuel'],
    };
  }
  if (hits(['burger', 'pizza', 'fries', 'fried'])) {
    return {
      label: 'Higher-calorie comfort meal',
      confidence: 0.66,
      estimatedCalories: 680,
      proteinG: 28,
      carbsG: 58,
      fatG: 36,
      coachingNote: 'Fits an occasional hard day. Balance the rest of today’s meals with lean protein + produce.',
      tags: ['calorie-dense'],
    };
  }
  if (hits(['sardine', 'salmon', 'fish', 'tuna'])) {
    return {
      label: 'Fish / seafood',
      confidence: 0.76,
      estimatedCalories: 260,
      proteinG: 28,
      carbsG: 0,
      fatG: 16,
      coachingNote: 'Omega-3 friendly protein. Keep portions steady if sodium is a concern.',
      tags: ['protein', 'fish'],
    };
  }

  // Fallback uses file size as a weak prior for portion scale.
  const portion = Math.min(1.4, Math.max(0.7, sizeBytes / 180_000));
  return {
    label: 'Mixed plate (estimate)',
    confidence: 0.42,
    estimatedCalories: Math.round(420 * portion),
    proteinG: Math.round(24 * portion),
    carbsG: Math.round(36 * portion),
    fatG: Math.round(18 * portion),
    coachingNote:
      'Couldn’t confidently ID from the filename alone. Log manually or retake with the meal centered in frame. Vision AI hook is ready for a live model.',
    tags: ['estimate'],
  };
}
