import {
  ESV_COPYRIGHT_NOTICE,
  ESV_WEBSITE_URL,
  fetchPassage as fetchEsvPassage,
  hasEsvApiKey,
} from "./esvService";
import {
  DEFAULT_YOUVERSION_VERSION_ID,
  YOUVERSION_PLATFORM_URL,
  fetchYouVersionPassage,
  hasYouVersionAppKey,
} from "./youversionService";
import { usfmChapterRef } from "../data/bibleCatalog";
import type { BibleSource } from "../types/bibleSource";

export type ScriptureResult = {
  reference: string;
  content: string;
  copyright: string;
  copyrightUrl: string;
  source: BibleSource;
};

/** Preferred default: YouVersion BSB, then Crossway ESV if that key exists. */
export function getDefaultBibleSource(): BibleSource {
  if (hasYouVersionAppKey()) {
    return {
      kind: "youversion",
      versionId: DEFAULT_YOUVERSION_VERSION_ID,
      abbreviation: "BSB",
    };
  }
  if (hasEsvApiKey()) {
    return { kind: "esv", abbreviation: "ESV" };
  }
  // Still default to YouVersion so the UI points people at the Platform key.
  return {
    kind: "youversion",
    versionId: DEFAULT_YOUVERSION_VERSION_ID,
    abbreviation: "BSB",
  };
}

/** Drop saved ESV preference when Crossway key is missing. */
export function normalizeBibleSource(source: BibleSource | null): BibleSource {
  if (!source) {
    return getDefaultBibleSource();
  }
  if (source.kind === "esv" && !hasEsvApiKey()) {
    return getDefaultBibleSource();
  }
  if (source.kind === "youversion" && !hasYouVersionAppKey() && hasEsvApiKey()) {
    return { kind: "esv", abbreviation: "ESV" };
  }
  return source;
}

/**
 * Load chapter text. Prefers YouVersion Platform; uses Crossway ESV only when
 * that source is selected and its key is configured.
 */
export async function fetchScriptureChapter(
  bookId: string,
  chapter: number,
  preferred: BibleSource
): Promise<ScriptureResult> {
  const source = normalizeBibleSource(preferred);
  const humanRef = `${bookId} ${chapter}`;

  if (source.kind === "youversion" || !hasEsvApiKey()) {
    if (!hasYouVersionAppKey()) {
      throw new Error(
        "Add EXPO_PUBLIC_YOUVERSION_APP_KEY from platform.youversion.com to load full chapters."
      );
    }
    const usfm = usfmChapterRef(bookId, chapter);
    if (!usfm) {
      throw new Error("Unknown book for YouVersion reference.");
    }
    const versionId =
      source.kind === "youversion"
        ? source.versionId
        : DEFAULT_YOUVERSION_VERSION_ID;
    const result = await fetchYouVersionPassage(versionId, usfm);
    return {
      reference: result.reference || humanRef,
      content: result.content,
      copyright: result.copyright,
      copyrightUrl: YOUVERSION_PLATFORM_URL,
      source: {
        kind: "youversion",
        versionId: result.versionId,
        abbreviation: result.abbreviation,
      },
    };
  }

  const esv = await fetchEsvPassage(
    // Prefer catalog-friendly "Genesis 1" style queries.
    bookId === "genesis"
      ? `Genesis ${chapter}`
      : humanRef.replace(/^\w/, (c) => c.toUpperCase())
  );
  return {
    reference: esv.canonical || humanRef,
    content: esv.passages.join("\n\n").trim(),
    copyright: ESV_COPYRIGHT_NOTICE,
    copyrightUrl: ESV_WEBSITE_URL,
    source: { kind: "esv", abbreviation: "ESV" },
  };
}
