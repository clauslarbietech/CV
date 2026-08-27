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
  /** Optional phone for SMS accountability (local only). */
  phone?: string;
};

export type SquadProfile = {
  callsign: string;
  motto: string;
  status: string;
  inviteCode: string;
  /** Friend name for text check-ins */
  accountabilityName?: string;
  /** E.164-ish phone for sms: deep link */
  accountabilityPhone?: string;
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
  setAccountabilityContact: (args: {
    name: string;
    phone: string;
  }) => void;
  clearAccountabilityContact: () => void;
  updateStatus: (status: string) => void;
  regenerateInviteCode: () => void;
  joinBuddy: (args: {
    callsign: string;
    inviteCode: string;
    motto?: string;
    phone?: string;
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
            accountabilityName: existing?.accountabilityName,
            accountabilityPhone: existing?.accountabilityPhone,
          },
        });
      },
      setAccountabilityContact: ({ name, phone }) => {
        const cleanName = name.trim().slice(0, 40);
        const cleanPhone = phone.replace(/[^\d+]/g, '').slice(0, 20);
        if (!cleanName || cleanPhone.length < 7) return;
        set((state) => {
          const base = state.profile ?? {
            callsign: cleanName.slice(0, 24) || 'Athlete',
            motto: 'Keep me honest.',
            status: 'Training',
            inviteCode: makeInviteCode(),
          };
          return {
            profile: {
              ...base,
              accountabilityName: cleanName,
              accountabilityPhone: cleanPhone,
            },
          };
        });
      },
      clearAccountabilityContact: () =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  accountabilityName: undefined,
                  accountabilityPhone: undefined,
                },
              }
            : state,
        ),
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
      joinBuddy: ({ callsign, inviteCode, motto, phone }) => {
        const name = callsign.trim();
        const code = inviteCode.trim().toUpperCase();
        if (!name) return { ok: false, error: 'Enter their nickname.' };
        if (code.length < 4) {
          return { ok: false, error: 'Enter the squad invite code they shared.' };
        }
        const mine = get().profile?.inviteCode;
        if (mine && code === mine) {
          return { ok: false, error: 'That is your code — ask your buddy for theirs.' };
        }
        if (get().buddies.some((b) => b.callsign.toLowerCase() === name.toLowerCase())) {
          return { ok: false, error: 'That nickname is already linked.' };
        }
        const cleanPhone = phone?.replace(/[^\d+]/g, '').slice(0, 20);
        set((state) => ({
          buddies: [
            ...state.buddies,
            {
              id: `buddy-${Date.now()}`,
              callsign: name.slice(0, 24),
              motto: motto?.trim().slice(0, 80),
              status: 'Linked · awaiting check-in',
              joinedAt: new Date().toISOString(),
              phone: cleanPhone && cleanPhone.length >= 7 ? cleanPhone : undefined,
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
