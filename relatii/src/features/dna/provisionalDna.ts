import type {
  AlignmentBand,
  DiscoverProfile,
  OnboardingAnswers,
  ProvisionalDna,
} from '@/types';

const DNA_LABELS: Record<string, string> = {
  life_partner_trust: 'The Intentional Builder',
  life_partner_family: 'The Legacy Keeper',
  relationship_communication: 'The Clear Connector',
  intentional_dating_growth: 'The Curious Pathfinder',
  still_exploring_growth: 'The Open Explorer',
  default: 'The Thoughtful Matcher',
};

function clarityLabel(clarity: number): ProvisionalDna['clarityLabel'] {
  if (clarity >= 80) return 'Well defined';
  if (clarity >= 60) return 'Clearer';
  if (clarity >= 30) return 'Taking shape';
  return 'Forming';
}

export function buildProvisionalDna(
  answers: OnboardingAnswers,
): ProvisionalDna {
  const primaryIntention = answers.intentions[0] ?? 'still_exploring';
  const primaryPriority = answers.priorities[0] ?? 'trust';
  const key = `${primaryIntention}_${primaryPriority}`;
  const label = DNA_LABELS[key] ?? DNA_LABELS.default;

  // Early read after 3 taps — intentionally ~20% clarity (brief §5.1)
  const clarity = 18 + Math.min(8, answers.intentions.length * 2 + answers.priorities.length);

  const intentionNote =
    primaryIntention === 'life_partner'
      ? 'You signaled openness to a lasting partnership.'
      : primaryIntention === 'relationship'
        ? 'You’re oriented toward a serious relationship.'
        : primaryIntention === 'intentional_dating'
          ? 'You want dating that feels purposeful.'
          : 'You’re exploring with intention, not pressure.';

  const childrenNote =
    answers.childrenFuture === 'yes'
      ? 'Children are part of the future you imagine.'
      : answers.childrenFuture === 'maybe'
        ? 'You’re open but not locked on children yet.'
        : answers.childrenFuture === 'no'
          ? 'A future without children feels right for now.'
          : 'You’re keeping the children conversation private for now.';

  const priorityList = answers.priorities.length
    ? answers.priorities.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')
    : 'Trust';

  return {
    label,
    clarity,
    clarityLabel: clarityLabel(clarity),
    insight: `Early read: ${intentionNote} Core priorities emerging: ${priorityList}. This is a starting sketch — you can correct anything.`,
    pillars: [
      {
        id: 'intentions',
        label: 'Intentions',
        note: intentionNote,
      },
      {
        id: 'life_vision',
        label: 'Life vision',
        note: childrenNote,
      },
      {
        id: 'values',
        label: 'Values',
        note: `You highlighted ${priorityList.toLowerCase()} as early anchors.`,
      },
    ],
  };
}

export const DEMO_PROFILES: DiscoverProfile[] = [
  {
    id: 'maya',
    name: 'Maya',
    age: 31,
    verified: true,
    alignmentBand: 'Strong potential',
    values: ['Trust', 'Growth', 'Family'],
    bio: 'Design lead who cooks on Sundays and plans trips months ahead — then leaves room for spontaneity.',
    photoGradient: ['#5B3A6E', '#F13C78'],
    why: {
      shared: [
        'Both want a committed future',
        'Family matters in the long view',
        'Consistent communication is valued',
      ],
      difference:
        'One of you tends to process conflict privately while the other seeks reassurance sooner.',
      middle:
        'Agree on a short cooling-off period plus a clear time to resume the conversation.',
      spark:
        'After a disagreement, what helps you feel connected without feeling pressured?',
    },
  },
  {
    id: 'jordan',
    name: 'Jordan',
    age: 34,
    verified: true,
    alignmentBand: 'Promising fit',
    values: ['Communication', 'Stability', 'Growth'],
    bio: 'Product thinker, weekend hiker, and someone who texts when they say they will.',
    photoGradient: ['#1F3A4A', '#8D6BFF'],
    why: {
      shared: [
        'Intentional dating over endless swiping',
        'Growth as a shared priority',
        'Stability shows up in daily rhythm',
      ],
      difference:
        'One prefers frequent check-ins; the other prefers deeper, fewer touchpoints.',
      middle:
        'Set a weekly rhythm for longer talks, plus light midweek check-ins.',
      spark: 'What does a good week of staying close look like for you?',
    },
  },
  {
    id: 'sam',
    name: 'Sam',
    age: 29,
    verified: false,
    alignmentBand: 'Clear alignment',
    values: ['Faith', 'Trust', 'Family'],
    bio: 'Community volunteer who believes humor and honesty can coexist in hard conversations.',
    photoGradient: ['#3A2A18', '#FF5F6D'],
    why: {
      shared: [
        'Trust is non-negotiable',
        'Family involvement feels important',
        'Shared beliefs matter in partnership',
      ],
      difference:
        'One leans toward planning; the other likes more last-minute energy.',
      middle:
        'Keep a shared calendar for big plans, leave one weekend open each month.',
      spark: 'When has planning helped your relationship — and when has it gotten in the way?',
    },
  },
  {
    id: 'riley',
    name: 'Riley',
    age: 32,
    verified: true,
    alignmentBand: 'Strong potential',
    values: ['Communication', 'Growth', 'Trust'],
    bio: 'Therapist-adjacent reader (not a therapist), café regular, and early-morning runner.',
    photoGradient: ['#24304A', '#78D6B0'],
    why: {
      shared: [
        'Communication is a top priority',
        'Both value personal growth',
        'Trust builds through follow-through',
      ],
      difference:
        'One recharges with quiet evenings; the other prefers social weekends.',
      middle:
        'Alternate social and quiet weekends, and name the need early.',
      spark: 'How do you like to recharge after a full week?',
    },
  },
];

export function bandColor(band: AlignmentBand): string {
  switch (band) {
    case 'Clear alignment':
      return '#78D6B0';
    case 'Strong potential':
      return '#8D6BFF';
    default:
      return '#F5C26B';
  }
}
