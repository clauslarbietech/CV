import { ImageSourcePropType } from 'react-native';

import { ExperienceLevel, FitnessGoal, Sex } from '@/types';

export type IntroBodySex = Extract<Sex, 'male' | 'female'>;

export const INTRO_BODY_IMAGES: Record<IntroBodySex, ImageSourcePropType> = {
  male: require('../../assets/intro/body-male.png'),
  female: require('../../assets/intro/body-female.png'),
};

export const INTRO_LOGO = require('../../assets/intro/fitlife-logo.png');

export const INTRO_GOALS: Array<{ id: FitnessGoal; label: string; hint: string }> = [
  { id: 'lose_fat', label: 'Lose fat', hint: 'Lean out and feel lighter' },
  { id: 'general_fitness', label: 'Feel healthier', hint: 'Energy, strength, consistency' },
  { id: 'build_muscle', label: 'Get stronger', hint: 'Build muscle with bodyweight' },
  { id: 'endurance', label: 'Build stamina', hint: 'Last longer in every session' },
];

export const INTRO_EXPERIENCE: Array<{
  id: ExperienceLevel;
  label: string;
  hint: string;
}> = [
  {
    id: 'beginner',
    label: 'New to working out',
    hint: 'We keep it simple and guided',
  },
  {
    id: 'intermediate',
    label: 'Some experience',
    hint: 'Ready for a solid everyday pace',
  },
  {
    id: 'advanced',
    label: 'Train regularly',
    hint: 'Push density and intensity',
  },
];

export const INTRO_TIME: Array<{ minutes: number; label: string; hint: string }> = [
  { minutes: 10, label: 'About 10 minutes', hint: 'Express workouts when life is busy' },
  { minutes: 20, label: '15–20 minutes', hint: 'Short, focused training blocks' },
  { minutes: 30, label: '25–35 minutes', hint: 'Full Iron workout days' },
];

export type SkipSessionOption = {
  id: string;
  title: string;
  subtitle: string;
  programId: string;
  day: number;
  express?: 8 | 10 | 15;
};

export const SKIP_SESSIONS: SkipSessionOption[] = [
  {
    id: 'iron30-day1',
    title: 'IRON 30 · Day 1',
    subtitle: 'Full Day 1 workout · ~20–30 min',
    programId: 'operation-iron-30',
    day: 1,
  },
  {
    id: 'iron30-express-10',
    title: '10-Minute Express',
    subtitle: 'Short on time · Day 1 converted',
    programId: 'operation-iron-30',
    day: 1,
    express: 10,
  },
  {
    id: 'iron30-express-8',
    title: '8-Minute Tabata Blast',
    subtitle: 'Fastest option · keep the streak',
    programId: 'operation-iron-30',
    day: 1,
    express: 8,
  },
  {
    id: 'iron14-day1',
    title: 'IRON 14 · Day 1',
    subtitle: '2-week bodyweight kickstart',
    programId: 'operation-iron-14',
    day: 1,
  },
  {
    id: 'calisthenics-day1',
    title: 'CALISTHENICS FOUNDATION · Day 1',
    subtitle: '21-day progressive bodyweight block',
    programId: 'operation-calisthenics',
    day: 1,
  },
];
