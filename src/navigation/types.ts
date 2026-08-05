import type { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;
  Bible: undefined;
  Plans: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Book: {
    bookId: string;
    /** Pre-select / open this chapter when entering the book journey. */
    chapterNumber?: number;
  };
  ChapterPlayer: {
    bookId: string;
    chapterNumber: number;
    /** When true, start the audio guide (e.g. from webtoon Back/Next). */
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
