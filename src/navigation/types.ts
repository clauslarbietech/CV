export type RootStackParamList = {
  Home: undefined;
  Book: { bookId: string };
  ChapterPlayer: { bookId: string; chapterNumber: number };
};
