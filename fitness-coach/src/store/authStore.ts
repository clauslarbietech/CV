import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getSupabase, isSupabaseConfigured } from '@/services/supabase';

interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  userId: string | null;
  email: string | null;
  setHydrated: (value: boolean) => void;
  signInLocal: (email: string, password: string) => Promise<void>;
  signUpLocal: (email: string, password: string, firstName: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: (firstName?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isHydrated: false,
      userId: null,
      email: null,
      setHydrated: (value) => set({ isHydrated: value }),
      signInLocal: async (email, password) => {
        if (!email.trim() || password.length < 6) {
          throw new Error('Enter a valid email and password (6+ characters).');
        }

        const supabase = getSupabase();
        if (supabase && isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (error) throw error;
          set({
            isAuthenticated: true,
            userId: data.user?.id ?? null,
            email: data.user?.email ?? email.trim(),
          });
          return;
        }

        // Local demo auth when Supabase env is not configured.
        set({
          isAuthenticated: true,
          userId: `local-${email.trim().toLowerCase()}`,
          email: email.trim(),
        });
      },
      signUpLocal: async (email, password, firstName) => {
        if (!firstName.trim()) throw new Error('First name is required.');
        if (!email.trim() || password.length < 6) {
          throw new Error('Enter a valid email and password (6+ characters).');
        }

        const supabase = getSupabase();
        if (supabase && isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { first_name: firstName.trim() } },
          });
          if (error) throw error;
          set({
            isAuthenticated: true,
            userId: data.user?.id ?? null,
            email: data.user?.email ?? email.trim(),
          });
          return;
        }

        set({
          isAuthenticated: true,
          userId: `local-${email.trim().toLowerCase()}`,
          email: email.trim(),
        });
      },
      signOut: async () => {
        const supabase = getSupabase();
        if (supabase && isSupabaseConfigured) {
          await supabase.auth.signOut();
        }
        set({ isAuthenticated: false, userId: null, email: null });
      },
      continueAsGuest: (firstName = 'Athlete') => {
        set({
          isAuthenticated: true,
          userId: `guest-${Date.now()}`,
          email: `${firstName.toLowerCase()}@guest.fitlife`,
        });
      },
    }),
    {
      name: 'fitlife-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        email: state.email,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
