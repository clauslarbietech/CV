import { ExerciseDefinition, ProgramDay, WorkoutProgram } from '@/types';

/**
 * Military Calisthenics — inspired by Army PRT session structure
 * (Preparation → Activities → Recovery) and bodyweight conditioning drills.
 *
 * Sources (civilian adaptations of public doctrine / training guides):
 * - Army PRT session elements (FM 7-22 / armyprt.com)
 * - Operation Military Kids basic-training bodyweight prep
 * - Conditioning Drill patterns (push, squat, core, locomotion)
 */

type Tiered = {
  name: string;
  base: Omit<ExerciseDefinition, 'id' | 'name'>;
  recruit: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
  soldier: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
  elite: Partial<Pick<ExerciseDefinition, 'reps' | 'durationSec'>>;
};

function ex(day: number, index: number, def: Tiered): ExerciseDefinition {
  return {
    id: `mil-d${day}-e${index}`,
    name: def.name,
    ...def.base,
    recruit: def.recruit,
    soldier: def.soldier,
    elite: def.elite,
  };
}

function scaleReps(n: number, week: 1 | 2 | 3 | 4): number {
  return Math.round(n * (1 + (week - 1) * 0.12));
}

function scaleHold(sec: number, week: 1 | 2 | 3 | 4): number {
  return Math.round(sec * (1 + (week - 1) * 0.15));
}

type Template = {
  title: string;
  focus: string[];
  rounds: number;
  restSec: { min: number; max: number };
  estimatedMinutes: { min: number; max: number };
  isRecovery?: boolean;
  build: (day: number, week: 1 | 2 | 3 | 4) => ExerciseDefinition[];
};

const WEEK_TEMPLATES: Template[] = [
  {
    title: 'PREP + PUSH',
    focus: ['Preparation drill', 'Push endurance'],
    rounds: 3,
    restSec: { min: 45, max: 75 },
    estimatedMinutes: { min: 20, max: 30 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Bend and Reach',
        base: { reps: scaleReps(10, week), notes: 'Preparation Drill style — controlled tempo.' },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(12, week) },
      }),
      ex(day, 2, {
        name: 'Push-Ups',
        base: { reps: scaleReps(12, week) },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(12, week) },
        elite: { reps: scaleReps(18, week) },
      }),
      ex(day, 3, {
        name: 'Bodyweight Squats',
        base: { reps: scaleReps(20, week) },
        recruit: { reps: scaleReps(15, week) },
        soldier: { reps: scaleReps(20, week) },
        elite: { reps: scaleReps(28, week) },
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
    title: 'CONDITIONING DRILL',
    focus: ['Full-body endurance', 'Military movement'],
    rounds: 4,
    restSec: { min: 40, max: 70 },
    estimatedMinutes: { min: 22, max: 32 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Jumping Jacks',
        base: { reps: scaleReps(30, week) },
        recruit: { reps: scaleReps(20, week) },
        soldier: { reps: scaleReps(30, week) },
        elite: { reps: scaleReps(40, week) },
      }),
      ex(day, 2, {
        name: 'Push-Ups',
        base: { reps: scaleReps(10, week) },
        recruit: { reps: scaleReps(6, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(15, week) },
      }),
      ex(day, 3, {
        name: 'Reverse Lunges',
        base: { reps: scaleReps(10, week), perSide: true },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(14, week) },
      }),
      ex(day, 4, {
        name: 'Mountain Climbers',
        base: { reps: scaleReps(20, week) },
        recruit: { reps: scaleReps(14, week) },
        soldier: { reps: scaleReps(20, week) },
        elite: { reps: scaleReps(28, week) },
      }),
      ex(day, 5, {
        name: 'Sit-Ups',
        base: { reps: scaleReps(15, week) },
        recruit: { reps: scaleReps(10, week) },
        soldier: { reps: scaleReps(15, week) },
        elite: { reps: scaleReps(22, week) },
      }),
    ],
  },
  {
    title: 'CORE + MARCH',
    focus: ['Core armor', 'Locomotion'],
    rounds: 3,
    restSec: { min: 45, max: 75 },
    estimatedMinutes: { min: 18, max: 28 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'High Knees',
        base: { durationSec: scaleHold(30, week) },
        recruit: { durationSec: scaleHold(20, week) },
        soldier: { durationSec: scaleHold(30, week) },
        elite: { durationSec: scaleHold(45, week) },
      }),
      ex(day, 2, {
        name: 'Plank',
        base: { durationSec: scaleHold(35, week) },
        recruit: { durationSec: scaleHold(20, week) },
        soldier: { durationSec: scaleHold(35, week) },
        elite: { durationSec: scaleHold(50, week) },
      }),
      ex(day, 3, {
        name: 'Glute Bridge',
        base: { reps: scaleReps(15, week) },
        recruit: { reps: scaleReps(12, week) },
        soldier: { reps: scaleReps(15, week) },
        elite: { reps: scaleReps(20, week) },
      }),
      ex(day, 4, {
        name: 'Chair Dips',
        base: { reps: scaleReps(10, week), notes: 'Sturdy chair or bench.' },
        recruit: { reps: scaleReps(6, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(14, week) },
      }),
    ],
  },
  {
    title: 'POWER ENDURANCE',
    focus: ['Density', 'Work capacity'],
    rounds: 4,
    restSec: { min: 35, max: 60 },
    estimatedMinutes: { min: 20, max: 30 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Burpees',
        base: {
          reps: scaleReps(8, week),
          notes: week === 1 ? 'Step-back burpees OK on Easy.' : 'Keep hips tight.',
        },
        recruit: { reps: scaleReps(5, week) },
        soldier: { reps: scaleReps(8, week) },
        elite: { reps: scaleReps(12, week) },
      }),
      ex(day, 2, {
        name: 'Push-Ups',
        base: { reps: scaleReps(12, week) },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(12, week) },
        elite: { reps: scaleReps(18, week) },
      }),
      ex(day, 3, {
        name: 'Squats',
        base: { reps: scaleReps(20, week) },
        recruit: { reps: scaleReps(15, week) },
        soldier: { reps: scaleReps(20, week) },
        elite: { reps: scaleReps(28, week) },
      }),
      ex(day, 4, {
        name: 'Sit-Ups',
        base: { reps: scaleReps(15, week) },
        recruit: { reps: scaleReps(10, week) },
        soldier: { reps: scaleReps(15, week) },
        elite: { reps: scaleReps(22, week) },
      }),
    ],
  },
  {
    title: 'RECOVERY DRILL',
    focus: ['Mobility', 'Army-style cooldown'],
    rounds: 2,
    restSec: { min: 30, max: 45 },
    estimatedMinutes: { min: 12, max: 20 },
    isRecovery: true,
    build: (day, week) => [
      ex(day, 1, {
        name: 'Overhead Arm Pull',
        base: {
          durationSec: scaleHold(30, week),
          perSide: true,
          notes: 'Recovery Drill hold — breathe steadily.',
        },
        recruit: { durationSec: 20 },
        soldier: { durationSec: 30 },
        elite: { durationSec: 40 },
      }),
      ex(day, 2, {
        name: 'Thigh Stretch',
        base: { durationSec: scaleHold(30, week), perSide: true },
        recruit: { durationSec: 20 },
        soldier: { durationSec: 30 },
        elite: { durationSec: 40 },
      }),
      ex(day, 3, {
        name: 'Hamstring Stretch',
        base: { durationSec: scaleHold(30, week), perSide: true },
        recruit: { durationSec: 20 },
        soldier: { durationSec: 30 },
        elite: { durationSec: 40 },
      }),
      ex(day, 4, {
        name: 'Easy March in Place',
        base: { durationSec: scaleHold(60, week) },
        recruit: { durationSec: 45 },
        soldier: { durationSec: 60 },
        elite: { durationSec: 90 },
      }),
    ],
  },
  {
    title: 'MIXED PT CIRCUIT',
    focus: ['Strength', 'Endurance', 'Core'],
    rounds: 3,
    restSec: { min: 45, max: 70 },
    estimatedMinutes: { min: 22, max: 34 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Pike Push-Ups',
        base: { reps: scaleReps(8, week) },
        recruit: { reps: scaleReps(5, week) },
        soldier: { reps: scaleReps(8, week) },
        elite: { reps: scaleReps(12, week) },
      }),
      ex(day, 2, {
        name: 'Walking Lunges',
        base: { reps: scaleReps(10, week), perSide: true },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(14, week) },
      }),
      ex(day, 3, {
        name: 'Push-Ups',
        base: { reps: scaleReps(12, week) },
        recruit: { reps: scaleReps(8, week) },
        soldier: { reps: scaleReps(12, week) },
        elite: { reps: scaleReps(16, week) },
      }),
      ex(day, 4, {
        name: 'Plank Shoulder Taps',
        base: { reps: scaleReps(16, week) },
        recruit: { reps: scaleReps(10, week) },
        soldier: { reps: scaleReps(16, week) },
        elite: { reps: scaleReps(24, week) },
      }),
    ],
  },
  {
    title: 'WEEKLY PT CHECK',
    focus: ['Benchmark', 'Consistency'],
    rounds: 4,
    restSec: { min: 40, max: 70 },
    estimatedMinutes: { min: 24, max: 36 },
    build: (day, week) => [
      ex(day, 1, {
        name: 'Push-Ups',
        base: { reps: scaleReps(15, week) },
        recruit: { reps: scaleReps(10, week) },
        soldier: { reps: scaleReps(15, week) },
        elite: { reps: scaleReps(22, week) },
      }),
      ex(day, 2, {
        name: 'Squats',
        base: { reps: scaleReps(25, week) },
        recruit: { reps: scaleReps(18, week) },
        soldier: { reps: scaleReps(25, week) },
        elite: { reps: scaleReps(35, week) },
      }),
      ex(day, 3, {
        name: 'Sit-Ups',
        base: { reps: scaleReps(20, week) },
        recruit: { reps: scaleReps(12, week) },
        soldier: { reps: scaleReps(20, week) },
        elite: { reps: scaleReps(30, week) },
      }),
      ex(day, 4, {
        name: 'Burpees',
        base: { reps: scaleReps(10, week) },
        recruit: { reps: scaleReps(6, week) },
        soldier: { reps: scaleReps(10, week) },
        elite: { reps: scaleReps(14, week) },
      }),
      ex(day, 5, {
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
  for (let week = 1 as 1 | 2 | 3 | 4; week <= 4; week = (week + 1) as 1 | 2 | 3 | 4) {
    WEEK_TEMPLATES.forEach((template, index) => {
      const day = (week - 1) * 7 + index + 1;
      const isFinal = day === 28;
      days.push({
        day,
        title: isFinal ? 'MILITARY PT FINAL' : template.title,
        subtitle: `Week ${week} · Military Calisthenics`,
        focus: isFinal
          ? ['Endurance check', 'Form under fatigue']
          : template.focus,
        rounds: isFinal ? 5 : template.rounds,
        restSec: template.restSec,
        estimatedMinutes: isFinal
          ? { min: 28, max: 40 }
          : template.estimatedMinutes,
        isRecovery: Boolean(template.isRecovery && !isFinal),
        isFinalTest: isFinal,
        exercises: isFinal
          ? [
              ex(day, 1, {
                name: 'Push-Ups',
                base: { reps: 50, notes: 'Break into clean sets.' },
                recruit: { reps: 30 },
                soldier: { reps: 50 },
                elite: { reps: 70 },
              }),
              ex(day, 2, {
                name: 'Squats',
                base: { reps: 70, notes: 'Break into clean sets.' },
                recruit: { reps: 45 },
                soldier: { reps: 70 },
                elite: { reps: 90 },
              }),
              ex(day, 3, {
                name: 'Sit-Ups',
                base: { reps: 50, notes: 'Break into clean sets.' },
                recruit: { reps: 30 },
                soldier: { reps: 50 },
                elite: { reps: 70 },
              }),
              ex(day, 4, {
                name: 'Burpees',
                base: { reps: 25, notes: 'Steady pace — no form collapse.' },
                recruit: { reps: 15 },
                soldier: { reps: 25 },
                elite: { reps: 35 },
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
          ? 'Final PT check. Quality reps beat rushing. Own the block.'
          : week === 1
            ? 'Learn the drill cadence. Form first — speed later.'
            : week === 2
              ? 'Same patterns, slightly denser. Stay crisp under fatigue.'
              : week === 3
                ? 'Work capacity week. Keep breathing controlled between rounds.'
                : 'Sustain phase. Leave one clean rep in the tank.',
        extraBlocks: template.isRecovery
          ? [
              {
                title: 'Recovery Drill note',
                description:
                  'Inspired by Army PRT Recovery Drill — hold stretches 20–40s, then easy walk if needed.',
              },
            ]
          : [
              {
                title: 'Session structure',
                description:
                  'Military PT pattern: warm-up prep → conditioning activity → finish with mobility when time allows.',
              },
            ],
      });
    });
  }
  return days;
}

/** 28-day military-style bodyweight PT track (Army PRT–inspired). */
export const OPERATION_MILITARY_CALISTHENICS: WorkoutProgram = {
  id: 'operation-military-calisthenics',
  name: 'MILITARY CALISTHENICS',
  slug: 'military-calisthenics',
  tagline: '28 days of Army-style bodyweight PT — prep, conditioning, recovery.',
  subtitle: '28-Day Military Calisthenics PT',
  categories: ['calisthenics', 'conditioning', 'discipline', 'endurance'],
  durationDays: 28,
  equipment: 'Bodyweight (optional sturdy chair)',
  averageWorkout: '12-34 minutes · or pick a morning/night timed window',
  difficulty: 'Beginner to Advanced',
  goals: [
    'Build push, squat, and core endurance like unit PT',
    'Practice Preparation → Activity → Recovery structure',
    'Train in short morning or evening windows (3–30 min)',
    'Progress weekly without gym equipment',
  ],
  featured: true,
  militaryThemed: true,
  days: buildDays(),
};
