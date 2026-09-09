import type {
  ChildrenFutureId,
  IntentionId,
  PriorityId,
} from '@/types';

export const INTENTION_OPTIONS: {
  id: IntentionId;
  label: string;
  hint: string;
}[] = [
  {
    id: 'life_partner',
    label: 'Life partner',
    hint: 'Building toward lasting commitment',
  },
  {
    id: 'relationship',
    label: 'Relationship',
    hint: 'A serious, exclusive connection',
  },
  {
    id: 'intentional_dating',
    label: 'Intentional dating',
    hint: 'Dating with clarity and care',
  },
  {
    id: 'still_exploring',
    label: 'Still exploring',
    hint: 'Open, curious, not rushing labels',
  },
];

export const CHILDREN_OPTIONS: {
  id: ChildrenFutureId;
  label: string;
}[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'no', label: 'No' },
  { id: 'prefer_not', label: 'Prefer not to say yet' },
];

export const PRIORITY_OPTIONS: {
  id: PriorityId;
  label: string;
}[] = [
  { id: 'trust', label: 'Trust' },
  { id: 'communication', label: 'Communication' },
  { id: 'family', label: 'Family' },
  { id: 'faith', label: 'Faith' },
  { id: 'growth', label: 'Growth' },
  { id: 'stability', label: 'Stability' },
];

export const ONBOARDING_COPY = {
  tap1: {
    heading: 'What are you open to?',
    support: 'Choose one or more. You can refine this later.',
  },
  tap2: {
    heading: 'Children in your future?',
    support: 'An early signal — not a commitment forever.',
  },
  tap3: {
    heading: 'What matters most?',
    support: 'Pick up to three. At least one is required.',
  },
} as const;
