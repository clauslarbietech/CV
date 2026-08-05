import { useCallback, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import JourneyMenuModal from "../components/journeys/JourneyMenuModal";
import { BOOKS, JOURNEYS } from "../data/library";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import { inviteToJourney } from "../services/journeyInvite";
import { getBookProgress } from "../services/listeningProgress";
import { openBibleChapter } from "../services/openBibleChapter";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Plans">,
  NativeStackScreenProps<RootStackParamList>
>;

type Filter = "Started" | "Finished" | "Downloaded" | "All";

type PlanRow = {
  id: string;
  title: string;
  /** Display name without “Journey N |” prefix — used in invite. */
  journeyTitle: string;
  subtitle: string;
  days: number;
  cover: number;
  bookId: string;
  startChapter: number;
  progress: number;
  downloaded: boolean;
  finished: boolean;
  started: boolean;
  isJourney: boolean;
};

const FILTERS: Filter[] = ["Started", "Finished", "Downloaded", "All"];

export default function MyPlansScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [showNews, setShowNews] = useState(true);
  const [menuPlan, setMenuPlan] = useState<PlanRow | null>(null);

  const refresh = useCallback(async () => {
    const rows: PlanRow[] = [];

    for (const journey of JOURNEYS) {
      const bookId = journey.bookIds[0];
      const book = BOOKS.find((item) => item.id === bookId);
      const progressMap = await getBookProgress(bookId);
      const chapters = book?.chapters ?? [];
      const completed = chapters.filter(
        (chapter) => progressMap[String(chapter.number)]?.completed
      ).length;
      const downloaded = chapters.some(
        (chapter) => progressMap[String(chapter.number)]?.downloaded
      );
      const pct =
        chapters.length === 0
          ? 0
          : Math.round((completed / chapters.length) * 100);

      rows.push({
        id: journey.id,
        title: `${journey.title} Together`,
        journeyTitle: journey.title,
        subtitle: journey.booksLabel,
        days: journey.days,
        cover: journey.cover,
        bookId,
        startChapter: journey.startChapter,
        progress: pct,
        downloaded,
        finished: pct === 100 && chapters.length > 0,
        started: pct > 0,
        isJourney: true,
      });
    }

    for (const book of BOOKS) {
      const progressMap = await getBookProgress(book.id);
      const completed = book.chapters.filter(
        (chapter) => progressMap[String(chapter.number)]?.completed
      ).length;
      const downloaded = book.chapters.some(
        (chapter) => progressMap[String(chapter.number)]?.downloaded
      );
      const pct =
        book.chapters.length === 0
          ? 0
          : Math.round((completed / book.chapters.length) * 100);

      rows.push({
        id: `book-${book.id}`,
        title: book.name,
        journeyTitle: book.name,
        subtitle: book.tagline,
        days: book.days,
        cover: book.cover,
        bookId: book.id,
        startChapter: 1,
        progress: pct,
        downloaded,
        finished: pct === 100 && book.chapters.length > 0,
        started: pct > 0,
        isJourney: false,
      });
    }

    setPlans(rows);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const visible = useMemo(() => {
    switch (filter) {
      case "Started":
        return plans.filter((plan) => plan.started && !plan.finished);
      case "Finished":
        return plans.filter((plan) => plan.finished);
      case "Downloaded":
        return plans.filter((plan) => plan.downloaded);
      default:
        return plans;
    }
  }, [filter, plans]);

  const openPlan = (plan: PlanRow) => {
    navigation.navigate("Book", {
      bookId: plan.bookId,
      chapterNumber: plan.startChapter,
    });
    openBibleChapter(navigation, plan.bookId, plan.startChapter, {
      autoPlay: true,
    });
  };

  const sharePlan = (plan: PlanRow) => {
    void inviteToJourney({
      journeyTitle: plan.journeyTitle,
      booksLabel: plan.subtitle,
      bookId: plan.bookId,
      chapterNumber: plan.startChapter,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-10 pt-2">
          <View className="mb-4 items-center">
            <Text className="text-xl font-bold lowercase text-terracotta">
              anime audio bible
            </Text>
            <Text className="mt-1 text-center text-sm text-night-muted">
              Invite friends to read a journey together
            </Text>
          </View>

          {showNews ? (
            <View className="mb-4 rounded-2xl bg-terracotta px-4 py-4">
              <View className="mb-1 flex-row items-start justify-between">
                <Text className="text-xs font-bold uppercase tracking-wide text-white/90">
                  Read together
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setShowNews(false)}
                >
                  <Text className="text-base font-bold text-white">×</Text>
                </Pressable>
              </View>
              <Text className="text-lg font-bold text-white">
                Tap ··· on a journey, then Invite — share with contacts, Messages, Copy, or Notes
              </Text>
            </View>
          ) : null}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
          >
            {FILTERS.map((item) => {
              const active = item === filter;
              return (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  onPress={() => setFilter(item)}
                  className={`rounded-full px-4 py-2 ${
                    active
                      ? "bg-night-elevated"
                      : "border border-night-border bg-night-card"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      active ? "text-night-text" : "text-night-muted"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {visible.map((plan) => (
            <View
              key={plan.id}
              className="mb-4 flex-row items-center rounded-2xl bg-night-card px-2 py-2"
            >
              <Pressable
                accessibilityRole="button"
                className="flex-1 flex-row items-center"
                onPress={() => openPlan(plan)}
              >
                <Image
                  source={plan.cover}
                  style={{ width: 72, height: 72, borderRadius: 14 }}
                />
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center">
                    {plan.isJourney ? (
                      <MaterialIcons
                        name="groups"
                        size={16}
                        color="#E4572E"
                        style={{ marginRight: 6 }}
                      />
                    ) : null}
                    <Text
                      className="flex-1 text-base font-bold text-night-text"
                      numberOfLines={1}
                    >
                      {plan.title}
                    </Text>
                  </View>
                  <Text className="text-sm text-night-muted" numberOfLines={1}>
                    {plan.subtitle}
                  </Text>
                  <View className="mt-2 flex-row flex-wrap items-center gap-2">
                    <View className="rounded bg-night-elevated px-2 py-1">
                      <Text className="text-[11px] font-semibold text-night-muted">
                        {plan.days} days
                      </Text>
                    </View>
                    <View
                      className={`rounded px-2 py-1 ${
                        plan.progress > 0
                          ? "bg-night-border"
                          : "bg-night-elevated"
                      }`}
                    >
                      <Text className="text-[11px] font-semibold text-ochre-soft">
                        {plan.progress}%
                      </Text>
                    </View>
                    {plan.isJourney ? (
                      <View className="flex-row items-center rounded bg-terracotta/20 px-2 py-1">
                        <MaterialIcons
                          name="person-add"
                          size={12}
                          color="#E4572E"
                        />
                        <Text className="ml-1 text-[11px] font-semibold text-terracotta">
                          Together
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Invite others to ${plan.journeyTitle}`}
                onPress={() => sharePlan(plan)}
                className="mx-1 h-10 w-10 items-center justify-center rounded-full bg-night-elevated"
              >
                <MaterialIcons name="person-add" size={20} color="#E4572E" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`More options for ${plan.journeyTitle}`}
                onPress={() => setMenuPlan(plan)}
                className="h-10 w-10 items-center justify-center rounded-full bg-night-elevated"
              >
                <MaterialIcons name="more-horiz" size={22} color="#F2F2F7" />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <JourneyMenuModal
        visible={Boolean(menuPlan)}
        journeyTitle={menuPlan?.journeyTitle ?? "Journey"}
        onClose={() => setMenuPlan(null)}
        onInvite={() => {
          if (menuPlan) {
            sharePlan(menuPlan);
          }
        }}
        onOpenJourney={() => {
          if (menuPlan) {
            openPlan(menuPlan);
          }
        }}
      />
    </SafeAreaView>
  );
}
