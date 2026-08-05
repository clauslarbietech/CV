import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppTabBar from "../components/navigation/AppTabBar";
import type { RootStackParamList } from "../navigation/types";
import {
  favoriteKindLabel,
  listFavorites,
  removeFavorite,
  type FavoriteItem,
} from "../services/favoritesService";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

export default function FavoritesScreen({ navigation }: Props) {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  const refresh = useCallback(() => {
    void listFavorites().then(setItems);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const openItem = (item: FavoriteItem) => {
    if (item.kind === "storyline" || item.storylineId) {
      navigation.navigate("WebtoonEpisode", {
        bookId: item.bookId,
        chapterNumber: item.chapterNumber,
        storylineId: item.storylineId,
      });
      return;
    }
    navigation.navigate("ChapterPlayer", {
      bookId: item.bookId,
      chapterNumber: item.chapterNumber,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-night-bg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
          >
            <MaterialIcons name="arrow-back" size={20} color="#F2F2F7" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-xl font-bold text-night-text">Favorites</Text>
            <Text className="text-xs text-night-muted">
              Chapters, stories, and highlights — each labeled by type
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {items.length === 0 ? (
            <View className="mt-10 items-center px-6">
              <MaterialIcons name="star-border" size={40} color="#8E8E93" />
              <Text className="mt-3 text-center text-base font-bold text-night-text">
                No favorites yet
              </Text>
              <Text className="mt-2 text-center text-sm text-night-muted">
                Star a chapter, or highlight Bible/story text and leave a short
                comment — it will show up here with a clear type label.
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                className="mb-3 rounded-2xl border border-night-border bg-night-card px-4 py-3"
                onPress={() => openItem(item)}
                onLongPress={() => {
                  Alert.alert("Remove favorite?", item.title, [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Remove",
                      style: "destructive",
                      onPress: () => {
                        void removeFavorite(item.id).then(refresh);
                      },
                    },
                  ]);
                }}
              >
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="text-[10px] font-bold uppercase tracking-[1.5px] text-terracotta">
                    {favoriteKindLabel(item.kind)}
                    {item.note ? ` · ${item.note}` : ""}
                  </Text>
                  <MaterialIcons name="star" size={16} color="#F0D78C" />
                </View>
                <Text className="text-base font-bold text-night-text">
                  {item.title}
                </Text>
                {item.excerpt ? (
                  <Text
                    className="mt-1 text-sm leading-5 text-night-muted"
                    numberOfLines={3}
                  >
                    “{item.excerpt}”
                  </Text>
                ) : null}
                {item.comment ? (
                  <View className="mt-2 rounded-xl bg-night-elevated px-3 py-2">
                    <Text className="text-[10px] font-bold uppercase tracking-wide text-ochre-soft">
                      Your comment
                    </Text>
                    <Text className="mt-0.5 text-sm text-night-text">
                      {item.comment}
                    </Text>
                  </View>
                ) : null}
                <Text className="mt-2 text-[11px] text-night-soft">
                  {item.bookId} · Ch. {item.chapterNumber}
                  {item.scriptureRef ? ` · ${item.scriptureRef}` : ""}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>

        <AppTabBar activeTab="More" />
      </View>
    </SafeAreaView>
  );
}
