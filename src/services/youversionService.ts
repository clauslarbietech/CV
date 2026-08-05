import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ApiClient,
  BibleClient,
  DEFAULT_LICENSE_FREE_BIBLE_VERSION,
  type BibleVersion,
} from "@youversion/platform-core";
import {
  CATALOG_BOOKS,
  ILLUSTRATED_USFM,
  type CatalogBook,
} from "../data/bibleCatalog";

const VERSIONS_CACHE_KEY = "yv:versions:en:v2";
const VERSIONS_CACHE_AT_KEY = "yv:versions:en:v2:at";
const BOOKS_CACHE_PREFIX = "yv:books:";
const PASSAGE_CACHE_PREFIX = "yv:passage:";
const INSTALL_ID_KEY = "yv:installation-id";
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export const YOUVERSION_PLATFORM_URL = "https://platform.youversion.com/";
export const DEFAULT_YOUVERSION_VERSION_ID = DEFAULT_LICENSE_FREE_BIBLE_VERSION;

/** Common English version IDs from YouVersion quick reference. */
export const POPULAR_YOUVERSION_IDS = {
  ASV: 12,
  NIV: 111,
  WEBUS: 206,
  BSB: 3034,
} as const;

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
    return "pix-bible";
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

async function readVersionsCache(): Promise<BibleVersion[] | null> {
  try {
    const [raw, atRaw] = await Promise.all([
      AsyncStorage.getItem(VERSIONS_CACHE_KEY),
      AsyncStorage.getItem(VERSIONS_CACHE_AT_KEY),
    ]);
    if (!raw || !atRaw) {
      return null;
    }
    const age = Date.now() - Number(atRaw);
    if (!Number.isFinite(age) || age > CACHE_TTL_MS) {
      return null;
    }
    return JSON.parse(raw) as BibleVersion[];
  } catch {
    return null;
  }
}

async function writeVersionsCache(versions: BibleVersion[]): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      [VERSIONS_CACHE_KEY, JSON.stringify(versions)],
      [VERSIONS_CACHE_AT_KEY, String(Date.now())],
    ]);
  } catch {
    // ignore
  }
}

/**
 * Lists English Bible versions available to this App Key.
 * License acceptances on the Platform portal control whether NIV etc. appear.
 */
export async function listEnglishBibleVersions(options?: {
  forceRefresh?: boolean;
}): Promise<BibleVersion[]> {
  if (!options?.forceRefresh) {
    const cached = await readVersionsCache();
    if (cached?.length) {
      return cached;
    }
  }

  const client = await getBibleClient();
  const versions: BibleVersion[] = [];
  let pageToken: string | undefined;

  // YouVersion rejects large page_size values (e.g. 100 → 400). Keep pages small.
  do {
    const collection = await client.getVersions("en*", undefined, {
      page_size: 20,
      page_token: pageToken,
      all_available: true,
    });
    versions.push(...(collection.data ?? []));
    pageToken = collection.next_page_token || undefined;
  } while (pageToken);

  // De-dupe by id and sort alphabetically for the picker.
  const byId = new Map<number, BibleVersion>();
  for (const version of versions) {
    byId.set(version.id, version);
  }
  const unique = [...byId.values()].sort((a, b) =>
    (a.localized_title || a.title).localeCompare(b.localized_title || b.title)
  );

  await writeVersionsCache(unique);
  return unique;
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
 * Full book + chapter catalog for a Bible version (66+ books from the API).
 * Falls back to the static catalog when the App Key is missing.
 */
export async function fetchBibleBooksForVersion(
  versionId: number
): Promise<CatalogBook[]> {
  if (!hasYouVersionAppKey()) {
    return CATALOG_BOOKS;
  }

  const cacheKey = `${BOOKS_CACHE_PREFIX}${versionId}`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as CatalogBook[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // refresh below
  }

  const client = await getBibleClient();
  const collection = await client.getBooks(versionId);
  const books: CatalogBook[] = (collection.data ?? []).map((book) => {
    const usfm = String(book.id).toUpperCase();
    const testament =
      book.canon === "new_testament"
        ? "NT"
        : book.canon === "deuterocanon"
          ? "DC"
          : "OT";
    return {
      id: usfm,
      name: book.title || book.full_title || usfm,
      abbreviation: book.abbreviation || usfm.slice(0, 3),
      usfm,
      testament,
      chapters: Math.max(1, book.chapters?.length ?? 1),
      illustrated: ILLUSTRATED_USFM.has(usfm),
    };
  });

  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(books));
  } catch {
    // ignore
  }

  return books.length ? books : CATALOG_BOOKS;
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
    content: formatReaderText(stripMarkup(passage.content)),
    versionId,
    abbreviation:
      version?.localized_abbreviation ||
      version?.abbreviation ||
      String(versionId),
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

/**
 * Light formatting so dense chapter text is easier to scan:
 * put each verse number on a clearer line break when present.
 */
function formatReaderText(input: string): string {
  return input
    .replace(/\s*\[(\d+)\]\s*/g, "\n\n$1 ")
    .replace(/\s+(\d+)\s+(?=[A-Z“"])/g, "\n\n$1 ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
