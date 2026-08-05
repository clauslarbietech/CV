import { useCallback, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import BrandWordmark from "../components/brand/BrandWordmark";
import { JOURNEYS } from "../data/library";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import { getJourneyProgressSummary } from "../services/journeyProgress";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Plans">,
  NativeStackScreenProps<RootStackParamList>
>;

type Filter = "Started" | "Finished" | "Downloaded" | "All";

type JourneyRow = {
  id: string;
  title: string;
  subtitle: string;
  days: number;
  cover: number;
  progress: number;
  downloaded: boolean;
  finished: boolean;
  started: boolean;
};

const FILTERS: Filter[] = ["Started", "Finished", "Downloaded", "All"];

export default function MyPlansScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const [journeys, setJourneys] = useState<JourneyRow[]>([]);

  const refresh = useCallback(async () => {
    const rows: JourneyRow[] = [];

    for (const journey of JOURNEYS) {
      const summary = await getJourneyProgressSummary(journey);
      rows.push({
        id: journey.id,
        title: journey.title,
        subtitle: journey.booksLabel,
        days: journey.days,
        cover: journey.cover,
        progress: summary.percent,
        downloaded: summary.downloaded,
        finished: summary.finished,
        started: summary.started,
      });
    }

    setJourneys(rows);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const visible = useMemo(() => {
    switch (filter) {
      case "Started":
        return journeys.filter((row) => row.started && !row.finished);
      case "Finished":
        return journeys.filter((row) => row.finished);
      case "Downloaded":
        return journeys.filter((row) => row.downloaded);
      default:
        return journeys;
    }
  }, [filter, journeys]);

  const openJourney = (journeyId: string) => {
    navigation.navigate("JourneyDetail", { journeyId });
  };

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-10 pt-2">
          <View className="mb-5 items-center">
            <BrandWordmark size="sm" />
          </View>

          <Text className="mb-3 text-xl font-bold text-night-text">
            Bible Journeys
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
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
                      ? "bg-white"
                      : "border border-night-border bg-transparent"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      active ? "text-night-bg" : "text-night-text"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {visible.map((row) => (
            <Pressable
              key={row.id}
              accessibilityRole="button"
              onPress={() => openJourney(row.id)}
              className="mb-1 flex-row items-center py-3"
            >
              <Image
                source={row.cover}
                style={{ width: 80, height: 80, borderRadius: 16 }}
                resizeMode="cover"
              />
              <View className="ml-3 flex-1">
                <Text
                  className="text-base font-bold text-night-text"
                  numberOfLines={1}
                >
                  {row.title}
                </Text>
                <Text className="text-sm text-night-muted" numberOfLines={1}>
                  {row.subtitle}
                </Text>
                <View className="mt-2 flex-row items-center gap-2">
                  <View className="rounded bg-night-elevated px-2 py-1">
                    <Text className="text-[11px] font-semibold text-night-muted">
                      {row.days} days
                    </Text>
                  </View>
                  {row.finished ? (
                    <View className="rounded bg-emerald-600 px-2 py-1">
                      <Text className="text-[11px] font-semibold text-white">
                        Finished
                      </Text>
                    </View>
                  ) : (
                    <View className="rounded bg-emerald-600/25 px-2 py-1">
                      <Text className="text-[11px] font-semibold text-emerald-400">
                        {row.progress}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#AEAEB2" />
            </Pressable>
          ))}

          {visible.length === 0 ? (
            <Text className="mt-4 text-center text-sm text-night-muted">
              No journeys match this filter.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
