import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ESV_COPYRIGHT_NOTICE,
  ESV_WEBSITE_URL,
  fetchPassage,
  type EsvPassage,
} from "../services/esvService";

const PASSAGE_QUERY = "Genesis 1";

export default function ReaderScreen() {
  const [passage, setPassage] = useState<EsvPassage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPassage() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchPassage(PASSAGE_QUERY);
        if (!cancelled) {
          setPassage(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load scripture."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPassage();

    return () => {
      cancelled = true;
    };
  }, []);

  const verses = passage?.passages.join("\n\n").trim() ?? "";

  return (
    <SafeAreaView className="flex-1 bg-parchment" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-36 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-1 font-serif text-xs uppercase tracking-[3px] text-teal-deep">
            Anime Audio Bible
          </Text>
          <Text className="mb-6 text-3xl font-bold text-parchment-ink">
            {passage?.canonical ?? PASSAGE_QUERY}
          </Text>

          {/* Comic panel placeholder — ink & watercolor storybook frame */}
          <View className="mb-6 overflow-hidden rounded-2xl border-2 border-terracotta-dark bg-parchment-warm shadow-md">
            <View className="border-b border-ochre/40 bg-teal-mist px-4 py-3">
              <Text className="text-sm font-semibold uppercase tracking-wide text-teal-ink">
                Panel · Creation Dawn
              </Text>
            </View>
            <View className="min-h-[220px] items-center justify-center bg-parchment px-6 py-10">
              <View className="mb-4 h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-terracotta bg-ochre-soft/40">
                <Text className="text-center text-xs font-medium text-terracotta-dark">
                  Watercolor{"\n"}Art Soon
                </Text>
              </View>
              <Text className="text-center text-base leading-6 text-parchment-ink/80">
                Whimsical ink-and-watercolor motion comic panels will appear
                here — warm terracotta, golden ochre, and deep teal washes with
                crisp dark outlines.
              </Text>
            </View>
          </View>

          <View className="rounded-2xl border border-teal-deep/20 bg-parchment-warm px-5 py-6">
            {loading ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color="#1A5F61" />
                <Text className="mt-3 text-sm text-teal-deep">
                  Fetching {PASSAGE_QUERY}…
                </Text>
              </View>
            ) : error ? (
              <View className="py-6">
                <Text className="mb-2 text-base font-semibold text-terracotta-dark">
                  Could not load passage
                </Text>
                <Text className="text-sm leading-5 text-parchment-ink/80">
                  {error}
                </Text>
              </View>
            ) : (
              <Text className="text-base leading-7 text-parchment-ink">
                {verses}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Sticky footer: mandatory ESV attribution + AI drawer entry point */}
        <View className="absolute bottom-0 left-0 right-0 border-t border-ochre/30 bg-parchment px-4 pb-3 pt-3 shadow-lg">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ask AI about Genesis 1"
            className="mb-3 items-center rounded-xl bg-teal-deep px-4 py-3 active:bg-teal-ink"
            onPress={() => {
              // Prepared for @gorhom/bottom-sheet AI study chat drawer.
            }}
          >
            <Text className="text-base font-semibold text-parchment">
              {"💬 Ask AI about Genesis 1"}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Open ESV website"
            onPress={() => {
              void Linking.openURL(ESV_WEBSITE_URL);
            }}
          >
            <Text className="text-center text-[10px] leading-4 text-parchment-ink/70">
              {ESV_COPYRIGHT_NOTICE}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
