import { ExerciseDefinition, ProgramDay } from '@/types';

/**
 * Short-time military / tactical strategies for when users don’t have 20–30+ min.
 *
 * Sources:
 * - Tabata protocol (20s work / 10s rest) used in tactical HIIT / Army MFT programs
 *   https://www.muscleandstrength.com/workouts/tactical-tabata
 * - Army PRT condensed sessions (ACFT Training Guide notes bold drills when time-limited)
 *   https://www.army-fitness.com/wp-content/uploads/2018/10/Official-Army-Combat-Fitness-Training-Guide.pdf
 * - Army PRT session structure (Preparation → Activity → Recovery), adaptable short
 *   https://www.armyprt.com/planning_considerations/session-elements.shtml/
 */

export type ExpressBudget = 8 | 10 | 15;

export const EXPRESS_SOURCES = [
  {
    title: 'Tactical Tabata (Army MFT-inspired HIIT)',
    url: 'https://www.muscleandstrength.com/workouts/tactical-tabata',
    note: 'High-intensity 20s/10s intervals for equipment-free conditioning in minimal time.',
  },
  {
    title: 'Army ACFT Training Guide — condensed PRT',
    url: 'https://www.army-fitness.com/wp-content/uploads/2018/10/Official-Army-Combat-Fitness-Training-Guide.pdf',
    note: 'Official guidance includes ~30-min condensed sessions and priority drills when time is limited.',
  },
  {
    title: 'Army PRT session elements',
    url: 'https://www.armyprt.com/planning_considerations/session-elements.shtml/',
    note: 'Preparation → Activity → Recovery structure; activity block can be shortened safely.',
  },
] as const;

export const EXPRESS_OPTIONS: Array<{
  budget: ExpressBudget;
  label: string;
  strategy: string;
  description: string;
}> = [
  {
    budget: 8,
    label: '8 MIN',
    strategy: 'Tactical Tabata Blast',
    description: '2 rounds · key compound moves · short rest (Tabata-inspired density).',
  },
  {
    budget: 10,
    label: '10 MIN',
    strategy: 'Combat Express',
    description: '3 hard rounds · push / squat / burpee focus · military HIIT density.',
  },
  {
    budget: 15,
    label: '15 MIN',
    strategy: 'Condensed PRT Assault',
    description: '3–4 rounds · fuller stimulus · Army condensed-session style.',
  },
];

function pickCoreMoves(exercises: ExerciseDefinition[], count: number): ExerciseDefinition[] {
  if (exercises.length === 0) return [];
  // Prefer compound patterns first
  const priority = [
    'burpee',
    'push',
    'squat',
    'lunge',
    'mountain',
    'jump',
    'plank',
    'high knee',
  ];
  const scored = [...exercises].sort((a, b) => {
    const score = (name: string) => {
      const lower = name.toLowerCase();
      const idx = priority.findIndex((p) => lower.includes(p));
      return idx === -1 ? 99 : idx;
    };
    return score(a.name) - score(b.name);
  });
  return scored.slice(0, count).map((exercise, index) => ({
    ...exercise,
    id: `express-${exercise.id}-${index}`,
  }));
}

/** Convert today's mission into a shorter executable day. */
export function toExpressMission(
  day: ProgramDay,
  budget: ExpressBudget,
): ProgramDay {
  if (day.isRecovery) {
    return {
      ...day,
      title: `${day.title} · EXPRESS`,
      estimatedMinutes: { min: budget, max: budget },
      rounds: undefined,
      exercises: [],
      extraBlocks: [
        {
          title: `${budget}-minute active recovery`,
          description:
            budget <= 10
              ? 'Brisk walk + 3 minutes mobility (hips, shoulders, calves).'
              : 'Brisk walk 10–12 min + 3–5 minutes mobility.',
        },
      ],
      coachMessage:
        'Short on time still counts. Keep the streak with focused recovery.',
    };
  }

  if (day.isFinalTest) {
    // Scaled final test — still hard, but time-boxed
    const scale = budget === 8 ? 0.35 : budget === 10 ? 0.45 : 0.6;
    return {
      ...day,
      title: `${day.title} · TIME-BOXED`,
      estimatedMinutes: { min: budget, max: budget + 5 },
      rounds: undefined,
      exercises: day.exercises.map((exercise) => {
        if (exercise.durationSec) {
          const target = Math.max(45, Math.round(exercise.durationSec * scale));
          return {
            ...exercise,
            id: `express-${exercise.id}`,
            durationSec: target,
            recruit: { durationSec: Math.round(target * 0.7) },
            soldier: { durationSec: target },
            elite: { durationSec: Math.round(target * 1.15) },
            notes: 'Accumulate time in short sets.',
          };
        }
        const base =
          typeof exercise.reps === 'number'
            ? exercise.reps
            : Number(String(exercise.reps).match(/\d+/)?.[0] ?? 20);
        const target = Math.max(8, Math.round(base * scale));
        return {
          ...exercise,
          id: `express-${exercise.id}`,
          reps: target,
          recruit: { reps: Math.max(5, Math.round(target * 0.7)) },
          soldier: { reps: target },
          elite: { reps: Math.round(target * 1.2) },
          notes: 'Break into fast sets. Keep moving.',
        };
      }),
      coachMessage: `Time-boxed final test (~${budget} min). Quality reps beat rushing form.`,
    };
  }

  const moveCount = budget === 8 ? 3 : budget === 10 ? 4 : 5;
  const rounds = budget === 8 ? 2 : 3;
  const rest =
    budget === 8
      ? { min: 20, max: 30 }
      : budget === 10
        ? { min: 25, max: 40 }
        : { min: 30, max: 45 };

  const strategy =
    EXPRESS_OPTIONS.find((o) => o.budget === budget)?.strategy ?? 'Express Mission';

  return {
    ...day,
    title: `${strategy.toUpperCase()}`,
    subtitle: `Converted from Day ${day.day} · ${budget} minutes`,
    focus: [...day.focus, 'Time-efficient', 'HIIT density'],
    rounds,
    restSec: rest,
    estimatedMinutes: { min: budget, max: budget + 2 },
    exercises: pickCoreMoves(day.exercises, moveCount),
    coachMessage:
      budget <= 10
        ? 'Military density strategy: shorter rest, high effort, keep the mission alive.'
        : 'Condensed PRT-style assault. Enough stimulus to count — then get back to your day.',
    extraBlocks: [
      {
        title: 'Express protocol',
        description:
          budget === 8
            ? 'Inspired by Tabata density (short rest). Push hard on every set.'
            : 'Inspired by Army condensed PRT / tactical HIIT when full sessions aren’t possible.',
      },
    ],
  };
}
