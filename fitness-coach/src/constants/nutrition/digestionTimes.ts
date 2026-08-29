import { ImageSourcePropType } from 'react-native';

/**
 * Approximate gastric emptying / digestion windows for common athlete foods.
 * Times vary by meal size, cooking method, and individual gut speed — educational only.
 *
 * General references for food-timing education:
 * - Military / SOF fueling guidance (protein + carbs around training)
 * - Common sports-nutrition digestion timing ranges used in athlete meal planning
 */

export type DigestionCategory = 'fast' | 'moderate' | 'slow';

export type DigestionFood = {
  id: string;
  name: string;
  timeLabel: string;
  hoursMin: number;
  hoursMax: number;
  category: DigestionCategory;
  tip: string;
  image: ImageSourcePropType;
};

export const DIGESTION_FOODS: DigestionFood[] = [
  {
    id: 'salmon',
    name: 'Salmon',
    timeLabel: '45–90 minutes',
    hoursMin: 0.75,
    hoursMax: 1.5,
    category: 'fast',
    tip: 'Great post-mission protein when you need fuel that clears quickly.',
    image: require('../../../assets/digestion/salmon.png'),
  },
  {
    id: 'fish',
    name: 'Fish',
    timeLabel: '45–60 minutes',
    hoursMin: 0.75,
    hoursMax: 1,
    category: 'fast',
    tip: 'Light protein — solid choice before evening training.',
    image: require('../../../assets/digestion/fish.png'),
  },
  {
    id: 'rice',
    name: 'Rice',
    timeLabel: '1 hour',
    hoursMin: 1,
    hoursMax: 1,
    category: 'fast',
    tip: 'Fast carbs for pre/post workout plates.',
    image: require('../../../assets/digestion/rice.png'),
  },
  {
    id: 'oats',
    name: 'Oats',
    timeLabel: '2 hours',
    hoursMin: 2,
    hoursMax: 2,
    category: 'moderate',
    tip: 'Steady energy — good for break-fast meals.',
    image: require('../../../assets/digestion/oats.png'),
  },
  {
    id: 'pasta',
    name: 'Pasta',
    timeLabel: '2 hours',
    hoursMin: 2,
    hoursMax: 2,
    category: 'moderate',
    tip: 'Useful carb base when you have a longer eating window.',
    image: require('../../../assets/digestion/pasta.png'),
  },
  {
    id: 'turkey',
    name: 'Turkey',
    timeLabel: '2 hours',
    hoursMin: 2,
    hoursMax: 2,
    category: 'moderate',
    tip: 'Lean protein that sits lighter than red meat.',
    image: require('../../../assets/digestion/turkey.png'),
  },
  {
    id: 'eggs',
    name: 'Eggs',
    timeLabel: '2–3 hours',
    hoursMin: 2,
    hoursMax: 3,
    category: 'moderate',
    tip: 'Reliable training-day protein with moderate digest speed.',
    image: require('../../../assets/digestion/eggs.png'),
  },
  {
    id: 'chicken',
    name: 'Chicken',
    timeLabel: '3–4 hours',
    hoursMin: 3,
    hoursMax: 4,
    category: 'slow',
    tip: 'Keep portions moderate if training soon after eating.',
    image: require('../../../assets/digestion/chicken.png'),
  },
  {
    id: 'steak',
    name: 'Steak',
    timeLabel: '4 hours',
    hoursMin: 4,
    hoursMax: 4,
    category: 'slow',
    tip: 'Save denser red meat for post-mission recovery meals.',
    image: require('../../../assets/digestion/steak.png'),
  },
];

export const DIGESTION_DISCLAIMER =
  'Times are approximate gastric emptying ranges for education. Your meal size, fiber, and training intensity change real digestion speed.';
