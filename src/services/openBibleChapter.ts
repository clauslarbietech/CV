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
 * Open a book chapter at the selected number (webtoon/slides when available).
 */
export function openBibleChapter(
  navigation: { navigate: NavigateFn },
  bookId: string,
  chapterNumber: number,
  options?: { autoPlay?: boolean; storylineId?: string }
) {
  const webtoon = getWebtoonEpisode(
    bookId,
    chapterNumber,
    options?.storylineId
  );
  if (webtoon) {
    navigation.navigate("WebtoonEpisode", {
      bookId,
      chapterNumber,
      storylineId: webtoon.storylineId,
    });
    return;
  }
  navigation.navigate("ChapterPlayer", {
    bookId,
    chapterNumber,
    autoPlay: options?.autoPlay ?? true,
  });
}
