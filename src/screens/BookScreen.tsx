import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getBook } from "../data/library";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Book">;

export default function BookScreen({ navigation, route }: Props) {
  const book = getBook(route.params.bookId);

  if (!book) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-terracotta-dark">Book not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-12 pt-2">
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            className="mb-4 self-start py-1"
          >
            <Text className="text-sm font-semibold text-teal-deep">← Home</Text>
          </Pressable>

          <View className="mb-6 flex-row items-center">
            <Image
              source={book.cover}
              style={{ width: 96, height: 96, borderRadius: 16 }}
            />
            <View className="ml-4 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                {book.testament === "OT" ? "Old Testament" : "New Testament"}
              </Text>
              <Text className="text-3xl font-bold text-teal-ink">{book.name}</Text>
              <Text className="mt-1 text-sm leading-5 text-parchment-ink/70">
                {book.tagline}
              </Text>
              <Text className="mt-2 text-xs font-semibold text-teal-deep">
                {book.chapters.length} chapters ready · {book.days} day plan
              </Text>
            </View>
          </View>

          <Text className="mb-3 text-lg font-bold text-teal-ink">
            Chapters · comics & narration
          </Text>

          {book.chapters.map((chapter) => {
            const thumb = chapter.panels[0]?.image ?? book.cover;
            return (
              <Pressable
                key={chapter.number}
                accessibilityRole="button"
                className="mb-3 flex-row overflow-hidden rounded-2xl border border-teal-deep/10 bg-parchment active:bg-parchment-warm"
                onPress={() =>
                  navigation.navigate("ChapterPlayer", {
                    bookId: book.id,
                    chapterNumber: chapter.number,
                  })
                }
              >
                <Image
                  source={thumb}
                  style={{ width: 88, height: 88 }}
                  resizeMode="cover"
                />
                <View className="flex-1 justify-center px-3 py-2">
                  <Text className="text-xs font-semibold text-terracotta">
                    Chapter {chapter.number}
                  </Text>
                  <Text className="text-base font-bold text-teal-ink">
                    {chapter.title}
                  </Text>
                  <Text className="mt-1 text-xs text-parchment-ink/65" numberOfLines={2}>
                    {chapter.guide.title} · {chapter.panels.length} anime panels
                  </Text>
                </View>
                <View className="justify-center pr-3">
                  <Text className="text-xl text-terracotta">▶</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
