export type IntentionId =
  | 'life_partner'
  | 'relationship'
  | 'intentional_dating'
  | 'still_exploring';

export type ChildrenFutureId = 'yes' | 'maybe' | 'no' | 'prefer_not';

export type PriorityId =
  | 'trust'
  | 'communication'
  | 'family'
  | 'faith'
  | 'growth'
  | 'stability';

export type AlignmentBand =
  | 'Promising fit'
  | 'Strong potential'
  | 'Clear alignment';

export type DnaPillarId =
  | 'intentions'
  | 'connection'
  | 'emotional'
  | 'life_vision'
  | 'values';

export type OnboardingAnswers = {
  intentions: IntentionId[];
  childrenFuture: ChildrenFutureId | null;
  priorities: PriorityId[];
};

export type ProvisionalDna = {
  label: string;
  clarity: number;
  clarityLabel: 'Forming' | 'Taking shape' | 'Clearer' | 'Well defined';
  insight: string;
  pillars: { id: DnaPillarId; label: string; note: string }[];
};

export type DiscoverProfile = {
  id: string;
  name: string;
  age: number;
  verified: boolean;
  alignmentBand: AlignmentBand;
  values: string[];
  bio: string;
  photoGradient: [string, string];
  why: {
    shared: string[];
    difference: string;
    middle: string;
    spark: string;
  };
};

export type GuestProgress = {
  onboardingStep: number;
  answers: OnboardingAnswers;
  dnaSaved: boolean;
  profileStarted: boolean;
  accountCreated: boolean;
};
