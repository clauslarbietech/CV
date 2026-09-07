import { ExerciseDefinition, ProgramDay } from '@/types';

/**
 * Timed mission windows for morning vs night.
 * Both span ~3–30 minutes, but the selectable steps are DIFFERENT.
 *
 * Morning (AM PT): denser activation / conditioning — research-backed short HIIT + calisthenics.
 * Night (PM): recovery-biased + lighter conditioning — Army Recovery Drill / mobility-led.
 *
 * Sources:
 * - Army PRT session elements (Preparation → Activity → Recovery)
 * - Tabata / tactical short HIIT density for morning windows
 * - Military.com Mobility 20/20 + Army Recovery Drill for evening windows
 * - Sunrise / short calisthenics flows (3–5 min habit builders)
 */

export type SessionSlot = 'morning' | 'evening';

/** Union of every selectable morning + evening budget. */
export type ExpressBudget =
  | 3
  | 4
  | 5
  | 7
  | 8
  | 10
  | 12
  | 15
  | 18
  | 20
  | 25
  | 28
  | 30;

export const ALL_EXPRESS_BUDGETS: ExpressBudget[] = [
  3, 4, 5, 7, 8, 10, 12, 15, 18, 20, 25, 28, 30,
];

export function isExpressBudget(value: number): value is ExpressBudget {
  return (ALL_EXPRESS_BUDGETS as number[]).includes(value);
}

export type TimedOption = {
  budget: ExpressBudget;
  label: string;
  strategy: string;
  description: string;
};

/** Morning ladder: 3 → 30 with energizing PT steps (different from night). */
export const MORNING_DURATION_OPTIONS: TimedOption[] = [
  {
    budget: 3,
    label: '3 MIN',
    strategy: 'Reveille Pulse',
    description: 'Wake-up circuit: squat + push + plank pulse.',
  },
  {
    budget: 5,
    label: '5 MIN',
    strategy: 'Sunrise Prep',
    description: 'Mini Preparation Drill + 1 hard set of push/squat.',
  },
  {
    budget: 10,
    label: '10 MIN',
    strategy: 'Morning Tabata',
    description: 'Dense 20s/10s-style rounds — morning activation.',
  },
  {
    budget: 15,
    label: '15 MIN',
    strategy: 'AM Conditioning',
    description: '3 rounds push / squat / core — classic short PT.',
  },
  {
    budget: 20,
    label: '20 MIN',
    strategy: 'Full Morning PT',
    description: 'Warm-up + 2 full circuits + short finisher.',
  },
  {
    budget: 30,
    label: '30 MIN',
    strategy: 'Unit PT Block',
    description: 'Preparation → activity → brief recovery (PRT-shaped).',
  },
];

/** Night ladder: 3 → 30 with DIFFERENT steps — recovery-biased. */
export const EVENING_DURATION_OPTIONS: TimedOption[] = [
  {
    budget: 4,
    label: '4 MIN',
    strategy: 'Lights-Out Reset',
    description: 'Breath + hip opener + easy march — wind down.',
  },
  {
    budget: 7,
    label: '7 MIN',
    strategy: 'Recovery Lite',
    description: 'Army-style stretch holds + gentle core.',
  },
  {
    budget: 12,
    label: '12 MIN',
    strategy: 'Evening Mobility',
    description: 'Recovery Drill pattern + light bodyweight flow.',
  },
  {
    budget: 18,
    label: '18 MIN',
    strategy: 'Night Conditioning',
    description: 'Moderate circuit then cooldown stretches.',
  },
  {
    budget: 25,
    label: '25 MIN',
    strategy: 'PM Strength + Soften',
    description: 'Controlled strength rounds + 5 min Recovery Drill.',
  },
  {
    budget: 30,
    label: '30 MIN',
    strategy: 'Double Session Night',
    description: 'Full evening block: activity + extended mobility.',
  },
];

/** @deprecated prefer MORNING_DURATION_OPTIONS / EVENING_DURATION_OPTIONS */
export const EXPRESS_OPTIONS = MORNING_DURATION_OPTIONS.filter((o) =>
  ([8, 10, 15] as number[]).includes(o.budget),
);

export const EXPRESS_SOURCES = [
  {
    title: 'Army PRT session elements (Prep → Activity → Recovery)',
    url: 'https://www.armyprt.com/planning_considerations/session-elements.shtml/',
    note: 'Official session shape adapted for short civilian windows.',
  },
  {
    title: 'Military calisthenics basic-training prep',
    url: 'https://www.operationmilitarykids.org/30-day-workout-plan-to-prep-for-basic-training/',
    note: 'Progressive bodyweight circuits used in recruit prep plans.',
  },
  {
    title: 'Mobility 20/20 (evening-friendly)',
    url: 'https://www.military.com/military-fitness/mobility-20-20-one-workout-you-need-2026-20-minutes-day-20-days-or-forever',
    note: 'Short mobility blocks that fit night recovery windows.',
  },
  {
    title: '15-minute calisthenics strength & energy',
    url: 'https://welltech.com/content/15-minute-calisthenics-workout',
    note: 'Evidence that short full-body calisthenics sessions still deliver stimulus.',
  },
] as const;

function pickCoreMoves(
  exercises: ExerciseDefinition[],
  count: number,
  preferRecovery: boolean,
): ExerciseDefinition[] {
  if (exercises.length === 0) return [];
  const priority = preferRecovery
    ? ['stretch', 'bridge', 'plank', 'march', 'reach', 'lunge', 'squat', 'push']
    : [
        'burpee',
        'push',
        'squat',
        'lunge',
        'mountain',
        'jump',
        'high knee',
        'sit',
        'plank',
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
    id: `timed-${exercise.id}-${index}`,
  }));
}

function moveCountForBudget(budget: ExpressBudget, slot: SessionSlot): number {
  if (budget <= 5) return slot === 'evening' ? 2 : 3;
  if (budget <= 12) return 4;
  if (budget <= 20) return 5;
  return 6;
}

function roundsForBudget(budget: ExpressBudget, slot: SessionSlot): number {
  if (budget <= 5) return 1;
  if (budget <= 12) return slot === 'evening' ? 2 : 3;
  if (budget <= 20) return 3;
  return slot === 'evening' ? 3 : 4;
}

function restForBudget(budget: ExpressBudget): { min: number; max: number } {
  if (budget <= 5) return { min: 10, max: 20 };
  if (budget <= 12) return { min: 20, max: 35 };
  if (budget <= 20) return { min: 30, max: 45 };
  return { min: 35, max: 55 };
}

function strategyFor(budget: ExpressBudget, slot: SessionSlot): TimedOption {
  const list =
    slot === 'morning' ? MORNING_DURATION_OPTIONS : EVENING_DURATION_OPTIONS;
  return (
    list.find((o) => o.budget === budget) ?? {
      budget,
      label: `${budget} MIN`,
      strategy: slot === 'morning' ? 'Morning PT' : 'Evening Session',
      description: 'Timed session window.',
    }
  );
}

/** Convert today's mission into a timed morning or evening window. */
export function toExpressMission(
  day: ProgramDay,
  budget: ExpressBudget,
  slot: SessionSlot = 'morning',
): ProgramDay {
  const option = strategyFor(budget, slot);
  const evening = slot === 'evening';

  if (day.isRecovery || (evening && budget <= 7)) {
    return {
      ...day,
      title: `${option.strategy.toUpperCase()}`,
      subtitle: `${slot === 'morning' ? 'Morning' : 'Night'} · ${budget} min`,
      estimatedMinutes: { min: budget, max: budget },
      rounds: evening ? 1 : undefined,
      exercises: evening
        ? pickCoreMoves(day.exercises, Math.max(2, moveCountForBudget(budget, slot)), true)
        : [],
      extraBlocks: [
        {
          title: `${budget}-minute ${evening ? 'recovery' : 'active recovery'} window`,
          description: evening
            ? 'Hold stretches 20–40s, easy breathing, light march. Inspired by Army Recovery Drill.'
            : budget <= 10
              ? 'Brisk walk + mobility (hips, shoulders, calves).'
              : 'Brisk walk 10–12 min + 3–5 minutes mobility.',
        },
      ],
      coachMessage: evening
        ? 'Night window: downshift the nervous system. Soften, don’t smash.'
        : 'Short on time still counts. Keep the streak with focused recovery.',
      focus: [...day.focus, evening ? 'Recovery' : 'Active recovery', 'Time-efficient'],
    };
  }

  if (day.isFinalTest) {
    const scale =
      budget <= 5 ? 0.25 : budget <= 12 ? 0.4 : budget <= 20 ? 0.55 : 0.7;
    return {
      ...day,
      title: `${day.title} · TIME-BOXED`,
      subtitle: `${slot === 'morning' ? 'Morning' : 'Night'} · ${budget} min`,
      estimatedMinutes: { min: budget, max: budget + 3 },
      rounds: undefined,
      exercises: day.exercises.map((exercise) => {
        if (exercise.durationSec) {
          const target = Math.max(30, Math.round(exercise.durationSec * scale));
          return {
            ...exercise,
            id: `timed-${exercise.id}`,
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
        const target = Math.max(6, Math.round(base * scale));
        return {
          ...exercise,
          id: `timed-${exercise.id}`,
          reps: target,
          recruit: { reps: Math.max(4, Math.round(target * 0.7)) },
          soldier: { reps: target },
          elite: { reps: Math.round(target * 1.2) },
          notes: 'Break into fast sets. Keep moving.',
        };
      }),
      coachMessage: `Time-boxed check (~${budget} min). Quality reps beat rushing form.`,
    };
  }

  const moveCount = moveCountForBudget(budget, slot);
  const rounds = roundsForBudget(budget, slot);
  const rest = restForBudget(budget);

  return {
    ...day,
    title: option.strategy.toUpperCase(),
    subtitle: `Converted from Day ${day.day} · ${slot === 'morning' ? 'Morning' : 'Night'} · ${budget} min`,
    focus: [
      ...day.focus,
      'Time-efficient',
      evening ? 'Evening recovery bias' : 'Morning activation',
    ],
    rounds,
    restSec: rest,
    estimatedMinutes: { min: budget, max: budget + 2 },
    exercises: pickCoreMoves(day.exercises, moveCount, evening),
    coachMessage: evening
      ? budget <= 12
        ? 'Night session: controlled effort, then soften with mobility.'
        : 'Evening block: earn the work, finish with Recovery Drill energy.'
      : budget <= 10
        ? 'Morning density: shorter rest, clear intent, then own your day.'
        : 'Morning PT block. Enough stimulus to count — then get on with life.',
    extraBlocks: [
      {
        title: evening ? 'Night protocol' : 'Morning protocol',
        description: option.description,
      },
    ],
  };
}
