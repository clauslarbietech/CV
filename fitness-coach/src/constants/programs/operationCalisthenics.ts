import { ExerciseDefinition, ProgramDay, WorkoutProgram } from '@/types';

type Tiered = {
  name: string;
  base: Omit<ExerciseDefinition, 'id' | 'name'>;
  recruit: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
  soldier: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
  elite: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
};

function ex(
  day: number,
  index: number,
  def: Tiered,
): ExerciseDefinition {
  return {
    id: `cal-d${day}-e${index}`,
    name: def.name,
    ...def.base,
    recruit: def.recruit,
    soldier: def.soldier,
    elite: def.elite,
  };
}

function scaleReps(n: number, week: 1 | 2 | 3): number {
  return Math.round(n * (1 + (week - 1) * 0.15));
}

function scaleHold(sec: number, week: 1 | 2 | 3): number {
  return Math.round(sec * (1 + (week - 1) * 0.2));
}

type Template = {
  title: string;
  focus: string[];
  rounds: number;
  restSec: { min: number; max: number };
  estimatedMinutes: { min: number; max: number };
  isRecovery?: boolean;
  build: (day: number, week: 1 | 2 | 3) => ExerciseDefinition[];
};

const WEEK_TEMPLATES: Template[] = [
  {
    title: 'PUSH CONTROL',
    focus: ['Push strength', 'Scapular control'],
    rounds: 4,
    restSec: { min: 60, max: 90 },
    estimatedMinutes: { min: 22, max: 32 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Push-Ups',
        base: { reps: scaleReps(12, week) },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(12, week) },
        elite: { reps: scaleReps(16, week) },
      }),
      ex(day, 2, {
        name: 'Pike Push-Ups',
        base: { reps: scaleReps(8, week) },
        recruit: { reps: scaleReps(5, week) },
        soldier: { reps: scaleReps(8, week) },
        elite: { reps: scaleReps(12, week) },
      }),
      ex(day, 3, {
        name: 'Diamond Push-Ups',
        base: { reps: scaleReps(8, week) },
        recruit: { reps: scaleReps(5, week) },
        soldier: { reps: scaleReps(8, week) },
        elite: { reps: scaleReps(12, week) },
      }),
      ex(day, 4, {
        name: 'Plank',
        base: { durationSec: scaleHold(30, week) },
        recruit: { durationSec: scaleHold(20, week) },
        soldier: { durationSec: scaleHold(30, week) },
        elite: { durationSec: scaleHold(45, week) },
      }),
    ],
  },
  {
    title: 'LOWER BODY FLOW',
    focus: ['Legs', 'Balance', 'Endurance'],
    rounds: 4,
    restSec: { min: 50, max: 80 },
    estimatedMinutes: { min: 22, max: 34 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Bodyweight Squats',
        base: { reps: scaleReps(20, week) },
        recruit: { reps: scaleReps(15, week) },
        soldier: { reps: scaleReps(20, week) },
        elite: { reps: scaleReps(28, week) },
      }),
      ex(day, 2, {
        name: 'Reverse Lunges',
        base: { reps: scaleReps(10, week), perSide: true },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(14, week) },
      }),
      ex(day, 3, {
        name: 'Glute Bridge',
        base: { reps: scaleReps(15, week) },
        recruit: { reps: scaleReps(12, week) },
        soldier: { reps: scaleReps(15, week) },
        elite: { reps: scaleReps(20, week) },
      }),
      ex(day, 4, {
        name: 'Jumping Jacks',
        base: { reps: scaleReps(30, week) },
        recruit: { reps: scaleReps(20, week) },
        soldier: { reps: scaleReps(30, week) },
        elite: { reps: scaleReps(40, week) },
      }),
    ],
  },
  {
    title: 'CORE ARMOR',
    focus: ['Core', 'Anti-rotation', 'Stability'],
    rounds: 4,
    restSec: { min: 45, max: 70 },
    estimatedMinutes: { min: 18, max: 28 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Sit-Ups',
        base: { reps: scaleReps(15, week) },
        recruit: { reps: scaleReps(10, week) },
        soldier: { reps: scaleReps(15, week) },
        elite: { reps: scaleReps(22, week) },
      }),
      ex(day, 2, {
        name: 'Mountain Climbers',
        base: { reps: scaleReps(20, week) },
        recruit: { reps: scaleReps(14, week) },
        soldier: { reps: scaleReps(20, week) },
        elite: { reps: scaleReps(30, week) },
      }),
      ex(day, 3, {
        name: 'Plank',
        base: { durationSec: scaleHold(35, week) },
        recruit: { durationSec: scaleHold(25, week) },
        soldier: { durationSec: scaleHold(35, week) },
        elite: { durationSec: scaleHold(50, week) },
      }),
      ex(day, 4, {
        name: 'High Knees',
        base: { durationSec: scaleHold(30, week) },
        recruit: { durationSec: scaleHold(20, week) },
        soldier: { durationSec: scaleHold(30, week) },
        elite: { durationSec: scaleHold(40, week) },
      }),
    ],
  },
  {
    title: 'FULL-BODY DENSITY',
    focus: ['Conditioning', 'Full body'],
    rounds: 5,
    restSec: { min: 40, max: 70 },
    estimatedMinutes: { min: 24, max: 36 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Burpees',
        base: { reps: scaleReps(8, week) },
        recruit: { reps: scaleReps(5, week) },
        soldier: { reps: scaleReps(8, week) },
        elite: { reps: scaleReps(12, week) },
      }),
      ex(day, 2, {
        name: 'Push-Ups',
        base: { reps: scaleReps(12, week) },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(12, week) },
        elite: { reps: scaleReps(16, week) },
      }),
      ex(day, 3, {
        name: 'Squats',
        base: { reps: scaleReps(18, week) },
        recruit: { reps: scaleReps(12, week) },
        soldier: { reps: scaleReps(18, week) },
        elite: { reps: scaleReps(24, week) },
      }),
      ex(day, 4, {
        name: 'Mountain Climbers',
        base: { reps: scaleReps(24, week) },
        recruit: { reps: scaleReps(16, week) },
        soldier: { reps: scaleReps(24, week) },
        elite: { reps: scaleReps(32, week) },
      }),
    ],
  },
  {
    title: 'SKILL + VOLUME',
    focus: ['Skill practice', 'Volume tolerance'],
    rounds: 4,
    restSec: { min: 50, max: 80 },
    estimatedMinutes: { min: 22, max: 34 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Pike Push-Ups',
        base: { reps: scaleReps(10, week) },
        recruit: { reps: scaleReps(6, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(14, week) },
      }),
      ex(day, 2, {
        name: 'Lunges',
        base: { reps: scaleReps(12, week), perSide: true },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(12, week) },
        elite: { reps: scaleReps(15, week) },
      }),
      ex(day, 3, {
        name: 'Dip Hold / Chair Dips',
        base: { reps: scaleReps(10, week), notes: 'Use a sturdy chair or bench.' },
        recruit: { reps: scaleReps(6, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(14, week) },
      }),
      ex(day, 4, {
        name: 'Plank',
        base: { durationSec: scaleHold(40, week) },
        recruit: { durationSec: scaleHold(25, week) },
        soldier: { durationSec: scaleHold(40, week) },
        elite: { durationSec: scaleHold(55, week) },
      }),
    ],
  },
  {
    title: 'ACTIVE RECOVERY',
    focus: ['Mobility', 'Easy volume'],
    rounds: 3,
    restSec: { min: 45, max: 60 },
    estimatedMinutes: { min: 15, max: 22 },
    isRecovery: true,
    build: (day, week) => [
      ex(day, 1, {
        name: 'Bodyweight Squats',
        base: { reps: scaleReps(12, week) },
        recruit: { reps: scaleReps(10, week) },
        soldier: { reps: scaleReps(12, week) },
        elite: { reps: scaleReps(15, week) },
      }),
      ex(day, 2, {
        name: 'Glute Bridge',
        base: { reps: scaleReps(12, week) },
        recruit: { reps: scaleReps(10, week) },
        soldier: { reps: scaleReps(12, week) },
        elite: { reps: scaleReps(15, week) },
      }),
      ex(day, 3, {
        name: 'Plank',
        base: { durationSec: scaleHold(25, week) },
        recruit: { durationSec: scaleHold(15, week) },
        soldier: { durationSec: scaleHold(25, week) },
        elite: { durationSec: scaleHold(35, week) },
      }),
      ex(day, 4, {
        name: 'Jumping Jacks',
        base: { reps: scaleReps(20, week) },
        recruit: { reps: scaleReps(15, week) },
        soldier: { reps: scaleReps(20, week) },
        elite: { reps: scaleReps(25, week) },
      }),
    ],
  },
  {
    title: 'WEEKLY BENCHMARK',
    focus: ['Benchmark', 'Consistency check'],
    rounds: 4,
    restSec: { min: 45, max: 75 },
    estimatedMinutes: { min: 24, max: 38 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Push-Ups',
        base: { reps: scaleReps(15, week) },
        recruit: { reps: scaleReps(10, week) },
        soldier: { reps: scaleReps(15, week) },
        elite: { reps: scaleReps(20, week) },
      }),
      ex(day, 2, {
        name: 'Squats',
        base: { reps: scaleReps(25, week) },
        recruit: { reps: scaleReps(18, week) },
        soldier: { reps: scaleReps(25, week) },
        elite: { reps: scaleReps(35, week) },
      }),
      ex(day, 3, {
        name: 'Burpees',
        base: { reps: scaleReps(10, week) },
        recruit: { reps: scaleReps(6, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(14, week) },
      }),
      ex(day, 4, {
        name: 'Plank',
        base: { durationSec: scaleHold(45, week) },
        recruit: { durationSec: scaleHold(30, week) },
        soldier: { durationSec: scaleHold(45, week) },
        elite: { durationSec: scaleHold(60, week) },
      }),
    ],
  },
];

function buildDays(): ProgramDay[] {
  const days: ProgramDay[] = [];
  for (let week = 1 as 1 | 2 | 3; week <= 3; week = (week + 1) as 1 | 2 | 3) {
    WEEK_TEMPLATES.forEach((template, index) => {
      const day = (week - 1) * 7 + index + 1;
      const isFinal = day === 21;
      days.push({
        day,
        title: isFinal ? 'FOUNDATION TEST' : template.title,
        subtitle: `Week ${week}`,
        focus: isFinal
          ? ['Max clean volume', 'Challenge completion']
          : template.focus,
        rounds: isFinal ? 5 : template.rounds,
        restSec: template.restSec,
        estimatedMinutes: isFinal
          ? { min: 30, max: 45 }
          : template.estimatedMinutes,
        isRecovery: template.isRecovery && !isFinal,
        isFinalTest: isFinal,
        exercises: isFinal
          ? [
              ex(day, 1, {
                name: 'Push-Ups',
                base: { reps: 60, notes: 'Break into clean sets.' },
                recruit: { reps: 40 },
                soldier: { reps: 60 },
                elite: { reps: 80 },
              }),
              ex(day, 2, {
                name: 'Squats',
                base: { reps: 80, notes: 'Break into clean sets.' },
                recruit: { reps: 50 },
                soldier: { reps: 80 },
                elite: { reps: 100 },
              }),
              ex(day, 3, {
                name: 'Pike Push-Ups',
                base: { reps: 30, notes: 'Break into clean sets.' },
                recruit: { reps: 18 },
                soldier: { reps: 30 },
                elite: { reps: 40 },
              }),
              ex(day, 4, {
                name: 'Burpees',
                base: { reps: 30, notes: 'Break into clean sets.' },
                recruit: { reps: 18 },
                soldier: { reps: 30 },
                elite: { reps: 40 },
              }),
              ex(day, 5, {
                name: 'Plank',
                base: {
                  durationSec: 180,
                  notes: '3 total minutes across sets.',
                },
                recruit: { durationSec: 120 },
                soldier: { durationSec: 180 },
                elite: { durationSec: 240 },
              }),
            ]
          : template.build(day, week),
        coachMessage: isFinal
          ? 'Own every rep. Quality over speed — finish the foundation block.'
          : week === 1
            ? 'Lock technique first. Speed comes later.'
            : week === 2
              ? 'Same patterns, slightly denser. Stay crisp.'
              : 'Own the volume. Leave one clean rep in the tank.',
        extraBlocks: template.isRecovery
          ? [
              {
                title: 'Mobility walk',
                description: 'Optional 10–20 min easy walk after the session.',
              },
            ]
          : undefined,
      });
    });
  }
  return days;
}

/** Dedicated bodyweight skill + volume track (not just a tag on Iron). */
export const OPERATION_CALISTHENICS: WorkoutProgram = {
  id: 'operation-calisthenics',
  name: 'CALISTHENICS FOUNDATION',
  slug: 'calisthenics-foundation',
  tagline: '21 days of progressive bodyweight skill, control, and clean volume.',
  subtitle: '21-Day Progressive Calisthenics Block',
  categories: ['calisthenics', 'muscle', 'conditioning', 'strength'],
  durationDays: 21,
  equipment: 'Bodyweight (optional sturdy chair)',
  averageWorkout: '18-36 minutes',
  difficulty: 'Beginner to Intermediate+',
  goals: [
    'Build push / squat / core control',
    'Improve bodyweight skill consistency',
    'Increase muscular endurance',
    'Learn progressive density without equipment',
  ],
  featured: true,
  militaryThemed: false,
  days: buildDays(),
};
