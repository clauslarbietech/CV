/**
 * Bible catalog helpers.
 * Prefer YouVersion Platform books/chapters when an App Key is present;
 * fall back to this static subset offline.
 */

export type CatalogBook = {
  id: string;
  name: string;
  abbreviation: string;
  /** USFM 3-letter book code for YouVersion Platform APIs. */
  usfm: string;
  testament: "OT" | "NT" | "DC";
  chapters: number;
  /** True when we ship comic storylines / offline chapter meta. */
  illustrated: boolean;
};

/** Books that have local comics / audio-guide metadata. */
export const ILLUSTRATED_USFM = new Set(["GEN", "EXO"]);

export const CATALOG_BOOKS: CatalogBook[] = [
  { id: "GEN", name: "Genesis", abbreviation: "Gen", usfm: "GEN", testament: "OT", chapters: 50, illustrated: true },
  { id: "EXO", name: "Exodus", abbreviation: "Exo", usfm: "EXO", testament: "OT", chapters: 40, illustrated: true },
  { id: "PSA", name: "Psalms", abbreviation: "Psa", usfm: "PSA", testament: "OT", chapters: 150, illustrated: false },
  { id: "PRO", name: "Proverbs", abbreviation: "Pro", usfm: "PRO", testament: "OT", chapters: 31, illustrated: false },
  { id: "ISA", name: "Isaiah", abbreviation: "Isa", usfm: "ISA", testament: "OT", chapters: 66, illustrated: false },
  { id: "MAT", name: "Matthew", abbreviation: "Mat", usfm: "MAT", testament: "NT", chapters: 28, illustrated: false },
  { id: "MRK", name: "Mark", abbreviation: "Mrk", usfm: "MRK", testament: "NT", chapters: 16, illustrated: false },
  { id: "LUK", name: "Luke", abbreviation: "Luk", usfm: "LUK", testament: "NT", chapters: 24, illustrated: false },
  { id: "JHN", name: "John", abbreviation: "Jhn", usfm: "JHN", testament: "NT", chapters: 21, illustrated: false },
  { id: "ACT", name: "Acts", abbreviation: "Act", usfm: "ACT", testament: "NT", chapters: 28, illustrated: false },
  { id: "ROM", name: "Romans", abbreviation: "Rom", usfm: "ROM", testament: "NT", chapters: 16, illustrated: false },
  { id: "REV", name: "Revelation", abbreviation: "Rev", usfm: "REV", testament: "NT", chapters: 22, illustrated: false },
];

/** Map reader book ids (USFM or legacy "genesis") onto local library book ids. */
export function libraryBookIdFor(bookId: string): string {
  const usfm = toUsfm(bookId);
  if (usfm === "GEN") {
    return "genesis";
  }
  if (usfm === "EXO") {
    return "exodus";
  }
  return usfm.toLowerCase();
}

export function toUsfm(bookId: string): string {
  const trimmed = bookId.trim();
  if (/^[0-9A-Z]{3}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  const fromStatic = CATALOG_BOOKS.find(
    (book) =>
      book.id.toLowerCase() === trimmed.toLowerCase() ||
      book.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (fromStatic) {
    return fromStatic.usfm;
  }
  const lower = trimmed.toLowerCase();
  if (lower === "genesis") {
    return "GEN";
  }
  if (lower === "exodus") {
    return "EXO";
  }
  return trimmed.toUpperCase();
}

export function getCatalogBook(
  bookId: string,
  books: CatalogBook[] = CATALOG_BOOKS
): CatalogBook | undefined {
  const usfm = toUsfm(bookId);
  return (
    books.find((book) => book.usfm === usfm || book.id === usfm) ??
    books.find((book) => book.id.toLowerCase() === bookId.toLowerCase())
  );
}

export function passageQueryFor(
  bookId: string,
  chapter: number,
  books: CatalogBook[] = CATALOG_BOOKS
): string {
  const book = getCatalogBook(bookId, books);
  return `${book?.name ?? bookId} ${chapter}`;
}

/** YouVersion / USFM chapter reference, e.g. `GEN.1`. */
export function usfmChapterRef(bookId: string, chapter: number): string {
  return `${toUsfm(bookId)}.${chapter}`;
}

/** Parse simple queries like "Genesis 3", "John 3:16", "Ge 1". */
export function parseScriptureQuery(
  input: string,
  books: CatalogBook[] = CATALOG_BOOKS
): {
  bookId: string;
  chapter: number;
  verse?: number;
} | null {
  const raw = input.trim();
  if (!raw) {
    return null;
  }

  const match = raw.match(/^((?:1|2|3)?\s*[A-Za-z]+)\s+(\d+)(?::(\d+))?$/);
  if (!match) {
    return null;
  }

  const bookToken = match[1].replace(/\s+/g, " ").trim().toLowerCase();
  const chapter = Number(match[2]);
  const verse = match[3] ? Number(match[3]) : undefined;

  const book = books.find(
    (item) =>
      item.name.toLowerCase() === bookToken ||
      item.abbreviation.toLowerCase() === bookToken ||
      item.usfm.toLowerCase() === bookToken ||
      item.id.toLowerCase() === bookToken
  );

  if (!book || !Number.isFinite(chapter) || chapter < 1 || chapter > book.chapters) {
    return null;
  }

  return { bookId: book.usfm, chapter, verse };
}
