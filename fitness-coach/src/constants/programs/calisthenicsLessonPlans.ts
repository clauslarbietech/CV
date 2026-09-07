import {
  OPERATION_CALISTHENICS,
  OPERATION_IRON_14,
  OPERATION_IRON_30,
  OPERATION_LONG_TRAIN,
} from '@/constants/programs';

export type CalisthenicsLessonPlan = {
  id: string;
  label: string;
  duration: string;
  linkedProgramId: string;
  focus: string;
  weeklyFlow: string[];
  anchorExercises: string[];
  progressionRules: string[];
};

export const CALISTHENICS_LESSON_PLANS: CalisthenicsLessonPlan[] = [
  {
    id: 'cal-foundation-21',
    label: 'Calisthenics Foundation',
    duration: '21 days',
    linkedProgramId: OPERATION_CALISTHENICS.id,
    focus: 'Dedicated progressive skill + volume block',
    weeklyFlow: [
      'Day 1: Push control',
      'Day 2: Lower-body flow',
      'Day 3: Core armor',
      'Day 4: Full-body density',
      'Day 5: Skill + volume',
      'Day 6: Active recovery',
      'Day 7: Weekly benchmark',
    ],
    anchorExercises: ['Push-Ups', 'Pike Push-Ups', 'Bodyweight Squats', 'Plank'],
    progressionRules: [
      'Each week densifies the same patterns (~15% more volume).',
      'Keep 1–2 clean reps in reserve on every set.',
      'Day 21 is the foundation test — quality over speed.',
    ],
  },
  {
    id: 'cal-short-14',
    label: 'Calisthenics Short Block (via Iron 14)',
    duration: '14 days',
    linkedProgramId: OPERATION_IRON_14.id,
    focus: 'Skill lock-in + fast conditioning',
    weeklyFlow: [
      'Day 1: Push + squat baseline',
      'Day 2: Cardio + core density',
      'Day 3: Upper-body endurance',
      'Day 4: Lower-body strength endurance',
      'Day 5: Mixed circuit + pace',
      'Day 6: Mobility + easy volume',
      'Day 7: Repeat with tighter rest',
    ],
    anchorExercises: ['Push-Ups', 'Bodyweight Squats', 'Mountain Climbers'],
    progressionRules: [
      'Add 1–2 reps per round once all sets are clean.',
      'Or keep reps fixed and reduce rest by 10–15 seconds.',
      'Stop 1–2 reps before form breakdown.',
    ],
  },
  {
    id: 'cal-standard-30',
    label: 'Calisthenics Standard Block (via Iron 30)',
    duration: '30 days',
    linkedProgramId: OPERATION_IRON_30.id,
    focus: 'Body recomposition + volume tolerance',
    weeklyFlow: [
      'Day 1: Push foundation',
      'Day 2: Cardio assault',
      'Day 3: Upper body command',
      'Day 4: Lower body assault',
      'Day 5: Full-body density',
      'Day 6: Core + recovery work',
      'Day 7: Active recovery and reset',
    ],
    anchorExercises: ['Push-Ups', 'Lunges', 'Plank'],
    progressionRules: [
      'Progress total completed rounds before chasing harder variations.',
      'Track one benchmark circuit weekly (same reps/rest).',
      'Fuel with Everyday 16:8 or Short-Block meals on hard days.',
    ],
  },
  {
    id: 'cal-long-12w',
    label: 'Calisthenics Long Train',
    duration: '12 weeks',
    linkedProgramId: OPERATION_LONG_TRAIN.id,
    focus: 'Toughening → Build → Sustaining phases',
    weeklyFlow: [
      'Weeks 1–4: movement quality and repeatability',
      'Weeks 5–8: density and rest compression',
      'Weeks 9–12: sustaining volume + benchmark tests',
    ],
    anchorExercises: ['Burpees', 'Squats', 'Pike Push-Ups'],
    progressionRules: [
      'Increase only one variable per week (reps OR rounds OR rest).',
      'Use deload/recovery day every 7th day.',
      'Retest push-ups, plank, and fixed circuit every 2 weeks.',
    ],
  },
];
