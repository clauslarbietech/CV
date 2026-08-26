import { CoachPersonality } from '@/types';

export const COACH_PERSONALITIES: Array<{
  id: CoachPersonality;
  name: string;
  tone: string;
  example: string;
}> = [
  {
    id: 'drill_sergeant',
    name: 'Drill Sergeant',
    tone: 'Direct, intense, disciplined, military-inspired, motivating.',
    example: 'You said you wanted results. Day 1 starts now.',
  },
  {
    id: 'motivator',
    name: 'Motivator',
    tone: 'Positive, energetic, encouraging.',
    example: "Yesterday wasn't perfect. Doesn't matter. We're getting back after it today.",
  },
  {
    id: 'professional_trainer',
    name: 'Professional Trainer',
    tone: 'Analytical, technical, measured.',
    example:
      "Your training volume increased this week. Today we're prioritizing recovery and lower-body strength.",
  },
  {
    id: 'calm_coach',
    name: 'Calm Coach',
    tone: 'Supportive, low-pressure, thoughtful.',
    example: 'Listen to your body. Steady progress still counts as progress.',
  },
];

export function coachTipForDay(args: {
  personality: CoachPersonality;
  day: number;
  programName: string;
  proteinShortfallG?: number;
}): string {
  const { personality, day, programName, proteinShortfallG = 0 } = args;

  if (proteinShortfallG > 20) {
    switch (personality) {
      case 'drill_sergeant':
        return `You're ${proteinShortfallG}g short on protein. Fix the next meal. No excuses.`;
      case 'motivator':
        return `You're ${proteinShortfallG}g short of your protein target. Your next meal should prioritize protein. Want a recommendation?`;
      case 'professional_trainer':
        return `Protein remaining: ${proteinShortfallG}g. Prioritize a high-protein meal to stay aligned with recovery and lean mass goals.`;
      case 'calm_coach':
        return `You're about ${proteinShortfallG}g under protein for today. A simple protein-forward meal would help.`;
    }
  }

  switch (personality) {
    case 'drill_sergeant':
      return `Day ${day} of ${programName} is waiting. Mission first.`;
    case 'motivator':
      return `Day ${day} of ${programName} — you've got this. Start when you're ready.`;
    case 'professional_trainer':
      return `Scheduled session: Day ${day} of ${programName}. Completing it keeps you on weekly pace.`;
    case 'calm_coach':
      return `Today is Day ${day} of ${programName}. Move at a pace that feels sustainable.`;
  }
}
