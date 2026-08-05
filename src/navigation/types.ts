import type { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;
  Bible: undefined;
  Plans: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
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
  Settings: undefined;
  Profile: undefined;
  Favorites: undefined;
};
