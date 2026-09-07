/**
 * Nutrition for Military Calisthenics / bodyweight PT.
 * Honest performance fueling — NOT the viral 3-day “military diet.”
 *
 * Sources:
 * - HPRC protein for performance / nutrient timing
 * - ISSN-style nutrient timing (total daily protein primary; timing secondary)
 * - Calisthenics athlete guidance: 1.6–2.2 g/kg protein, carbs around denser PT
 */

export type CalisthenicsNutrient = {
  id: string;
  name: string;
  why: string;
  dailyTarget: string;
  foodHits: string[];
};

export type TimedFuelWindow = {
  slot: 'morning' | 'evening';
  title: string;
  when: string;
  before: string[];
  after: string[];
  skipIf: string;
};

export type CalisthenicsMeal = {
  name: string;
  timing: string;
  items: string[];
  approxProteinG: number;
};

export const CALISTHENICS_NUTRIENTS: CalisthenicsNutrient[] = [
  {
    id: 'protein',
    name: 'Protein',
    why: 'Repairs muscle after push-ups, squats, planks, and dense PT circuits.',
    dailyTarget: '1.6–2.2 g per kg body weight (≈0.7–1.0 g/lb). Spread across 3–5 meals.',
    foodHits: [
      'Eggs, Greek yogurt, cottage cheese',
      'Chicken, turkey, tuna, salmon',
      'Tofu, lentils, whey / milk if tolerated',
    ],
  },
  {
    id: 'carbs',
    name: 'Carbohydrates',
    why: 'Main fuel for morning Tabata / conditioning drills and next-day energy.',
    dailyTarget:
      'Most PT days: include a carb at meals around training. Harder 20–30 min blocks need more than a 3–5 min wake-up.',
    foodHits: [
      'Banana, rice cakes, oats',
      'Rice, potatoes, fruit',
      'Toast / tortillas (keep fat low pre-PT)',
    ],
  },
  {
    id: 'fluids',
    name: 'Fluids + electrolytes',
    why: 'Dense circuits raise sweat loss; low fluid = early fatigue and cramps.',
    dailyTarget:
      'Sip water through the day. After sweaty PT, ~16–24 fl oz per lb lost if you weigh yourself.',
    foodHits: [
      'Water, milk, or fortified plant milk',
      'Light salted meals; banana / orange for potassium',
      'Skip mega-stimulant drinks before night PT',
    ],
  },
  {
    id: 'fats',
    name: 'Dietary fat (timing matters)',
    why: 'Needed for hormones and vitamins — but heavy fat slows digestion before PT.',
    dailyTarget: 'Keep pre-workout meals lower fat; put nuts, oils, avocado later in the day.',
    foodHits: ['Olive oil, avocado, nuts (post / evening)', 'Fatty fish 2–3×/week'],
  },
  {
    id: 'micronutrients',
    name: 'Recovery micros',
    why: 'Support joints, sleep, and immune recovery while volume climbs across 28 days.',
    dailyTarget: 'Food first: colorful produce daily; vitamin D if low sun exposure (ask a clinician).',
    foodHits: [
      'Leafy greens, berries, citrus',
      'Dairy or fortified milk for calcium',
      'Salmon / sardines for omega-3 (rotate seafood)',
    ],
  },
];

/** Matches FitLife morning vs night PT ladders. */
export const CALISTHENICS_TIMED_FUEL: TimedFuelWindow[] = [
  {
    slot: 'morning',
    title: 'Morning PT fuel (3–30 min)',
    when: 'Use with 3 · 5 · 10 · 15 · 20 · 30 min morning windows',
    before: [
      '3–5 min: water only is fine if you feel good',
      '10–15 min: banana or rice cake 20–40 min prior (optional yogurt)',
      '20–30 min: light carb + small protein 45–90 min prior (oats + eggs, toast + turkey)',
    ],
    after: [
      'Within ~2 hours: 15–30 g protein + some carbs',
      'Examples: Greek yogurt + fruit, eggs + toast, shake + banana',
      'If you trained fasted, prioritize that first meal sooner',
    ],
    skipIf: 'Heavy greasy breakfast right before dense PT — expect sloshy stomach.',
  },
  {
    slot: 'evening',
    title: 'Night PT / recovery fuel (4–30 min)',
    when: 'Use with 4 · 7 · 12 · 18 · 25 · 30 min night windows',
    before: [
      '4–12 min mobility/recovery: light snack or train on a normal dinner digestion window',
      '18–30 min: finish dinner 1.5–3 hrs before, or a small carb snack 30–60 min prior',
      'Keep fat + big fiber lower if the session is still conditioning-heavy',
    ],
    after: [
      'Recovery-biased nights: protein + easy carbs, then wind down',
      'Examples: cottage cheese + fruit, turkey wrap, milk + banana',
      'Hydrate; skip large caffeine late',
    ],
    skipIf: 'Huge late fried meal right before Recovery Drill — keep it soft.',
  },
];

/** One-day test plate users can follow while trying Military Calisthenics. */
export const CALISTHENICS_TEST_DAY: {
  label: string;
  focus: string;
  proteinHintLb: string;
  meals: CalisthenicsMeal[];
  hydration: string;
  notes: string[];
} = {
  label: 'Test day · Calisthenics fuel',
  focus:
    'Hit protein at every meal, put carbs near PT, keep pre-session meals light.',
  proteinHintLb:
    'Quick target: body weight (lb) × 0.7–1.0 = daily protein grams (example: 180 lb → ~126–180 g).',
  meals: [
    {
      name: 'Breakfast (or post–morning PT)',
      timing: 'Within 2 hours of AM session',
      items: [
        '3 eggs or 1 cup Greek yogurt',
        'Oats or toast + fruit',
        'Water or milk',
      ],
      approxProteinG: 25,
    },
    {
      name: 'Lunch',
      timing: 'Midday plate',
      items: [
        'Chicken, turkey, tuna, or tofu (~4–6 oz)',
        'Rice or potatoes',
        'Vegetables + fruit',
      ],
      approxProteinG: 35,
    },
    {
      name: 'Pre–night window (if training PM)',
      timing: '30–90 min before night PT',
      items: ['Banana or rice cakes', 'Small yogurt or turkey slices', 'Water'],
      approxProteinG: 12,
    },
    {
      name: 'Dinner / post–night PT',
      timing: 'After evening session or main dinner',
      items: [
        'Lean protein + carbs + veggies',
        'If session was sweaty: extra water + a pinch of salt on food',
      ],
      approxProteinG: 35,
    },
  ],
  hydration: 'Water across the day; pale-yellow urine is a practical check.',
  notes: [
    'Total daily protein beats perfect “anabolic window” timing.',
    'Morning dense PT wants carbs nearby; night Recovery Drill can stay lighter.',
    'This is general fitness fueling — not medical advice or a crash diet.',
  ],
};

export const CALISTHENICS_FUEL_SOURCES = [
  {
    title: 'HPRC — Protein for performance',
    url: 'https://www.hprc-online.org/nutrition/performance-nutrition/protein-performance-depth',
    note: 'Warfighter protein ranges; 15–30 g protein in recovery meals.',
  },
  {
    title: 'HPRC — Nutrient timing and training',
    url: 'https://www.hprc-online.org/nutrition/warfighter-nutrition-guide/9-nutrient-timing-and-training',
    note: 'Carbs + protein after harder sessions; timing supports training quality.',
  },
  {
    title: 'ISSN nutrient timing position stand (summary context)',
    url: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0189-4',
    note: 'Daily protein/energy intake is primary; peri-workout timing is secondary optimization.',
  },
] as const;

/** Suggest daily protein grams from body weight (kg). */
export function suggestProteinTargetG(weightKg?: number | null): number | null {
  if (!weightKg || weightKg < 35 || weightKg > 250) return null;
  // Midpoint of 1.6–2.2 g/kg for mixed calisthenics PT
  return Math.round(weightKg * 1.8);
}

export function isCalisthenicsProgram(programId?: string | null): boolean {
  return (
    programId === 'operation-military-calisthenics' ||
    programId === 'operation-calisthenics'
  );
}
