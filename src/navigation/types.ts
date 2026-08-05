export type MainTabParamList = {
  Home: undefined;
  Bible: undefined;
  Plans: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Book: { bookId: string };
  ChapterPlayer: {
    bookId: string;
    chapterNumber: number;
    /** When true, start the audio guide (e.g. from webtoon Continue). */
    autoPlay?: boolean;
  };
  WebtoonEpisode: {
    bookId: string;
    chapterNumber: number;
    storylineId?: string;
  };
  AnimationDemo: undefined;
};
