import { ExerciseDefinition, ProgramDay, WorkoutProgram } from '@/types';

type DayTemplate = {
  title: string;
  focus: string[];
  rounds: number;
  rest: { min: number; max: number };
  minutes: { min: number; max: number };
  exercises: ExerciseDefinition[];
  isRecovery?: boolean;
  coachMessage?: string;
  extraBlocks?: ProgramDay['extraBlocks'];
};

function ex(
  id: string,
  name: string,
  recruit: number,
  soldier: number,
  elite: number,
  opts?: Partial<ExerciseDefinition> & { timed?: boolean },
): ExerciseDefinition {
  if (opts?.timed) {
    return {
      id,
      name,
      durationSec: soldier,
      recruit: { durationSec: recruit },
      soldier: { durationSec: soldier },
      elite: { durationSec: elite },
      perSide: opts.perSide,
      notes: opts.notes,
    };
  }
  return {
    id,
    name,
    reps: soldier,
    recruit: { reps: recruit },
    soldier: { reps: soldier },
    elite: { reps: elite },
    perSide: opts?.perSide,
    notes: opts?.notes,
  };
}

const TEMPLATES: DayTemplate[] = [
  {
    title: 'FOUNDATION DAY',
    focus: ['Full body', 'Foundation'],
    rounds: 4,
    rest: { min: 60, max: 90 },
    minutes: { min: 20, max: 30 },
    exercises: [
      ex('pushups', 'Push-Ups', 10, 15, 20),
      ex('squats', 'Bodyweight Squats', 15, 20, 25),
      ex('lunges', 'Reverse Lunges', 8, 10, 12, { perSide: true }),
      ex('climbers', 'Mountain Climbers', 16, 20, 30),
      ex('plank', 'Plank', 20, 30, 45, { timed: true }),
    ],
  },
  {
    title: 'CARDIO BLAST',
    focus: ['Fat Burn', 'Conditioning'],
    rounds: 5,
    rest: { min: 45, max: 75 },
    minutes: { min: 22, max: 35 },
    exercises: [
      ex('burpees', 'Burpees', 6, 10, 12),
      ex('jacks', 'Jumping Jacks', 15, 20, 30),
      ex('squats', 'Squats', 12, 15, 20),
      ex('climbers', 'Mountain Climbers', 16, 20, 30),
      ex('highknees', 'High Knees', 20, 30, 40, { timed: true }),
    ],
  },
  {
    title: 'UPPER BODY FOCUS',
    focus: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    rounds: 5,
    rest: { min: 60, max: 90 },
    minutes: { min: 25, max: 40 },
    exercises: [
      ex('pushups', 'Push-Ups', 10, 15, 20),
      ex('diamond', 'Diamond Push-Ups', 6, 10, 12),
      ex('pike', 'Pike Push-Ups', 6, 10, 12),
      ex('dips', 'Chair Dips', 8, 12, 15),
      ex('plank', 'Plank', 20, 30, 45, { timed: true }),
    ],
  },
  {
    title: 'LOWER BODY FOCUS',
    focus: ['Legs', 'Glutes'],
    rounds: 5,
    rest: { min: 60, max: 90 },
    minutes: { min: 25, max: 35 },
    exercises: [
      ex('squats', 'Squats', 15, 20, 25),
      ex('lunges', 'Lunges', 8, 12, 15, { perSide: true }),
      ex('bridges', 'Glute Bridges', 12, 15, 20),
      ex('jumpsquats', 'Jump Squats', 6, 10, 12, {
        notes:
          'Easy tier: do extra bodyweight squats instead if jumping bothers knees or you are new to plyometrics.',
      }),
      ex('wallsit', 'Wall Sit', 20, 30, 45, { timed: true }),
    ],
  },
  {
    title: 'FULL-BODY CIRCUIT',
    focus: ['Full body', 'Conditioning'],
    rounds: 5,
    rest: { min: 45, max: 75 },
    minutes: { min: 25, max: 40 },
    exercises: [
      ex('burpees', 'Burpees', 6, 10, 12),
      ex('pushups', 'Push-Ups', 10, 15, 20),
      ex('squats', 'Squats', 15, 20, 25),
      ex('climbers', 'Mountain Climbers', 16, 20, 30),
      ex('plank', 'Plank', 25, 40, 55, { timed: true }),
    ],
  },
  {
    title: 'ENDURANCE PACE',
    focus: ['Cardio', 'Endurance'],
    rounds: 3,
    rest: { min: 45, max: 60 },
    minutes: { min: 35, max: 55 },
    exercises: [
      ex('squats', 'Squats', 15, 20, 25),
      ex('pushups', 'Push-Ups', 8, 10, 15),
      ex('plank', 'Plank', 20, 30, 45, { timed: true }),
    ],
    extraBlocks: [
      {
        title: 'Endurance March',
        description: '30–45 minute brisk walk or jog before the circuit.',
      },
    ],
  },
  {
    title: 'ACTIVE RECOVERY',
    focus: ['Recovery', 'Mobility'],
    rounds: 0,
    rest: { min: 0, max: 0 },
    minutes: { min: 30, max: 45 },
    exercises: [],
    isRecovery: true,
    coachMessage:
      'Recovery is part of training. Walk, mobilize, and prepare for the next assault.',
    extraBlocks: [
      { title: 'Walk', description: '30–45 minute easy walk.' },
      {
        title: 'Mobility',
        description: '10–15 minutes of stretching and hip/shoulder mobility.',
      },
    ],
  },
];

function scaleDay(template: DayTemplate, day: number): ProgramDay {
  const week = Math.floor((day - 1) / 7);
  const volumeBoost = week; // progressive overload by week
  const rounds =
    template.isRecovery || !template.rounds
      ? undefined
      : Math.min(template.rounds + Math.floor(volumeBoost / 2), template.rounds + 2);

  const exercises = template.exercises.map((exercise) => {
    const bump = volumeBoost * (exercise.durationSec ? 5 : 2);
    const baseRep =
      typeof exercise.reps === 'number' ? exercise.reps : Number(exercise.reps) || 0;
    const soldierReps = exercise.durationSec
      ? undefined
      : baseRep + bump;
    const soldierHold = exercise.durationSec
      ? exercise.durationSec + bump
      : undefined;

    return {
      ...exercise,
      id: `d${day}-${exercise.id}`,
      reps: soldierReps ?? exercise.reps,
      durationSec: soldierHold ?? exercise.durationSec,
      recruit: exercise.durationSec
        ? {
            durationSec: Math.max(
              15,
              (exercise.recruit?.durationSec ?? exercise.durationSec) +
                Math.floor(bump / 2),
            ),
          }
        : {
            reps: Math.max(
              5,
              (typeof exercise.recruit?.reps === 'number'
                ? exercise.recruit.reps
                : baseRep - 4) + Math.floor(bump / 2),
            ),
          },
      soldier: exercise.durationSec
        ? { durationSec: soldierHold }
        : { reps: soldierReps },
      elite: exercise.durationSec
        ? {
            durationSec:
              (exercise.elite?.durationSec ?? exercise.durationSec) + bump + 5,
          }
        : {
            reps:
              (typeof exercise.elite?.reps === 'number'
                ? exercise.elite.reps
                : baseRep + 4) +
              bump +
              2,
          },
    };
  });

  return {
    day,
    title: template.title,
    focus: template.focus,
    rounds,
    restSec: template.isRecovery ? undefined : template.rest,
    estimatedMinutes: {
      min: template.minutes.min + week * 2,
      max: template.minutes.max + week * 3,
    },
    exercises,
    isRecovery: template.isRecovery,
    coachMessage: template.coachMessage,
    extraBlocks: template.extraBlocks,
  };
}

const days: ProgramDay[] = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  // Day 30 = final test
  if (day === 30) {
    return {
      day: 30,
      title: 'FINAL TEST',
      focus: ['Max effort', 'Challenge completion'],
      isFinalTest: true,
      estimatedMinutes: { min: 40, max: 70 },
      exercises: [
        ex('pushups', 'Push-Ups', 60, 100, 120, {
          notes: 'Divide into manageable sets.',
        }),
        ex('squats', 'Squats', 100, 150, 180, {
          notes: 'Divide into manageable sets.',
        }),
        ex('lunges', 'Alternating Lunges', 60, 100, 120, {
          notes: 'Divide into manageable sets.',
        }),
        ex('climbers', 'Mountain Climbers', 60, 100, 120, {
          notes: 'Divide into manageable sets.',
        }),
        ex('burpees', 'Burpees', 30, 50, 60, {
          notes: 'Divide into manageable sets.',
        }),
        ex('plank', 'Planks (total)', 180, 300, 360, {
          timed: true,
          notes: 'Accumulate total plank time across sets.',
        }),
      ],
      coachMessage: 'Finish strong. Pace yourself. Complete every rep.',
    };
  }

  // Recovery every 7th day
  if (day % 7 === 0) {
    return scaleDay(TEMPLATES[6], day);
  }

  const template = TEMPLATES[(day - 1) % 6];
  return scaleDay(template, day);
});

export const OPERATION_IRON_30: WorkoutProgram = {
  id: 'operation-iron-30',
  name: '30-DAY HOME PLAN',
  slug: 'operation-iron-30',
  tagline: '30 days at home. No gym. Just simple bodyweight workouts.',
  subtitle: '30-Day No-Equipment Home Fitness Plan',
  categories: ['fat_burn', 'conditioning', 'discipline', 'calisthenics'],
  durationDays: 30,
  equipment: 'None — bodyweight only',
  averageWorkout: '20-45 minutes',
  difficulty: 'Beginner to Advanced',
  goals: [
    'Build everyday strength',
    'Get fitter without a gym',
    'Make working out a daily habit',
    'Improve work capacity week by week',
  ],
  featured: true,
  militaryThemed: false,
  days,
};
