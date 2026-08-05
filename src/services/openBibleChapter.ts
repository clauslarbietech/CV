import { getWebtoonEpisode } from "../data/webtoonEpisodes";

type NavigateFn = (
  screen: "WebtoonEpisode" | "ChapterPlayer",
  params: {
    bookId: string;
    chapterNumber: number;
    storylineId?: string;
    autoPlay?: boolean;
  }
) => void;

/**
 * Open a book chapter in the illustrated player (art + synced speech + audio).
 * Webtoon scroll mode is only used when a specific storylineId is requested.
 */
export function openBibleChapter(
  navigation: { navigate: NavigateFn },
  bookId: string,
  chapterNumber: number,
  options?: { autoPlay?: boolean; storylineId?: string }
) {
  if (options?.storylineId) {
    const webtoon = getWebtoonEpisode(
      bookId,
      chapterNumber,
      options.storylineId
    );
    if (webtoon) {
      navigation.navigate("WebtoonEpisode", {
        bookId,
        chapterNumber,
        storylineId: webtoon.storylineId,
      });
      return;
    }
  }
  navigation.navigate("ChapterPlayer", {
    bookId,
    chapterNumber,
    autoPlay: options?.autoPlay ?? true,
  });
}
