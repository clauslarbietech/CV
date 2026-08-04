export type MainTabParamList = {
  Browse: undefined;
  MyPlans: undefined;
  Groups: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Book: { bookId: string };
  ChapterPlayer: { bookId: string; chapterNumber: number };
  WebtoonEpisode: { bookId: string; chapterNumber: number };
  AnimationDemo: undefined;
};
