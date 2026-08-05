import {
  getJourneyChapters,
  type Journey,
} from "../data/library";
import { getBookProgress } from "./listeningProgress";

export type JourneyProgressSummary = {
  completed: number;
  total: number;
  percent: number;
  downloaded: boolean;
  finished: boolean;
  started: boolean;
};

export async function getJourneyProgressSummary(
  journey: Journey
): Promise<JourneyProgressSummary> {
  const bookId = journey.bookIds[0];
  const chapters = getJourneyChapters(journey, bookId);
  const progressMap = await getBookProgress(bookId);
  const completed = chapters.filter(
    (chapter) => progressMap[String(chapter.number)]?.completed
  ).length;
  const downloaded = chapters.some(
    (chapter) => progressMap[String(chapter.number)]?.downloaded
  );
  const total = chapters.length;
  const percent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    completed,
    total,
    percent,
    downloaded,
    finished: percent === 100 && total > 0,
    started: percent > 0,
  };
}
