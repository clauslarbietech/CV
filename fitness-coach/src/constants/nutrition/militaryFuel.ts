/**
 * Meal + fasting guidance for FitLife.
 *
 * Sources (open these for full detail):
 * 1) Special Operations Forces Nutrition Guide (tactical performance fueling)
 *    https://navyseals.com/wp-content/uploads/2013/04/special-operations-nutrition-guide.pdf
 * 2) Military OneSource — Nutrition for Military Readiness
 *    https://www.militaryonesource.mil/resources/millife-guides/nutrition/
 * 3) Healthline / Medical News Today summaries of the viral “Military Diet”
 *    (NOT affiliated with the U.S. military — short-term low-calorie protocol)
 *    https://www.healthline.com/nutrition/the-military-diet-101
 *    https://www.medicalnewstoday.com/articles/323952
 */

export const NUTRITION_SOURCES = [
  {
    id: 'sof-guide',
    title: 'Special Operations Forces Nutrition Guide',
    url: 'https://navyseals.com/wp-content/uploads/2013/04/special-operations-nutrition-guide.pdf',
    note: 'Best performance source: protein + carbs around training, refuel within ~45 min post-workout.',
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
      'Use only short-term. Prefer Tactical 16:8 for training days.',
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
      'Prefer Tactical 16:8 as the sustainable default with OPERATION IRON 30.',
    ],
  },
];
