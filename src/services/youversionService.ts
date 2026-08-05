import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ApiClient,
  BibleClient,
  DEFAULT_LICENSE_FREE_BIBLE_VERSION,
  type BibleVersion,
} from "@youversion/platform-core";

const VERSIONS_CACHE_KEY = "yv:versions:en";
const PASSAGE_CACHE_PREFIX = "yv:passage:";
const INSTALL_ID_KEY = "yv:installation-id";

export const YOUVERSION_PLATFORM_URL = "https://platform.youversion.com/";
export const DEFAULT_YOUVERSION_VERSION_ID = DEFAULT_LICENSE_FREE_BIBLE_VERSION;

export type YouVersionPassage = {
  id: string;
  reference: string;
  content: string;
  versionId: number;
  abbreviation: string;
  copyright: string;
};

function getAppKey(): string | null {
  const key = process.env.EXPO_PUBLIC_YOUVERSION_APP_KEY?.trim();
  if (!key || key === "your_youversion_app_key_here") {
    return null;
  }
  return key;
}

export function hasYouVersionAppKey(): boolean {
  return Boolean(getAppKey());
}

async function getInstallationId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(INSTALL_ID_KEY);
    if (existing) {
      return existing;
    }
    const next =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `yvp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await AsyncStorage.setItem(INSTALL_ID_KEY, next);
    return next;
  } catch {
    return "anime-audio-bible";
  }
}

async function getBibleClient(): Promise<BibleClient> {
  const appKey = getAppKey();
  if (!appKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_YOUVERSION_APP_KEY. Add your free App Key from platform.youversion.com."
    );
  }
  const installationId = await getInstallationId();
  const apiClient = new ApiClient({ appKey, installationId });
  return new BibleClient(apiClient);
}

function passageCacheKey(versionId: number, usfm: string): string {
  return `${PASSAGE_CACHE_PREFIX}${versionId}:${usfm.trim().toUpperCase()}`;
}

/**
 * Lists English Bible versions available to this App Key
 * (license acceptances on the Platform portal control what's returned).
 */
export async function listEnglishBibleVersions(): Promise<BibleVersion[]> {
  const cached = await AsyncStorage.getItem(VERSIONS_CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as BibleVersion[];
    } catch {
      // refresh below
    }
  }

  const client = await getBibleClient();
  const collection = await client.getVersions("en*");
  const versions = collection.data ?? [];
  try {
    await AsyncStorage.setItem(VERSIONS_CACHE_KEY, JSON.stringify(versions));
  } catch {
    // ignore cache write failures
  }
  return versions;
}

export async function getBibleVersion(
  versionId: number
): Promise<BibleVersion | null> {
  try {
    const client = await getBibleClient();
    return await client.getVersion(versionId);
  } catch {
    const versions = await listEnglishBibleVersions().catch(() => []);
    return versions.find((item) => item.id === versionId) ?? null;
  }
}

/**
 * Fetch a chapter/passage in plain text for our custom reader UI.
 * `usfm` examples: `GEN.1`, `JHN.3.16`, `JHN.3.1-5`.
 */
export async function fetchYouVersionPassage(
  versionId: number,
  usfm: string
): Promise<YouVersionPassage> {
  const ref = usfm.trim().toUpperCase();
  if (!ref) {
    throw new Error("USFM reference is required.");
  }

  const cacheKey = passageCacheKey(versionId, ref);
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as YouVersionPassage;
    }
  } catch {
    // continue to network
  }

  const client = await getBibleClient();
  const [passage, version] = await Promise.all([
    client.getPassage(versionId, ref, "text", true, false),
    client.getVersion(versionId).catch(() => null),
  ]);

  const result: YouVersionPassage = {
    id: passage.id,
    reference: passage.reference || ref,
    content: stripMarkup(passage.content),
    versionId,
    abbreviation:
      version?.localized_abbreviation || version?.abbreviation || String(versionId),
    copyright:
      version?.copyright?.trim() ||
      `${version?.title ?? "Bible text"} via YouVersion Platform.`,
  };

  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    // ignore
  }

  return result;
}

/** Plain-text cleanup if the API still returns light markup. */
function stripMarkup(input: string): string {
  return input
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
