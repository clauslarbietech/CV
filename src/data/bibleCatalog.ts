/**
 * Lightweight Bible catalog for picker / search UI.
 * Genesis is fully available (50 chapters); other books are listed for
 * YouVersion-style navigation and open via ESV passage query when keyed.
 */

export type CatalogBook = {
  id: string;
  name: string;
  abbreviation: string;
  testament: "OT" | "NT";
  chapters: number;
  /** True when we ship comic storylines / offline chapter meta. */
  illustrated: boolean;
};

export const CATALOG_BOOKS: CatalogBook[] = [
  { id: "genesis", name: "Genesis", abbreviation: "Ge", testament: "OT", chapters: 50, illustrated: true },
  { id: "exodus", name: "Exodus", abbreviation: "Ex", testament: "OT", chapters: 40, illustrated: false },
  { id: "psalms", name: "Psalms", abbreviation: "Ps", testament: "OT", chapters: 150, illustrated: false },
  { id: "proverbs", name: "Proverbs", abbreviation: "Pr", testament: "OT", chapters: 31, illustrated: false },
  { id: "isaiah", name: "Isaiah", abbreviation: "Is", testament: "OT", chapters: 66, illustrated: false },
  { id: "matthew", name: "Matthew", abbreviation: "Mt", testament: "NT", chapters: 28, illustrated: false },
  { id: "mark", name: "Mark", abbreviation: "Mk", testament: "NT", chapters: 16, illustrated: false },
  { id: "luke", name: "Luke", abbreviation: "Lk", testament: "NT", chapters: 24, illustrated: false },
  { id: "john", name: "John", abbreviation: "Jn", testament: "NT", chapters: 21, illustrated: false },
  { id: "acts", name: "Acts", abbreviation: "Ac", testament: "NT", chapters: 28, illustrated: false },
  { id: "romans", name: "Romans", abbreviation: "Ro", testament: "NT", chapters: 16, illustrated: false },
  { id: "revelation", name: "Revelation", abbreviation: "Re", testament: "NT", chapters: 22, illustrated: false },
];

export function getCatalogBook(bookId: string): CatalogBook | undefined {
  return CATALOG_BOOKS.find((book) => book.id === bookId);
}

export function passageQueryFor(bookId: string, chapter: number): string {
  const book = getCatalogBook(bookId);
  return `${book?.name ?? bookId} ${chapter}`;
}

/** Parse simple queries like "Genesis 3", "John 3:16", "Ge 1". */
export function parseScriptureQuery(input: string): {
  bookId: string;
  chapter: number;
  verse?: number;
} | null {
  const raw = input.trim();
  if (!raw) {
    return null;
  }

  const match = raw.match(
    /^((?:1|2|3)?\s*[A-Za-z]+)\s+(\d+)(?::(\d+))?$/
  );
  if (!match) {
    return null;
  }

  const bookToken = match[1].replace(/\s+/g, " ").trim().toLowerCase();
  const chapter = Number(match[2]);
  const verse = match[3] ? Number(match[3]) : undefined;

  const book = CATALOG_BOOKS.find(
    (item) =>
      item.name.toLowerCase() === bookToken ||
      item.abbreviation.toLowerCase() === bookToken ||
      item.id === bookToken
  );

  if (!book || !Number.isFinite(chapter) || chapter < 1 || chapter > book.chapters) {
    return null;
  }

  return { bookId: book.id, chapter, verse };
}
