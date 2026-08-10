export type MuscleId =
  | 'chest'
  | 'shoulders'
  | 'triceps'
  | 'biceps'
  | 'abs'
  | 'obliques'
  | 'back'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'full';

export type ExercisePose =
  | 'pushup'
  | 'squat'
  | 'lunge'
  | 'plank'
  | 'burpee'
  | 'climber'
  | 'jumpingJack'
  | 'highKnees'
  | 'dip'
  | 'bridge'
  | 'pike'
  | 'situp'
  | 'generic';

export interface ExerciseVisual {
  pose: ExercisePose;
  muscles: MuscleId[];
  cue: string;
  formTips: string[];
}

const MUSCLE_LABELS: Record<MuscleId, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  triceps: 'Triceps',
  biceps: 'Biceps',
  abs: 'Abs',
  obliques: 'Obliques',
  back: 'Back',
  glutes: 'Glutes',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
  full: 'Full body',
};

export function muscleLabel(id: MuscleId): string {
  return MUSCLE_LABELS[id];
}

const RULES: Array<{ match: RegExp; visual: ExerciseVisual }> = [
  {
    match: /diamond|close.?grip.?push/i,
    visual: {
      pose: 'pushup',
      muscles: ['triceps', 'chest', 'shoulders'],
      cue: 'Hands under chest, elbows tight to ribs.',
      formTips: ['Keep a straight line head to heels', 'Lower under control'],
    },
  },
  {
    match: /pike.?push/i,
    visual: {
      pose: 'pike',
      muscles: ['shoulders', 'triceps', 'abs'],
      cue: 'Hips high — press like an overhead press.',
      formTips: ['Look toward your toes', 'Bend elbows, crown of head toward floor'],
    },
  },
  {
    match: /push.?up|pushup/i,
    visual: {
      pose: 'pushup',
      muscles: ['chest', 'shoulders', 'triceps', 'abs'],
      cue: 'Hands under shoulders, body in one line.',
      formTips: ['Chest nearly touches the floor', 'Drive through palms'],
    },
  },
  {
    match: /dip/i,
    visual: {
      pose: 'dip',
      muscles: ['triceps', 'chest', 'shoulders'],
      cue: 'Hands on chair edge, hips drop straight down.',
      formTips: ['Elbows back, not flared', 'Keep chest tall'],
    },
  },
  {
    match: /jump.?squat/i,
    visual: {
      pose: 'squat',
      muscles: ['quads', 'glutes', 'calves'],
      cue: 'Sit back, then explode up and land soft.',
      formTips: ['Knees track toes', 'Absorb the landing'],
    },
  },
  {
    match: /squat/i,
    visual: {
      pose: 'squat',
      muscles: ['quads', 'glutes', 'hamstrings'],
      cue: 'Feet shoulder-width, sit hips back and down.',
      formTips: ['Chest up', 'Drive through mid-foot'],
    },
  },
  {
    match: /lunge/i,
    visual: {
      pose: 'lunge',
      muscles: ['quads', 'glutes', 'hamstrings'],
      cue: 'Step back, both knees ~90°, front heel planted.',
      formTips: ['Torso upright', 'Complete both sides'],
    },
  },
  {
    match: /bridge|hip.?thrust/i,
    visual: {
      pose: 'bridge',
      muscles: ['glutes', 'hamstrings', 'abs'],
      cue: 'Drive hips up, squeeze glutes at the top.',
      formTips: ['Do not overarch low back', 'Feet flat'],
    },
  },
  {
    match: /plank/i,
    visual: {
      pose: 'plank',
      muscles: ['abs', 'shoulders', 'glutes'],
      cue: 'Forearms down, body rigid like a board.',
      formTips: ['Squeeze glutes', 'Do not sag hips'],
    },
  },
  {
    match: /mountain.?climber|climber/i,
    visual: {
      pose: 'climber',
      muscles: ['abs', 'shoulders', 'quads'],
      cue: 'High plank — drive knees in under chest.',
      formTips: ['Hips stay level', 'Quick but controlled'],
    },
  },
  {
    match: /burpee/i,
    visual: {
      pose: 'burpee',
      muscles: ['full', 'chest', 'quads', 'shoulders'],
      cue: 'Squat → plank → push-up → jump.',
      formTips: ['Chest to floor if able', 'Land soft on the jump'],
    },
  },
  {
    match: /jumping.?jack|jack/i,
    visual: {
      pose: 'jumpingJack',
      muscles: ['calves', 'shoulders', 'full'],
      cue: 'Jump feet out as arms reach overhead.',
      formTips: ['Soft knees', 'Stay light on feet'],
    },
  },
  {
    match: /high.?knee/i,
    visual: {
      pose: 'highKnees',
      muscles: ['quads', 'calves', 'abs'],
      cue: 'Drive knees up toward hip height, pump arms.',
      formTips: ['Stay tall', 'Land on balls of feet'],
    },
  },
  {
    match: /sit.?up|crunch|leg.?raise|v.?up/i,
    visual: {
      pose: 'situp',
      muscles: ['abs', 'obliques'],
      cue: 'Brace core and curl or lift with control.',
      formTips: ['Exhale on effort', 'Avoid yanking the neck'],
    },
  },
];

const FALLBACK: ExerciseVisual = {
  pose: 'generic',
  muscles: ['full'],
  cue: 'Move with control. Quality reps beat rushing.',
  formTips: ['Brace your core', 'Full range of motion'],
};

export function getExerciseVisual(name: string): ExerciseVisual {
  for (const rule of RULES) {
    if (rule.match.test(name)) return rule.visual;
  }
  return FALLBACK;
}
