import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SquadBuddy = {
  id: string;
  callsign: string;
  motto?: string;
  status?: string;
  joinedAt: string;
  /** Last day they checked in on the shared mission */
  lastCheckInDay?: number;
};

export type SquadProfile = {
  callsign: string;
  motto: string;
  status: string;
  inviteCode: string;
};

interface SquadState {
  profile: SquadProfile | null;
  buddies: SquadBuddy[];
  sharedProgramId: string | null;
  sharedDay: number;
  setProfile: (args: {
    callsign: string;
    motto?: string;
    status?: string;
  }) => void;
  updateStatus: (status: string) => void;
  regenerateInviteCode: () => void;
  joinBuddy: (args: {
    callsign: string;
    inviteCode: string;
    motto?: string;
  }) => { ok: true } | { ok: false; error: string };
  removeBuddy: (id: string) => void;
  setSharedMission: (programId: string, day: number) => void;
  buddyCheckIn: (buddyId: string, day: number) => void;
  markSelfCheckIn: (day: number) => void;
}

function makeInviteCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export const useSquadStore = create<SquadState>()(
  persist(
    (set, get) => ({
      profile: null,
      buddies: [],
      sharedProgramId: null,
      sharedDay: 1,
      setProfile: ({ callsign, motto, status }) => {
        const trimmed = callsign.trim();
        if (!trimmed) return;
        const existing = get().profile;
        set({
          profile: {
            callsign: trimmed.slice(0, 24),
            motto: (motto ?? existing?.motto ?? 'No excuses. Shared mission.').slice(
              0,
              80,
            ),
            status: (status ?? existing?.status ?? 'Ready for PT').slice(0, 60),
            inviteCode: existing?.inviteCode ?? makeInviteCode(),
          },
        });
      },
      updateStatus: (status) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  status: status.trim().slice(0, 60) || state.profile.status,
                },
              }
            : state,
        ),
      regenerateInviteCode: () =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  inviteCode: makeInviteCode(),
                },
              }
            : state,
        ),
      joinBuddy: ({ callsign, inviteCode, motto }) => {
        const name = callsign.trim();
        const code = inviteCode.trim().toUpperCase();
        if (!name) return { ok: false, error: 'Enter their callsign.' };
        if (code.length < 4) {
          return { ok: false, error: 'Enter the squad invite code they shared.' };
        }
        const mine = get().profile?.inviteCode;
        if (mine && code === mine) {
          return { ok: false, error: 'That is your code — ask your buddy for theirs.' };
        }
        if (get().buddies.some((b) => b.callsign.toLowerCase() === name.toLowerCase())) {
          return { ok: false, error: 'That callsign is already in your squad.' };
        }
        set((state) => ({
          buddies: [
            ...state.buddies,
            {
              id: `buddy-${Date.now()}`,
              callsign: name.slice(0, 24),
              motto: motto?.trim().slice(0, 80),
              status: 'Linked · awaiting check-in',
              joinedAt: new Date().toISOString(),
            },
          ],
        }));
        return { ok: true };
      },
      removeBuddy: (id) =>
        set((state) => ({
          buddies: state.buddies.filter((b) => b.id !== id),
        })),
      setSharedMission: (programId, day) =>
        set({
          sharedProgramId: programId,
          sharedDay: Math.max(1, day),
        }),
      buddyCheckIn: (buddyId, day) =>
        set((state) => ({
          buddies: state.buddies.map((b) =>
            b.id === buddyId
              ? {
                  ...b,
                  lastCheckInDay: day,
                  status: `Checked in · Day ${day}`,
                }
              : b,
          ),
        })),
      markSelfCheckIn: (day) =>
        set((state) =>
          state.profile
            ? {
                sharedDay: day,
                profile: {
                  ...state.profile,
                  status: `Mission Day ${day} · locked in`,
                },
              }
            : { sharedDay: day },
        ),
    }),
    {
      name: 'fitlife-squad',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
