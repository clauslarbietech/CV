import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "user:favorites:v1";

/** How the favorite was created — shown as a label in the Favorites list. */
export type FavoriteKind =
  | "chapter"
  | "storyline"
  | "bible_highlight"
  | "story_highlight";

export type FavoriteItem = {
  id: string;
  kind: FavoriteKind;
  /** User-facing title / note so they know what this favorite is. */
  title: string;
  /** Optional longer description from the user. */
  note: string;
  /** Highlighted or favorite text snippet. */
  excerpt: string;
  /** Optional comment left when highlighting. */
  comment: string;
  /** Highlight swatch id (green, pink, orange, blue). */
  highlightColor?: string;
  bookId: string;
  chapterNumber: number;
  storylineId?: string;
  scriptureRef?: string;
  createdAt: number;
};

function kindLabel(kind: FavoriteKind): string {
  switch (kind) {
    case "chapter":
      return "Chapter";
    case "storyline":
      return "Story";
    case "bible_highlight":
      return "Bible highlight";
    case "story_highlight":
      return "Story highlight";
    default:
      return "Favorite";
  }
}

export function favoriteKindLabel(kind: FavoriteKind): string {
  return kindLabel(kind);
}

async function readAll(): Promise<FavoriteItem[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as FavoriteItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(items: FavoriteItem[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

export async function listFavorites(): Promise<FavoriteItem[]> {
  const items = await readAll();
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getFavorite(id: string): Promise<FavoriteItem | undefined> {
  const items = await readAll();
  return items.find((item) => item.id === id);
}

export async function addFavorite(
  input: Omit<FavoriteItem, "id" | "createdAt"> & { id?: string }
): Promise<FavoriteItem> {
  const items = await readAll();
  const item: FavoriteItem = {
    ...input,
    id: input.id ?? `fav_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    title: input.title.trim() || kindLabel(input.kind),
    note: input.note?.trim() ?? "",
    excerpt: input.excerpt?.trim() ?? "",
    comment: input.comment?.trim() ?? "",
  };
  // Replace existing chapter favorite for same book/chapter.
  const withoutDup =
    item.kind === "chapter"
      ? items.filter(
          (existing) =>
            !(
              existing.kind === "chapter" &&
              existing.bookId === item.bookId &&
              existing.chapterNumber === item.chapterNumber
            )
        )
      : items;
  withoutDup.unshift(item);
  await writeAll(withoutDup);
  return item;
}

export async function updateFavorite(
  id: string,
  patch: Partial<Pick<FavoriteItem, "title" | "note" | "comment" | "excerpt">>
): Promise<FavoriteItem | undefined> {
  const items = await readAll();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) {
    return undefined;
  }
  const next = { ...items[index], ...patch };
  items[index] = next;
  await writeAll(items);
  return next;
}

export async function removeFavorite(id: string): Promise<void> {
  const items = await readAll();
  await writeAll(items.filter((item) => item.id !== id));
}

export async function isChapterFavorited(
  bookId: string,
  chapterNumber: number
): Promise<boolean> {
  const items = await readAll();
  return items.some(
    (item) =>
      item.kind === "chapter" &&
      item.bookId === bookId &&
      item.chapterNumber === chapterNumber
  );
}

export async function toggleChapterFavorite(input: {
  bookId: string;
  chapterNumber: number;
  title: string;
  note?: string;
}): Promise<{ favorited: boolean; item?: FavoriteItem }> {
  const items = await readAll();
  const existing = items.find(
    (item) =>
      item.kind === "chapter" &&
      item.bookId === input.bookId &&
      item.chapterNumber === input.chapterNumber
  );
  if (existing) {
    await writeAll(items.filter((item) => item.id !== existing.id));
    return { favorited: false };
  }
  const item = await addFavorite({
    kind: "chapter",
    title: input.title,
    note: input.note ?? "Favorite chapter",
    excerpt: "",
    comment: "",
    bookId: input.bookId,
    chapterNumber: input.chapterNumber,
  });
  return { favorited: true, item };
}
