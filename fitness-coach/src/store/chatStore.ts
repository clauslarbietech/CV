import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CoachPersonality } from '@/types';
import { COACH_BETA_DISCLAIMER, LIVE_TRAINER_DISCLAIMER } from '@/constants/legal';

/** AI Coach = in-app motivational coach. Live Trainer = human trainer inbox. */
export type ChatChannel = 'coach' | 'live_trainer' | 'buddy';

export type ChatMessage = {
  id: string;
  channel: ChatChannel;
  /** 'me' | 'coach' | 'live_trainer' | 'system' | buddy nickname */
  from: string;
  text: string;
  createdAt: string;
  /** Shown under Live Trainer sends */
  deliveryNote?: string;
};

interface ChatState {
  messages: ChatMessage[];
  sendMessage: (args: {
    channel: ChatChannel;
    text: string;
    from?: string;
    buddyCallsign?: string;
    coachPersonality?: CoachPersonality;
  }) => void;
  clearChannel: (channel: ChatChannel) => void;
}

const MOTIVATION_PROMPTS = [
  'Need a motivational push before my workout?',
  "What's one win I should lock in today?",
  'I feel like quitting — talk me through it.',
  'Quick check: energy, sleep, and meals?',
];

const LIVE_TRAINER_PROMPTS = [
  'Can we adjust today’s workout?',
  'I’m sore — what should I change?',
  'Form check: how should I do squats?',
  'Help me plan this week’s sessions.',
];

function coachReply(
  personality: CoachPersonality,
  userText: string,
): string {
  const lower = userText.toLowerCase();
  const tired =
    lower.includes('tired') ||
    lower.includes('sore') ||
    lower.includes('skip') ||
    lower.includes('quit') ||
    lower.includes('lazy');
  const proud =
    lower.includes('done') ||
    lower.includes('finished') ||
    lower.includes('crushed') ||
    lower.includes('complete') ||
    lower.includes('win');
  const motivate =
    lower.includes('push') ||
    lower.includes('motivat') ||
    lower.includes('pep');

  switch (personality) {
    case 'drill_sergeant':
      if (tired) {
        return 'Fatigue is data, not an exit. Shorten the workout if needed — don’t skip it. Lace up and start the first move.';
      }
      if (proud) {
        return 'Good. Log it. Hydrate. Prep tomorrow’s plate. Standards don’t sleep.';
      }
      if (motivate) {
        return 'Listen up: the only way out is through. Open today’s workout and earn the checkmark.';
      }
      return 'Got it. Your workout still counts. Start within the hour — or lock a concrete start time now.';
    case 'motivator':
      if (tired) {
        return "Feeling drained is real — and you’re still here. Even an 8–10 min express keeps the streak alive. I’ve got you.";
      }
      if (proud) {
        return 'That’s the energy. Celebrate the reps, then tell your buddy or Live Trainer — shared wins hit different.';
      }
      if (motivate) {
        return 'Here’s your speech: you already chose the hard path by opening this app. Take one round. Momentum does the rest.';
      }
      return "Love that you checked in. What’s the smallest next step you can take in the next 15 minutes?";
    case 'professional_trainer':
      if (tired) {
        return 'If soreness is high, drop to Easy intensity or an express route. Keep protein and sleep on track.';
      }
      if (proud) {
        return 'Solid execution. Note how hard it felt and fuel within ~2 hours — that data improves the next block.';
      }
      if (motivate) {
        return 'Motivational brief: consistency compounds. Hit today’s programmed day, then message your Live Trainer if form or load needs eyes.';
      }
      return 'Acknowledged. Align today’s session with your enrolled program day and refuel after training.';
    case 'calm_coach':
      if (tired) {
        return 'It’s okay to feel heavy. Choose gentler intensity or recovery. Consistency over punishment.';
      }
      if (proud) {
        return 'Well done. Take a breath. Let your body absorb the work.';
      }
      if (motivate) {
        return 'Soft pep talk: you don’t need perfect energy — just one honest session. Start when you’re ready; I’ll stay in your corner.';
      }
      return 'Thanks for sharing. What would feel supportive next — movement, rest, or a note to your Live Trainer?';
  }
}

function buddyReply(callsign: string, userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes('motivate') || lower.includes('push')) {
    return `${callsign} here — we started this together. Lace up. I’ll match your check-in today.`;
  }
  if (lower.includes('tired') || lower.includes('hard')) {
    return `Same boat sometimes. Split it: warm-up + one hard round. Text me when you’re done. — ${callsign}`;
  }
  if (lower.includes('done') || lower.includes('finished')) {
    return `That’s what I’m talking about. Proud of you. My turn next. — ${callsign}`;
  }
  return `I’m with you. Shared workout still on — see you on the check-in. — ${callsign}`;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 'seed-coach-1',
          channel: 'coach',
          from: 'coach',
          text: `Coach (beta) — scripted pep talks only. ${COACH_BETA_DISCLAIMER}`,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'seed-live-1',
          channel: 'live_trainer',
          from: 'system',
          text: LIVE_TRAINER_DISCLAIMER,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'seed-buddy-1',
          channel: 'buddy',
          from: 'system',
          text: 'Link a buddy on Squad, then chat here.',
          createdAt: new Date().toISOString(),
        },
      ],
      sendMessage: ({
        channel,
        text,
        from = 'me',
        buddyCallsign,
        coachPersonality = 'calm_coach',
      }) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const now = new Date().toISOString();
        const mine: ChatMessage = {
          id: `msg-${Date.now()}`,
          channel,
          from,
          text: trimmed,
          createdAt: now,
          deliveryNote:
            channel === 'live_trainer' && from === 'me'
              ? 'Saved locally · no trainer connected in v1.0'
              : undefined,
        };
        const replies: ChatMessage[] = [];
        if (channel === 'coach' && from === 'me') {
          replies.push({
            id: `msg-${Date.now()}-coach`,
            channel: 'coach',
            from: 'coach',
            text: coachReply(coachPersonality, trimmed),
            createdAt: new Date(Date.now() + 1).toISOString(),
          });
        }
        if (channel === 'buddy' && from === 'me' && buddyCallsign) {
          replies.push({
            id: `msg-${Date.now()}-buddy`,
            channel: 'buddy',
            from: buddyCallsign,
            text: buddyReply(buddyCallsign, trimmed),
            createdAt: new Date(Date.now() + 1).toISOString(),
          });
        }
        // live_trainer: no auto AI reply — human inbox only
        set({ messages: [...get().messages, mine, ...replies].slice(-200) });
      },
      clearChannel: (channel) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.channel !== channel),
        })),
    }),
    {
      name: 'fitlife-squad-chat',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export { MOTIVATION_PROMPTS, LIVE_TRAINER_PROMPTS };
