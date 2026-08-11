import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "pix:device-id:v1";

/** Stable anonymous id for this install (invite tracking, message authorship). */
export async function getDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existing) {
      return existing;
    }
    const next =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `pix-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await AsyncStorage.setItem(DEVICE_ID_KEY, next);
    return next;
  } catch {
    return "pix-local";
  }
}
