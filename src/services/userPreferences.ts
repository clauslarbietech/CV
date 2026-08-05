import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFS_KEY = "user:preferences:v1";
const PROFILE_KEY = "user:profile:v1";

export type UserPreferences = {
  nightMode: boolean;
  largerText: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
};

const DEFAULT_PREFS: UserPreferences = {
  nightMode: true,
  largerText: false,
  reduceMotion: false,
  highContrast: false,
};

const DEFAULT_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
};

export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (!raw) {
      return { ...DEFAULT_PREFS };
    }
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as UserPreferences) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export async function savePreferences(
  patch: Partial<UserPreferences>
): Promise<UserPreferences> {
  const current = await loadPreferences();
  const next = { ...current, ...patch };
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
  return next;
}

export async function loadProfile(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) {
      return { ...DEFAULT_PROFILE };
    }
    return { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as UserProfile) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export async function saveProfile(
  patch: Partial<UserProfile>
): Promise<UserProfile> {
  const current = await loadProfile();
  const next = { ...current, ...patch };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}
