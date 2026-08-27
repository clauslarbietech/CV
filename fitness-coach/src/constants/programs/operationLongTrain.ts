import { ExerciseDefinition, ProgramDay, WorkoutProgram } from '@/types';

/**
 * OPERATION LONG TRAIN — 12-week civilian adaptation inspired by Army PRT
 * toughening → sustaining progression (FM 7-22 / BCT-style phase ramp).
 * Not official doctrine; bodyweight-only home protocol.
 */

type DayTemplate = {
  title: string;
  focus: string[];
  rounds: number;
  rest: { min: number; max: number };
  minutes: { min: number; max: number };
  exercises: ExerciseDefinition[];
  isRecovery?: boolean;
  coachMessage?: string;
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

const TOUGHENING: DayTemplate[] = [
  {
    title: 'FOUNDATION MARCH',
    focus: ['Full body', 'Toughening'],
    rounds: 3,
    rest: { min: 60, max: 90 },
    minutes: { min: 20, max: 30 },
    exercises: [
      ex('pushups', 'Push-Ups', 8, 12, 15),
      ex('squats', 'Bodyweight Squats', 12, 18, 22),
      ex('lunges', 'Reverse Lunges', 6, 8, 10, { perSide: true }),
      ex('plank', 'Plank', 20, 30, 40, { timed: true }),
      ex('jacks', 'Jumping Jacks', 15, 20, 30),
    ],
    coachMessage: 'Red-phase energy: own the basics. Clean reps beat ego.',
  },
  {
    title: 'CONDITIONING DRILL',
    focus: ['Cardio', 'Work capacity'],
    rounds: 4,
    rest: { min: 45, max: 75 },
    minutes: { min: 22, max: 32 },
    exercises: [
      ex('burpees', 'Burpees', 5, 8, 10),
      ex('climbers', 'Mountain Climbers', 14, 20, 28),
      ex('highknees', 'High Knees', 20, 30, 40, { timed: true }),
      ex('squats', 'Squats', 12, 15, 20),
      ex('plank', 'Plank', 20, 30, 40, { timed: true }),
    ],
  },
  {
    title: 'UPPER TOUGHEN',
    focus: ['Push', 'Core'],
    rounds: 4,
    rest: { min: 60, max: 90 },
    minutes: { min: 22, max: 35 },
    exercises: [
      ex('pushups', 'Push-Ups', 8, 12, 16),
      ex('diamond', 'Diamond Push-Ups', 4, 8, 10),
      ex('pike', 'Pike Push-Ups', 4, 8, 10),
      ex('dips', 'Chair Dips', 6, 10, 12),
      ex('plank', 'Side Plank', 15, 20, 30, { timed: true, perSide: true }),
    ],
  },
  {
    title: 'LOWER TOUGHEN',
    focus: ['Legs', 'Hips'],
    rounds: 4,
    rest: { min: 60, max: 90 },
    minutes: { min: 22, max: 35 },
    exercises: [
      ex('squats', 'Squats', 12, 18, 22),
      ex('lunges', 'Lunges', 6, 10, 12, { perSide: true }),
      ex('bridges', 'Glute Bridges', 10, 15, 18),
      ex('calfraises', 'Calf Raises', 12, 15, 20),
      ex('wallsit', 'Wall Sit', 20, 30, 40, { timed: true }),
    ],
  },
];

const BUILD: DayTemplate[] = [
  {
    title: 'DENSITY ASSAULT',
    focus: ['Fat burn', 'Build phase'],
    rounds: 5,
    rest: { min: 40, max: 70 },
    minutes: { min: 25, max: 40 },
    exercises: [
      ex('burpees', 'Burpees', 8, 12, 15),
      ex('pushups', 'Push-Ups', 12, 18, 22),
      ex('squats', 'Squats', 15, 20, 25),
      ex('climbers', 'Mountain Climbers', 20, 30, 40),
      ex('plank', 'Plank', 30, 45, 60, { timed: true }),
    ],
    coachMessage: 'White-phase density: shorter rests, same standards.',
  },
  {
    title: 'PUSH COMMAND',
    focus: ['Chest', 'Shoulders', 'Triceps'],
    rounds: 5,
    rest: { min: 50, max: 80 },
    minutes: { min: 25, max: 40 },
    exercises: [
      ex('pushups', 'Push-Ups', 12, 18, 22),
      ex('diamond', 'Diamond Push-Ups', 8, 12, 15),
      ex('pike', 'Pike Push-Ups', 8, 12, 15),
      ex('dips', 'Chair Dips', 10, 14, 18),
      ex('hollow', 'Hollow Hold', 20, 30, 40, { timed: true }),
    ],
  },
  {
    title: 'LEG FORGE',
    focus: ['Legs', 'Power'],
    rounds: 5,
    rest: { min: 50, max: 80 },
    minutes: { min: 25, max: 40 },
    exercises: [
      ex('squats', 'Squats', 18, 25, 30),
      ex('lunges', 'Walking Lunges', 10, 12, 15, { perSide: true }),
      ex('jumpsquats', 'Jump Squats', 8, 12, 15),
      ex('bridges', 'Single-Leg Bridge', 8, 10, 12, { perSide: true }),
      ex('wallsit', 'Wall Sit', 30, 45, 60, { timed: true }),
    ],
  },
  {
    title: 'CORE + CARDIO',
    focus: ['Core', 'Conditioning'],
    rounds: 5,
    rest: { min: 40, max: 65 },
    minutes: { min: 24, max: 38 },
    exercises: [
      ex('climbers', 'Mountain Climbers', 24, 36, 48),
      ex('highknees', 'High Knees', 30, 40, 50, { timed: true }),
      ex('situps', 'Sit-Ups', 15, 20, 25),
      ex('legraises', 'Leg Raises', 10, 15, 18),
      ex('plank', 'Plank', 35, 50, 70, { timed: true }),
    ],
  },
];

const SUSTAIN: DayTemplate[] = [
  {
    title: 'SUSTAINING FORCE',
    focus: ['Full body', 'Sustaining'],
    rounds: 6,
    rest: { min: 35, max: 60 },
    minutes: { min: 28, max: 45 },
    exercises: [
      ex('burpees', 'Burpees', 10, 14, 18),
      ex('pushups', 'Push-Ups', 15, 20, 25),
      ex('squats', 'Squats', 20, 25, 30),
      ex('lunges', 'Lunges', 10, 14, 16, { perSide: true }),
      ex('plank', 'Plank', 40, 60, 75, { timed: true }),
    ],
    coachMessage: 'Blue-phase sustain: you carry the standard now.',
  },
  {
    title: 'OPERATOR CIRCUIT',
    focus: ['Endurance', 'Mixed'],
    rounds: 6,
    rest: { min: 30, max: 55 },
    minutes: { min: 28, max: 45 },
    exercises: [
      ex('pushups', 'Push-Ups', 15, 22, 28),
      ex('climbers', 'Mountain Climbers', 30, 40, 50),
      ex('jumpsquats', 'Jump Squats', 10, 14, 18),
      ex('dips', 'Chair Dips', 12, 16, 20),
      ex('hollow', 'Hollow Hold', 25, 40, 50, { timed: true }),
    ],
  },
  {
    title: 'FORCE MULTIPLIER',
    focus: ['Strength-endurance'],
    rounds: 5,
    rest: { min: 45, max: 70 },
    minutes: { min: 26, max: 42 },
    exercises: [
      ex('pike', 'Pike Push-Ups', 10, 14, 18),
      ex('diamond', 'Diamond Push-Ups', 10, 14, 18),
      ex('squats', 'Squats', 22, 28, 35),
      ex('lunges', 'Reverse Lunges', 12, 15, 18, { perSide: true }),
      ex('wallsit', 'Wall Sit', 40, 55, 70, { timed: true }),
    ],
  },
  {
    title: 'VICTORY FORGE PREP',
    focus: ['Peak density'],
    rounds: 6,
    rest: { min: 30, max: 50 },
    minutes: { min: 30, max: 48 },
    exercises: [
      ex('burpees', 'Burpees', 12, 16, 20),
      ex('pushups', 'Push-Ups', 18, 25, 30),
      ex('squats', 'Squats', 25, 30, 40),
      ex('climbers', 'Mountain Climbers', 35, 45, 55),
      ex('plank', 'Plank', 45, 70, 90, { timed: true }),
    ],
  },
];

const RECOVERY: DayTemplate = {
  title: 'ACTIVE RECOVERY',
  focus: ['Mobility', 'Reset'],
  rounds: 2,
  rest: { min: 30, max: 45 },
  minutes: { min: 15, max: 25 },
  exercises: [
    ex('jacks', 'Easy Jumping Jacks', 10, 15, 20),
    ex('bridges', 'Glute Bridges', 10, 12, 15),
    ex('lunges', 'Slow Lunges', 5, 6, 8, { perSide: true }),
    ex('plank', 'Easy Plank', 15, 20, 30, { timed: true }),
  ],
  isRecovery: true,
  coachMessage: 'Recovery is training. Move easy. Fuel and sleep hard.',
};

function phaseForWeek(week: number): 'toughening' | 'build' | 'sustain' {
  if (week <= 4) return 'toughening';
  if (week <= 8) return 'build';
  return 'sustain';
}

function templatesForPhase(phase: 'toughening' | 'build' | 'sustain') {
  if (phase === 'toughening') return TOUGHENING;
  if (phase === 'build') return BUILD;
  return SUSTAIN;
}

function scaleDay(template: DayTemplate, day: number, week: number): ProgramDay {
  const phaseBump = week <= 4 ? 0 : week <= 8 ? 2 : 4;
  const exercises = template.exercises.map((exercise) => {
    const baseRep =
      typeof exercise.soldier?.reps === 'number'
        ? exercise.soldier.reps
        : typeof exercise.reps === 'number'
          ? exercise.reps
          : 10;
    const timed = Boolean(exercise.durationSec);
    return {
      ...exercise,
      id: `lt-d${day}-${exercise.id}`,
      recruit: timed
        ? {
            durationSec:
              (exercise.recruit?.durationSec ?? exercise.durationSec ?? 20) +
              phaseBump,
          }
        : {
            reps:
              (typeof exercise.recruit?.reps === 'number'
                ? exercise.recruit.reps
                : baseRep - 4) + phaseBump,
          },
      soldier: timed
        ? {
            durationSec:
              (exercise.soldier?.durationSec ?? exercise.durationSec ?? 30) +
              phaseBump,
          }
        : { reps: baseRep + phaseBump },
      elite: timed
        ? {
            durationSec:
              (exercise.elite?.durationSec ?? exercise.durationSec ?? 40) +
              phaseBump +
              5,
          }
        : {
            reps:
              (typeof exercise.elite?.reps === 'number'
                ? exercise.elite.reps
                : baseRep + 4) +
              phaseBump +
              2,
          },
    };
  });

  const phase = phaseForWeek(week);
  const phaseLabel =
    phase === 'toughening'
      ? 'Toughening'
      : phase === 'build'
        ? 'Build'
        : 'Sustaining';

  return {
    day,
    title: template.title,
    subtitle: `Week ${week} · ${phaseLabel}`,
    focus: template.focus,
    rounds: template.isRecovery
      ? template.rounds
      : template.rounds + (week > 8 ? 1 : 0),
    restSec: template.isRecovery ? undefined : template.rest,
    estimatedMinutes: {
      min: template.minutes.min + Math.floor(week / 3),
      max: template.minutes.max + Math.floor(week / 2),
    },
    exercises,
    isRecovery: template.isRecovery,
    coachMessage: template.coachMessage,
  };
}

const days: ProgramDay[] = Array.from({ length: 84 }, (_, index) => {
  const day = index + 1;
  const week = Math.ceil(day / 7);
  const dayInWeek = ((day - 1) % 7) + 1;

  if (day === 84) {
    return {
      day: 84,
      title: 'LONG TRAIN FINAL TEST',
      subtitle: 'Week 12 · Culmination',
      focus: ['Max effort', '12-week proof'],
      isFinalTest: true,
      estimatedMinutes: { min: 45, max: 75 },
      exercises: [
        ex('pushups', 'Push-Ups', 70, 110, 140, {
          notes: 'Divide into manageable sets.',
        }),
        ex('squats', 'Squats', 120, 180, 220, {
          notes: 'Divide into manageable sets.',
        }),
        ex('lunges', 'Alternating Lunges', 70, 110, 140, {
          notes: 'Divide into manageable sets.',
        }),
        ex('climbers', 'Mountain Climbers', 80, 120, 150, {
          notes: 'Divide into manageable sets.',
        }),
        ex('burpees', 'Burpees', 40, 60, 80, {
          notes: 'Divide into manageable sets.',
        }),
        ex('plank', 'Planks (total)', 200, 360, 420, {
          timed: true,
          notes: 'Accumulate total plank time across sets.',
        }),
      ],
      coachMessage:
        'Twelve weeks. Finish clean. Log the scoreboard for your squad.',
    };
  }

  if (dayInWeek === 7) {
    return scaleDay(RECOVERY, day, week);
  }

  const phase = phaseForWeek(week);
  const pool = templatesForPhase(phase);
  const template = pool[(dayInWeek - 1) % pool.length];
  return scaleDay(template, day, week);
});

export const OPERATION_LONG_TRAIN: WorkoutProgram = {
  id: 'operation-long-train',
  name: 'LONG TRAIN',
  slug: 'operation-long-train',
  tagline: '12 weeks. Build up, get stronger, keep the habit.',
  subtitle: '12-Week Progressive Bodyweight Program',
  categories: [
    'conditioning',
    'discipline',
    'calisthenics',
    'endurance',
    'fat_burn',
  ],
  durationDays: 84,
  equipment: 'None — bodyweight only',
  averageWorkout: '20-45 minutes',
  difficulty: 'Beginner to Advanced',
  goals: [
    'Build lasting work capacity over 12 weeks',
    'Progress through foundation → build → sustain phases',
    'Pair with long-train nutrition',
    'Stay accountable with friends for the long haul',
  ],
  featured: false,
  militaryThemed: false,
  days,
};

export const LONG_TRAIN_PHASES = [
  {
    id: 'toughening',
    weeks: '1–4',
    title: 'Toughening',
    detail:
      'Foundation volume, technique, and habit — inspired by BCT/PRT toughening emphasis.',
  },
  {
    id: 'build',
    weeks: '5–8',
    title: 'Build',
    detail: 'Higher density, shorter rests, more rounds — capacity over ego.',
  },
  {
    id: 'sustain',
    weeks: '9–12',
    title: 'Sustaining',
    detail:
      'Peak density and a culminating final test — civilian nod to sustaining / Victory Forge energy.',
  },
] as const;
