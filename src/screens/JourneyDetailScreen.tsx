import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import JourneyMenuModal from "../components/journeys/JourneyMenuModal";
import {
  formatClock,
  getBook,
  getJourney,
  getJourneyChapters,
} from "../data/library";
import type { RootStackParamList } from "../navigation/types";
import { inviteToJourney } from "../services/journeyInvite";
import { getJourneyProgressSummary } from "../services/journeyProgress";
import { getBookProgress, type BookProgressMap } from "../services/listeningProgress";
import { openBibleChapter } from "../services/openBibleChapter";
import { useTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "JourneyDetail">;

export default function JourneyDetailScreen({ navigation, route }: Props) {
  const journey = getJourney(route.params.journeyId);
  const { width } = useWindowDimensions();
  const { colors, nightMode } = useTheme();
  const heroHeight = Math.round(Math.min(width, 520) * 0.62);

  const [progressMap, setProgressMap] = useState<BookProgressMap>({});
  const [summary, setSummary] = useState({
    percent: 0,
    finished: false,
    started: false,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  const book = journey ? getBook(journey.bookIds[0]) : undefined;
  const chapters = journey ? getJourneyChapters(journey) : [];

  const refresh = useCallback(async () => {
    if (!journey || !book) {
      return;
    }
    setProgressMap(await getBookProgress(book.id));
    const next = await getJourneyProgressSummary(journey);
    setSummary({
      percent: next.percent,
      finished: next.finished,
      started: next.started,
    });
  }, [book, journey]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  if (!journey || !book) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-night-bg">
        <Text className="text-base font-semibold" style={{ color: colors.accent }}>
          Journey not found.
        </Text>
      </SafeAreaView>
    );
  }

  const openChapter = (chapterNumber: number) => {
    setActiveChapter(chapterNumber);
    openBibleChapter(navigation, book.id, chapterNumber, { autoPlay: true });
  };

  const startJourney = () => {
    openChapter(journey.startChapter);
  };

  const shareJourney = () => {
    void inviteToJourney({
      journeyTitle: journey.title,
      booksLabel: journey.booksLabel,
      bookId: book.id,
      chapterNumber: journey.startChapter,
    });
  };

  const actionLabel = summary.started ? "Restart" : "Start";
  const actionIcon = summary.started ? "replay" : "play-arrow";
  const secondaryFill = nightMode ? colors.elevated : "#F2F2F7";
  const badgeFill = nightMode ? colors.elevated : "#F2F2F7";
  const metaGray = nightMode ? colors.muted : "#6B6B6B";
  const titleBlack = colors.text;

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Image
            source={journey.cover}
            style={{ width, height: heroHeight }}
            resizeMode="cover"
          />
          <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-3 py-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => navigation.goBack()}
              className="items-center justify-center rounded-full"
              style={{
                width: 44,
                height: 44,
                backgroundColor: "rgba(0,0,0,0.45)",
              }}
            >
              <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Journey options"
              onPress={() => setMenuOpen(true)}
              className="items-center justify-center rounded-full"
              style={{
                width: 44,
                height: 44,
                backgroundColor: "rgba(0,0,0,0.45)",
              }}
            >
              <MaterialIcons name="more-vert" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View className="px-4 pb-8 pt-4">
          <View className="flex-row items-center">
            <Text
              className="text-2xl font-bold"
              style={{ color: titleBlack }}
            >
              {journey.title}
            </Text>
            <MaterialIcons
              name="info-outline"
              size={18}
              color={metaGray}
              style={{ marginLeft: 8 }}
            />
          </View>
          <Text className="mt-1 text-base font-medium" style={{ color: titleBlack }}>
            {journey.booksLabel}
          </Text>

          <View className="mt-3 flex-row flex-wrap items-center gap-2">
            <View
              className="rounded-md px-2.5 py-1"
              style={{ backgroundColor: badgeFill }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: titleBlack }}
              >
                {journey.days} days
              </Text>
            </View>
            {summary.finished ? (
              <View
                className="rounded-md px-2.5 py-1"
                style={{ backgroundColor: "#D8F5D8" }}
              >
                <Text className="text-xs font-semibold" style={{ color: "#1B7A3A" }}>
                  Finished
                </Text>
              </View>
            ) : (
              <View
                className="rounded-md px-2.5 py-1"
                style={{ backgroundColor: "#D8F5D8" }}
              >
                <Text className="text-xs font-semibold" style={{ color: "#1B7A3A" }}>
                  {summary.percent}%
                </Text>
              </View>
            )}
          </View>

          <View className="mt-4 flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
              onPress={startJourney}
              className="flex-1 flex-row items-center justify-center rounded-full py-3.5"
              style={{ backgroundColor: colors.accent }}
            >
              <MaterialIcons name={actionIcon} size={20} color="#FFFFFF" />
              <Text className="ml-2 text-base font-bold text-white">
                {actionLabel}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create group"
              onPress={shareJourney}
              className="flex-1 flex-row items-center justify-center rounded-full py-3.5"
              style={{ backgroundColor: secondaryFill }}
            >
              <MaterialIcons name="groups" size={20} color={titleBlack} />
              <Text
                className="ml-2 text-base font-bold"
                style={{ color: titleBlack }}
              >
                Create Group
              </Text>
            </Pressable>
          </View>

          <View className="mt-6">
            {chapters.map((chapter, index) => {
              const saved = progressMap[String(chapter.number)];
              const completed = saved?.completed ?? false;
              const isActive =
                activeChapter === chapter.number ||
                (activeChapter == null && index === 0 && summary.started);
              const accent = colors.accent;
              const rowTitle = isActive ? accent : titleBlack;
              const rowMeta = isActive ? accent : metaGray;
              const thumb = chapter.panels[0]?.image ?? journey.cover;

              return (
                <Pressable
                  key={chapter.number}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${book.name} ${chapter.number}`}
                  accessibilityState={{ selected: isActive }}
                  onPress={() => openChapter(chapter.number)}
                  className="mb-1 flex-row items-center py-3"
                >
                  <Image
                    source={thumb}
                    style={{ width: 56, height: 56, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                  <View className="ml-3 flex-1">
                    <Text
                      className="text-lg font-bold"
                      style={{ color: rowTitle }}
                    >
                      {book.name} {chapter.number}
                    </Text>
                    <View className="mt-1 flex-row items-center">
                      {completed ? (
                        <MaterialIcons
                          name="check-circle"
                          size={16}
                          color="#34C759"
                          style={{ marginRight: 6 }}
                        />
                      ) : (
                        <View
                          className="mr-2 h-4 w-4 rounded-full"
                          style={{ backgroundColor: badgeFill }}
                        />
                      )}
                      <Text
                        className="flex-1 text-sm font-medium"
                        style={{ color: rowMeta }}
                        numberOfLines={1}
                      >
                        {chapter.guide.title}
                      </Text>
                    </View>
                    <Text
                      className="mt-0.5 text-xs font-medium"
                      style={{ color: rowMeta }}
                    >
                      {chapter.guide.narrator}
                    </Text>
                  </View>
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: rowMeta }}
                  >
                    {formatClock(chapter.guide.durationSeconds)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <JourneyMenuModal
        visible={menuOpen}
        journeyTitle={journey.title}
        onClose={() => setMenuOpen(false)}
        onInvite={shareJourney}
        onOpenJourney={startJourney}
      />
    </SafeAreaView>
  );
}
