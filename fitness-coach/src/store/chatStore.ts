import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CoachPersonality } from '@/types';
import { COACH_BETA_DISCLAIMER } from '@/constants/legal';

/** Scripted motivational tips only — not live AI or a human trainer. */
export type ChatChannel = 'coach';

export type ChatMessage = {
  id: string;
  channel: ChatChannel;
  /** 'me' | 'coach' | 'system' */
  from: string;
  text: string;
  createdAt: string;
  /** Shown under day log sends */
  deliveryNote?: string;
};

interface ChatState {
  messages: ChatMessage[];
  sendMessage: (args: {
    channel: ChatChannel;
    text: string;
    from?: string;
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
        return 'That’s the energy. Celebrate the reps, then tell your buddy — shared wins hit different.';
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
        return 'Motivational brief: consistency compounds. Hit today’s programmed day, then keep form notes in your day log.';
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
      return 'Thanks for sharing. What would feel supportive next — movement or rest?';
  }
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 'seed-coach-1',
          channel: 'coach',
          from: 'coach',
          text: `Coach (tips) — scripted motivational tips only. ${COACH_BETA_DISCLAIMER}`,
          createdAt: new Date().toISOString(),
        },
      ],
      sendMessage: ({
        channel,
        text,
        from = 'me',
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

export { MOTIVATION_PROMPTS };
