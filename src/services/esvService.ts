import AsyncStorage from "@react-native-async-storage/async-storage";

/** Mandatory Crossway ESV copyright notice for every reading screen. */
export const ESV_COPYRIGHT_NOTICE =
  "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. www.esv.org";

export const ESV_WEBSITE_URL = "https://www.esv.org";

const ESV_API_BASE = "https://api.esv.org/v3/passage/text/";
const CACHE_PREFIX = "esv:passage:";

export type EsvPassage = {
  query: string;
  canonical: string;
  passages: string[];
  parsed: number[][];
};

type EsvApiResponse = {
  query: string;
  canonical: string;
  passages: string[];
  parsed: number[][];
};

function cacheKey(passage: string): string {
  return `${CACHE_PREFIX}${passage.trim().toLowerCase()}`;
}

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_ESV_API_KEY;
  if (!key || key === "your_crossway_esv_api_key_here") {
    throw new Error(
      "Missing EXPO_PUBLIC_ESV_API_KEY. Copy .env.example to .env and add your Crossway ESV API key."
    );
  }
  return key;
}

/** True when a real Crossway ESV key is configured (optional alternate source). */
export function hasEsvApiKey(): boolean {
  const key = process.env.EXPO_PUBLIC_ESV_API_KEY?.trim();
  return Boolean(key && key !== "your_crossway_esv_api_key_here");
}

async function readCache(passage: string): Promise<EsvPassage | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(passage));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as EsvPassage;
  } catch {
    return null;
  }
}

async function writeCache(passage: string, data: EsvPassage): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey(passage), JSON.stringify(data));
  } catch {
    // Cache write failures should not block reading.
  }
}

/**
 * Fetches an ESV passage, checking AsyncStorage first to conserve API quota
 * and support offline re-reads. Never bundle a full offline Bible.
 */
export async function fetchPassage(passage: string): Promise<EsvPassage> {
  const query = passage.trim();
  if (!query) {
    throw new Error("Passage query is required.");
  }

  const cached = await readCache(query);
  if (cached) {
    return cached;
  }

  const params = new URLSearchParams({
    q: query,
    "include-passage-references": "false",
    "include-verse-numbers": "true",
    "include-first-verse-numbers": "true",
    "include-footnotes": "false",
    "include-headings": "true",
    "include-short-copyright": "false",
    "include-copyright": "false",
  });

  const response = await fetch(`${ESV_API_BASE}?${params.toString()}`, {
    headers: {
      Authorization: `Token ${getApiKey()}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `ESV API request failed (${response.status}): ${body || response.statusText}`
    );
  }

  const data = (await response.json()) as EsvApiResponse;
  const result: EsvPassage = {
    query: data.query,
    canonical: data.canonical,
    passages: data.passages,
    parsed: data.parsed,
  };

  await writeCache(query, result);
  return result;
}

/** Clears a single cached passage (useful after API key or query format changes). */
export async function clearPassageCache(passage: string): Promise<void> {
  await AsyncStorage.removeItem(cacheKey(passage));
}
