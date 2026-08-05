export type MainTabParamList = {
  Home: undefined;
  Bible: undefined;
  Plans: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Book: { bookId: string };
  ChapterPlayer: { bookId: string; chapterNumber: number };
  WebtoonEpisode: {
    bookId: string;
    chapterNumber: number;
    storylineId?: string;
  };
  AnimationDemo: undefined;
};
