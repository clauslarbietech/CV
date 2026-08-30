import AsyncStorage from '@react-native-async-storage/async-storage';

import { COACH_BETA_DISCLAIMER, LIVE_TRAINER_DISCLAIMER } from '@/constants/legal';
import { getSupabase, isSupabaseConfigured } from '@/services/supabase';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useDayLogStore } from '@/store/dayLogStore';
import { useNotesStore } from '@/store/notesStore';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useSessionStore } from '@/store/sessionStore';
import { useSquadStore } from '@/store/squadStore';
import { todayKey } from '@/utils/format';

const STORAGE_KEYS = [
  'fitlife-auth',
  'fitlife-profile',
  'fitlife-program',
  'fitlife-notes-meds',
  'fitlife-squad-chat',
  'fitlife-squad',
  'fitlife-day-log',
  'fitlife-active-session',
  'fitlife-theme',
] as const;

function defaultChatMessages() {
  const now = new Date().toISOString();
  return [
    {
      id: 'seed-coach-1',
      channel: 'coach' as const,
      from: 'coach',
      text: `Coach (beta) — scripted pep talks only. ${COACH_BETA_DISCLAIMER}`,
      createdAt: now,
    },
    {
      id: 'seed-live-1',
      channel: 'live_trainer' as const,
      from: 'system',
      text: LIVE_TRAINER_DISCLAIMER,
      createdAt: now,
    },
    {
      id: 'seed-buddy-1',
      channel: 'buddy' as const,
      from: 'system',
      text: 'Link a buddy on Squad, then chat here.',
      createdAt: now,
    },
  ];
}

function defaultNotesState() {
  return {
    meds: [
      {
        id: 'med-default-1',
        name: 'Morning Rx',
        category: 'morning' as const,
        dose: 'As prescribed',
        timeLabel: 'Morning',
        takenOn: [] as string[],
      },
      {
        id: 'med-default-2',
        name: 'Evening Rx',
        category: 'evening' as const,
        dose: 'As prescribed',
        timeLabel: 'Evening',
        takenOn: [] as string[],
      },
    ],
    workNotes: '',
    personalNotes: '',
  };
}

/** Wipes all FitLife data from this device (Apple Guideline 5.1.1). */
export async function resetAllAppData(): Promise<void> {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured) {
    await supabase.auth.signOut();
  }

  await AsyncStorage.multiRemove([...STORAGE_KEYS]);

  useAuthStore.setState({
    isAuthenticated: false,
    userId: null,
    email: null,
  });
  useProfileStore.setState({ profile: null });
  useProgramStore.setState({
    enrollment: null,
    sessions: [],
    daily: {
      date: todayKey(),
      workoutCompleted: false,
      steps: 6420,
      stepsTarget: 8000,
      proteinG: 92,
      proteinTarget: 150,
      calories: 1420,
      calorieTarget: 2000,
      waterMl: 1200,
      waterTarget: 3000,
      checkInCompleted: false,
      supplementsCompleted: false,
      medicationsLogged: false,
      energyLevel: null,
    },
    streaks: {
      workoutStreak: 0,
      activityStreak: 0,
      nutritionStreak: 0,
      longestWorkoutStreak: 0,
    },
  });
  useNotesStore.setState(defaultNotesState());
  useChatStore.setState({ messages: defaultChatMessages() });
  useSquadStore.setState({
    profile: null,
    buddies: [],
    sharedProgramId: null,
    sharedDay: 1,
  });
  useDayLogStore.setState({ entries: [] });
  useSessionStore.getState().clear();
}
