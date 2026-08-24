import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CoachPersonality } from '@/types';

export type ChatChannel = 'coach' | 'buddy';

export type ChatMessage = {
  id: string;
  channel: ChatChannel;
  /** 'me' | 'coach' | buddy callsign */
  from: string;
  text: string;
  createdAt: string;
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
  'Need a push before PT?',
  "What's one win from today?",
  'Tell me where you almost quit — then why you didn’t.',
  'Squad check: how’s energy / sleep / fuel?',
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
    lower.includes('lazy');
  const proud =
    lower.includes('done') ||
    lower.includes('finished') ||
    lower.includes('crushed') ||
    lower.includes('complete');

  switch (personality) {
    case 'drill_sergeant':
      if (tired) {
        return 'Fatigue is data, not an exit. Shorten the mission if needed — do not abandon it. Move.';
      }
      if (proud) {
        return 'Good. Log it. Hydrate. Prep tomorrow’s plate. Standards don’t sleep.';
      }
      return 'Message received. Mission still stands. Start within the hour or lock a concrete start time.';
    case 'motivator':
      if (tired) {
        return "Feeling drained is real — and you’re still here. Even a 8–10 min express keeps the streak alive. I’ve got you.";
      }
      if (proud) {
        return 'That’s the energy. Celebrate the reps, then tell your buddy — shared wins hit different.';
      }
      return "Love that you checked in. What’s the smallest next step you can take in the next 15 minutes?";
    case 'professional_trainer':
      if (tired) {
        return 'If soreness is high, prioritize recovery volume or active recovery day. Keep protein + sleep on track.';
      }
      if (proud) {
        return 'Solid execution. Note RPE and fuel timing — that data improves the next block.';
      }
      return 'Acknowledged. Align today’s session with your enrolled program day and refuel within ~2 hours post-PT.';
    case 'calm_coach':
      if (tired) {
        return 'It’s okay to feel heavy. Choose gentler intensity or recovery. Consistency over punishment.';
      }
      if (proud) {
        return 'Well done. Take a breath. Let your body absorb the work.';
      }
      return 'Thanks for sharing. What would feel supportive for the rest of your day — movement, rest, or a talk with your buddy?';
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
  return `Copy. I’m with you. Shared mission still live — see you on the check-in. — ${callsign}`;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 'seed-coach-1',
          channel: 'coach',
          from: 'coach',
          text: 'Squad channel online. Talk mission, fuel, or motivation anytime.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'seed-buddy-1',
          channel: 'buddy',
          from: 'system',
          text: 'Link a buddy on the Squad tab, then use this chat for check-ins and pep talks.',
          createdAt: new Date().toISOString(),
        },
      ],
      sendMessage: ({
        channel,
        text,
        from = 'me',
        buddyCallsign,
        coachPersonality = 'drill_sergeant',
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
        if (channel === 'buddy' && from === 'me' && buddyCallsign) {
          replies.push({
            id: `msg-${Date.now()}-buddy`,
            channel: 'buddy',
            from: buddyCallsign,
            text: buddyReply(buddyCallsign, trimmed),
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
