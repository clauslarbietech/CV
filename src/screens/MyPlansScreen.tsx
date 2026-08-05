import { useCallback, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BOOKS, JOURNEYS } from "../data/library";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import { getBookProgress } from "../services/listeningProgress";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Plans">,
  NativeStackScreenProps<RootStackParamList>
>;

type Filter = "Started" | "Finished" | "Downloaded" | "All";

type PlanRow = {
  id: string;
  title: string;
  subtitle: string;
  days: number;
  cover: number;
  bookId: string;
  progress: number;
  downloaded: boolean;
  finished: boolean;
  started: boolean;
};

const FILTERS: Filter[] = ["Started", "Finished", "Downloaded", "All"];

export default function MyPlansScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [showNews, setShowNews] = useState(true);

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
        title: `Journey ${journey.number} | ${journey.title}`,
        subtitle: journey.booksLabel,
        days: journey.days,
        cover: journey.cover,
        bookId,
        progress: pct,
        downloaded,
        finished: pct === 100 && chapters.length > 0,
        started: pct > 0,
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
        subtitle: book.tagline,
        days: book.days,
        cover: book.cover,
        bookId: book.id,
        progress: pct,
        downloaded,
        finished: pct === 100 && book.chapters.length > 0,
        started: pct > 0,
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

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-10 pt-2">
          <View className="mb-4 items-center">
            <Text className="text-xl font-bold lowercase text-terracotta">
              anime audio bible
            </Text>
          </View>

          {showNews ? (
            <View className="mb-4 rounded-2xl bg-terracotta px-4 py-4">
              <View className="mb-1 flex-row items-start justify-between">
                <Text className="text-xs font-bold uppercase tracking-wide text-white/90">
                  News and updates!
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setShowNews(false)}
                >
                  <Text className="text-base font-bold text-white">×</Text>
                </Pressable>
              </View>
              <Text className="text-lg font-bold text-white">
                Genesis Fall storyboard + mobile menus
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
                    active ? "bg-night-elevated" : "border border-night-border bg-night-card"
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
            <Pressable
              key={plan.id}
              accessibilityRole="button"
              className="mb-4 flex-row items-center"
              onPress={() =>
                navigation.navigate("Book", { bookId: plan.bookId })
              }
            >
              <Image
                source={plan.cover}
                style={{ width: 72, height: 72, borderRadius: 14 }}
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-night-text">
                  {plan.title}
                </Text>
                <Text className="text-sm text-night-muted" numberOfLines={1}>
                  {plan.subtitle}
                </Text>
                <View className="mt-2 flex-row gap-2">
                  <View className="rounded bg-night-elevated px-2 py-1">
                    <Text className="text-[11px] font-semibold text-night-muted">
                      {plan.days} days
                    </Text>
                  </View>
                  <View
                    className={`rounded px-2 py-1 ${
                      plan.progress > 0 ? "bg-night-border" : "bg-night-elevated"
                    }`}
                  >
                    <Text className="text-[11px] font-semibold text-ochre-soft">
                      {plan.progress}%
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-xl text-night-soft">›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
