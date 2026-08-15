/**
 * Meal + fasting guidance for FitLife.
 *
 * Sources (open these for full detail):
 * 1) Special Operations Forces Nutrition Guide (tactical performance fueling)
 *    https://navyseals.com/wp-content/uploads/2013/04/special-operations-nutrition-guide.pdf
 * 2) HPRC — Nutrient timing & Warfighter Nutrition Guide
 *    https://www.hprc-online.org/nutrition/warfighter-nutrition-guide/9-nutrient-timing-and-training
 * 3) Military OneSource — Nutrition for Military Readiness
 *    https://www.militaryonesource.mil/resources/millife-guides/nutrition/
 * 4) Healthline / Medical News Today summaries of the viral “Military Diet”
 *    (NOT affiliated with the U.S. military — short-term low-calorie protocol)
 */

export const NUTRITION_SOURCES = [
  {
    id: 'sof-guide',
    title: 'Special Operations Forces Nutrition Guide',
    url: 'https://navyseals.com/wp-content/uploads/2013/04/special-operations-nutrition-guide.pdf',
    note: 'Best performance source: protein + carbs around training, refuel within ~45 min post-workout.',
  },
  {
    id: 'hprc-timing',
    title: 'HPRC — Nutrient Timing and Training',
    url: 'https://www.hprc-online.org/nutrition/warfighter-nutrition-guide/9-nutrient-timing-and-training',
    note: 'After hard work >60 min: ≥50g carbs + 15–30g protein within ~2 hours; carbs during long sessions.',
  },
  {
    id: 'hprc-recover',
    title: 'HPRC — Refuel, Rehydrate, Recover',
    url: 'https://www.hprc-online.org/nutrition/performance-nutrition/refuel-rehydrate-recover',
    note: 'Rehydrate ~16–24 fl oz per lb lost; pale-yellow urine as a practical hydration check.',
  },
  {
    id: 'military-onesource',
    title: 'Military OneSource — Nutrition for Military Readiness',
    url: 'https://www.militaryonesource.mil/resources/millife-guides/nutrition/',
    note: 'Practical readiness tips: hydrate, protein each meal, don’t skip fuel around PT.',
  },
  {
    id: 'military-diet-healthline',
    title: 'Healthline — The Military Diet (3-day plan)',
    url: 'https://www.healthline.com/nutrition/the-military-diet-101',
    note: 'Explains the viral 3-on / 4-off low-calorie plan. Not an official military diet.',
  },
] as const;

export type MealSlot = {
  name: string;
  items: string[];
  caloriesApprox?: number;
};

export type DayMealPlan = {
  id: string;
  label: string;
  focus: string;
  fastingWindow: string;
  eatingWindow: string;
  meals: MealSlot[];
  hydration: string;
  notes: string[];
};

export type FuelTrack = {
  id: 'short' | 'long' | 'tactical';
  label: string;
  horizon: string;
  summary: string;
  whenToUse: string[];
  principles: string[];
  plan: DayMealPlan;
};

/** Default plan: 16:8 intermittent fasting + tactical-style plates */
export const TACTICAL_FASTING_PLAN: DayMealPlan = {
  id: 'tactical-16-8',
  label: 'Tactical 16:8 Fuel',
  focus: 'Fat loss + training performance (recommended default)',
  fastingWindow: '8:00 PM → 12:00 PM (16 hours)',
  eatingWindow: '12:00 PM → 8:00 PM (8 hours)',
  meals: [
    {
      name: 'Break-fast (12:00)',
      caloriesApprox: 450,
      items: [
        '3 eggs or Greek yogurt bowl',
        'Fruit (banana / berries)',
        'Oats or toast',
        'Black coffee / water',
      ],
    },
    {
      name: 'Pre-mission snack (optional, 30–60 min before workout)',
      caloriesApprox: 150,
      items: ['Banana or rice cakes', 'Small protein (turkey / whey)', 'Water'],
    },
    {
      name: 'Post-mission plate (within 45 min)',
      caloriesApprox: 550,
      items: [
        'Lean protein (chicken, tuna, turkey, tofu)',
        'Carb (rice, potato, fruit)',
        'Vegetables',
        'Electrolytes / water',
      ],
    },
    {
      name: 'Final meal (before 8:00 PM)',
      caloriesApprox: 500,
      items: [
        'Protein + vegetables',
        'Healthy fat (olive oil, avocado, nuts)',
        'Optional cottage cheese / yogurt',
      ],
    },
  ],
  hydration: 'Aim 3–4 liters water across the day. Black coffee/tea OK while fasting.',
  notes: [
    'Based on SOF / Military OneSource readiness principles + optional 16:8 window.',
    'If energy crashes during training, shorten the fast or add a small pre-workout carb.',
    'Not medical advice — adjust for your body and consult a professional if needed.',
  ],
};

/** Short-term (≤14 days): tight fueling for Iron 14 / rapid blocks */
export const SHORT_TERM_MILITARY_FUEL: DayMealPlan = {
  id: 'short-term-ops',
  label: 'Short-Term Ops Fuel (≤14 days)',
  focus: 'High adherence + training energy for Iron 14 / sprint blocks',
  fastingWindow: 'Optional 14:10 (lighter than 16:8 on hard days)',
  eatingWindow: '10:00 AM → 8:00 PM preferred on mission days',
  meals: [
    {
      name: 'Morning anchor',
      caloriesApprox: 400,
      items: [
        'Eggs + whole-grain toast OR oatmeal + whey',
        'Fruit',
        'Water / coffee',
      ],
    },
    {
      name: 'Pre-mission (30–60 min out)',
      caloriesApprox: 180,
      items: [
        'Banana or pretzels (~25–40g carbs)',
        'Small protein (yogurt / turkey)',
        'Sip water — don’t chug',
      ],
    },
    {
      name: 'Post-mission recovery (ASAP, ≤2 hrs)',
      caloriesApprox: 500,
      items: [
        '≥50g carbs (rice, potato, fruit, bread)',
        '15–30g protein (chicken, tuna, dairy, tofu)',
        'Fluids + pinch of salt / electrolytes',
      ],
    },
    {
      name: 'Evening plate',
      caloriesApprox: 450,
      items: [
        'Lean protein + vegetables',
        'Moderate carb if next day is hard',
        'Sleep-friendly: avoid huge late sugar hits',
      ],
    },
  ],
  hydration:
    '3+ liters/day. After sweaty sessions, ~16–24 fl oz per lb lost (HPRC). Pale yellow urine.',
  notes: [
    'Built for short military challenges: keep protein steady every meal; don’t crash calories on PT days.',
    'HPRC: for strenuous work >60 min, prioritize carbs + 15–30g protein within ~2 hours.',
    'Optional viral 3-day “military diet” is water-weight theater — use only on recovery days if at all.',
    'Not medical advice.',
  ],
};

/** Long-term (8–12+ weeks): warfighter-style sustaining fuel */
export const LONG_TERM_WARFIGHTER_FUEL: DayMealPlan = {
  id: 'long-train-warfighter',
  label: 'Long-Train Warfighter Fuel (8–12+ weeks)',
  focus: 'Sustainable readiness — performance first, fat loss second',
  fastingWindow: 'Optional 12:12 or none — consistency beats aggressive fasting',
  eatingWindow: '3–4 meals across the day aligned to PT',
  meals: [
    {
      name: 'Breakfast / first plate',
      caloriesApprox: 500,
      items: [
        'Protein (eggs, Greek yogurt, lean meat)',
        'Complex carb (oats, rice, potato, whole grain)',
        'Fruit or vegetables',
        'Fluids',
      ],
    },
    {
      name: 'Midday / pre-PT if training late',
      caloriesApprox: 450,
      items: [
        'Balanced plate: protein + carb + veg',
        'If PT is within 1–4 hrs: bias carbs (HPRC pre-fuel)',
      ],
    },
    {
      name: 'During long sessions (>60–90 min)',
      caloriesApprox: 150,
      items: [
        '30–60g carbs/hour from food or sports drink when sessions run long',
        'Water always; electrolytes in heat / heavy sweat',
      ],
    },
    {
      name: 'Recovery meal (within 2 hrs of hard PT)',
      caloriesApprox: 600,
      items: [
        '≥50g carbs + 15–30g protein (HPRC recovery target)',
        'Example: turkey sandwich + fruit + milk, or rice bowl + chicken',
        'Rehydrate until urine is pale yellow',
      ],
    },
    {
      name: 'Evening / closing plate',
      caloriesApprox: 450,
      items: [
        'Protein + vegetables + healthy fat',
        'Carb size matches tomorrow’s volume (harder day → more carbs)',
      ],
    },
  ],
  hydration:
    'Daily hydration habit > hero liters. Scale up in heat. Track sweat losses on long marches / dense circuits.',
  notes: [
    'Mirrors HPRC Warfighter / SOF readiness: balanced daily pattern, nutrient timing around hard sessions.',
    'Long programs (Iron Long Train / 12-week blocks) need enough carbs to protect performance — chronic low fuel stalls progress.',
    'Aim gradual fat loss (~0.5–1% body weight/week max) if recomposition is a goal; protect sleep and protein.',
    'Not medical advice — adapt for injuries, meds, and professional guidance.',
  ],
};

export const FUEL_TRACKS: FuelTrack[] = [
  {
    id: 'short',
    label: 'Short-term',
    horizon: '3–14 days',
    summary:
      'Sprint fuel for Iron 14 and rapid blocks. Keep training energy high; avoid crash diets on mission days.',
    whenToUse: [
      'OPERATION IRON 14',
      'Express missions stacked in a busy week',
      '2-week condensed PRT-style push',
    ],
    principles: [
      'Protein at every meal',
      'Carbs around PT (pre + post)',
      'Hydrate for sweat, not just thirst',
      'Skip viral crash menus on hard days',
    ],
    plan: SHORT_TERM_MILITARY_FUEL,
  },
  {
    id: 'tactical',
    label: 'Tactical 16:8',
    horizon: 'Ongoing default',
    summary:
      'Intermittent fasting window plus tactical plates — best everyday default for fat loss with training.',
    whenToUse: [
      'OPERATION IRON 30',
      'Fat-loss focus with daily missions',
      'When you prefer a clear eating window',
    ],
    principles: [
      '16:8 window (adjust if energy crashes)',
      'Refuel within ~45–120 min post-mission',
      '3–4 liters water baseline',
    ],
    plan: TACTICAL_FASTING_PLAN,
  },
  {
    id: 'long',
    label: 'Long train',
    horizon: '8–12+ weeks',
    summary:
      'Warfighter sustaining fuel: performance and recovery first so a multi-month ramp doesn’t stall.',
    whenToUse: [
      'OPERATION LONG TRAIN (12 weeks)',
      'Post–Iron 30 continuation',
      'Building lasting readiness, not a 2-week cut',
    ],
    principles: [
      '3–4 balanced meals most days',
      'HPRC recovery: ≥50g carbs + 15–30g protein after hard PT',
      'Extra carbs on long / dense days',
      'Slow body-comp change if needed',
    ],
    plan: LONG_TERM_WARFIGHTER_FUEL,
  },
];

/** Viral 3-day “military diet” — labeled clearly as unofficial */
export const VIRAL_MILITARY_DIET_DAYS: DayMealPlan[] = [
  {
    id: 'viral-day-1',
    label: 'Viral Military Diet · Day 1 (~1,400 kcal)',
    focus: 'Short-term calorie cut (unofficial internet plan)',
    fastingWindow: 'No formal fast — 3 meals only, no snacks',
    eatingWindow: 'Breakfast · Lunch · Dinner',
    meals: [
      {
        name: 'Breakfast',
        items: ['½ grapefruit', '1 toast', '2 tbsp peanut butter'],
      },
      { name: 'Lunch', items: ['½ cup tuna', '1 toast'] },
      {
        name: 'Dinner',
        items: [
          '3 oz lean meat',
          '1 cup green beans',
          '½ banana',
          '1 apple',
          '1 cup vanilla ice cream',
        ],
      },
    ],
    hydration: 'Water freely. Up to 2 cups black coffee/tea (no sugar/cream).',
    notes: [
      'Source: Healthline / Medical News Today summaries of the viral “Military Diet”.',
      'NOT used by or affiliated with the U.S. military.',
      'Use only short-term. Prefer Short-Term Ops or Tactical 16:8 on training days.',
    ],
  },
  {
    id: 'viral-day-2',
    label: 'Viral Military Diet · Day 2 (~1,200 kcal)',
    focus: 'Short-term calorie cut (unofficial internet plan)',
    fastingWindow: 'No formal fast — 3 meals only',
    eatingWindow: 'Breakfast · Lunch · Dinner',
    meals: [
      { name: 'Breakfast', items: ['1 egg', '1 toast', '½ banana'] },
      {
        name: 'Lunch',
        items: ['1 cup cottage cheese', '1 hard-boiled egg', '5 saltines'],
      },
      {
        name: 'Dinner',
        items: [
          '2 hot dogs (no bun) or lean swap',
          '1 cup broccoli',
          '½ cup carrots',
          '½ banana',
          '½ cup vanilla ice cream',
        ],
      },
    ],
    hydration: 'Water freely. Black coffee/tea OK.',
    notes: [
      'Swap hot dogs for turkey/chicken if preferred.',
      'Not ideal on hard training days — use Active Recovery day if combining.',
    ],
  },
  {
    id: 'viral-day-3',
    label: 'Viral Military Diet · Day 3 (~1,100 kcal)',
    focus: 'Short-term calorie cut (unofficial internet plan)',
    fastingWindow: 'No formal fast — 3 meals only',
    eatingWindow: 'Breakfast · Lunch · Dinner',
    meals: [
      {
        name: 'Breakfast',
        items: ['5 saltines', '1 slice cheddar', '1 apple'],
      },
      { name: 'Lunch', items: ['1 egg', '1 toast'] },
      {
        name: 'Dinner',
        items: ['1 cup tuna', '½ banana', '1 cup vanilla ice cream'],
      },
    ],
    hydration: 'Water freely. Black coffee/tea OK.',
    notes: [
      'After day 3, return to ~1,500+ kcal balanced eating for 4 days (viral protocol).',
      'Prefer Short-Term Ops or Tactical 16:8 with training blocks.',
    ],
  },
];
