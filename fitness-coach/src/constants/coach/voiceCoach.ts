import { CoachPersonality } from '@/types';
import { EnergyLevel } from '@/constants/programs/energyRoutes';
import { COACH_PERSONALITIES } from '@/constants/coach/index';

export function personalityLabel(id: CoachPersonality): string {
  return COACH_PERSONALITIES.find((p) => p.id === id)?.name ?? 'Coach';
}

/** Live motivational line tailored to coach persona + context. */
export function generateMotivationalLine(args: {
  personality: CoachPersonality;
  firstName?: string;
  programName: string;
  day: number;
  energy?: EnergyLevel | null;
  workoutDone?: boolean;
}): string {
  const name = args.firstName?.trim() || 'Athlete';
  const energyBit =
    args.energy === 1
      ? 'low energy'
      : args.energy === 2
        ? 'limited fuel'
        : args.energy === 5
          ? 'peak output'
          : args.energy
            ? 'steady energy'
            : 'today’s conditions';

  switch (args.personality) {
    case 'drill_sergeant':
      if (args.workoutDone) {
        return `${name}. Day ${args.day} of ${args.programName} — logged. That’s discipline. Hydrate, then prep tomorrow’s kit.`;
      }
      return `${name}. ${energyBit} is not an excuse. Start the assigned route for Day ${args.day} of ${args.programName}. Move.`;
    case 'motivator':
      if (args.workoutDone) {
        return `Yes, ${name}! Day ${args.day} is in the books. That streak energy is contagious — celebrate it, then rest smart.`;
      }
      return `${name}, ${energyBit} just means we pick the right gear. Day ${args.day} of ${args.programName} is still a win waiting to happen. Let’s go.`;
    case 'professional_trainer':
      if (args.workoutDone) {
        return `Session complete, ${name}. Day ${args.day}/${args.programName} executed. Prioritize protein and sleep to consolidate adaptation.`;
      }
      return `${name}: given ${energyBit}, follow the energy-matched route for Day ${args.day} of ${args.programName}. Consistency beats heroics.`;
    case 'calm_coach':
      if (args.workoutDone) {
        return `Nice work, ${name}. Day ${args.day} is done. Soften the shoulders, breathe, and let recovery do its job.`;
      }
      return `${name}, notice ${energyBit} without judgment. We’ll take the route that fits — Day ${args.day} of ${args.programName}, one rep at a time.`;
  }
}

export function speakCoachLine(text: string): { ok: boolean; reason?: string } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { ok: false, reason: 'Voice playback needs a browser with speech support.' };
  }
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
    return { ok: true };
  } catch {
    return { ok: false, reason: 'Could not start voice playback.' };
  }
}

export function stopCoachSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
