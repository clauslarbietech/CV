import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Speech from "expo-speech";
import BibleSearchModal from "../components/bible/BibleSearchModal";
import ScripturePickerModal from "../components/bible/ScripturePickerModal";
import VersionPickerModal, {
  type BibleSource,
} from "../components/bible/VersionPickerModal";
import {
  getCatalogBook,
  passageQueryFor,
  usfmChapterRef,
} from "../data/bibleCatalog";
import { getGenesisChapter } from "../data/genesisChapters";
import { getChapter } from "../data/library";
import {
  getPanelAudioText,
  getWebtoonEpisode,
  listWebtoonEpisodes,
} from "../data/webtoonEpisodes";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import {
  ESV_COPYRIGHT_NOTICE,
  ESV_WEBSITE_URL,
  fetchPassage,
} from "../services/esvService";
import {
  DEFAULT_YOUVERSION_VERSION_ID,
  YOUVERSION_PLATFORM_URL,
  fetchYouVersionPassage,
  hasYouVersionAppKey,
} from "../services/youversionService";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Bible">,
  NativeStackScreenProps<RootStackParamList>
>;

/**
 * YouVersion-style Bible reader:
 * top location/version + search/speaker, comic panels, scripture text below.
 */
export default function BibleReaderScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width - 32, 380);
  const panelHeight = Math.round(panelWidth * 1.15);

  const [bookId, setBookId] = useState("genesis");
  const [chapter, setChapter] = useState(1);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [source, setSource] = useState<BibleSource>(() =>
    hasYouVersionAppKey()
      ? {
          kind: "youversion",
          versionId: DEFAULT_YOUVERSION_VERSION_ID,
          abbreviation: "BSB",
        }
      : { kind: "esv", abbreviation: "ESV" }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verses, setVerses] = useState("");
  const [canonical, setCanonical] = useState("");
  const [copyright, setCopyright] = useState(ESV_COPYRIGHT_NOTICE);
  const [copyrightUrl, setCopyrightUrl] = useState(ESV_WEBSITE_URL);
  const [reading, setReading] = useState(false);
  const [activePanel, setActivePanel] = useState(0);

  const book = getCatalogBook(bookId);
  const libraryChapter = getChapter(bookId, chapter);
  const genesisMeta = bookId === "genesis" ? getGenesisChapter(chapter) : undefined;
  const webtoon = getWebtoonEpisode(bookId, chapter);
  const illustratedOptions = listWebtoonEpisodes(bookId).filter(
    (episode) => episode.chapterNumber === chapter
  );

  const comicPanels = useMemo(() => {
    if (webtoon?.panels?.length) {
      return webtoon.panels.map((panel) => ({
        id: panel.id,
        image: panel.image,
        caption: panel.bubble?.text,
        audioText: getPanelAudioText(panel),
      }));
    }
    if (libraryChapter?.panels?.length) {
      return libraryChapter.panels.map((panel) => ({
        id: panel.id,
        image: panel.image,
        caption: panel.caption,
        audioText: `${panel.title}. ${panel.caption}`,
      }));
    }
    return [];
  }, [libraryChapter?.panels, webtoon]);

  const chapterTitle =
    webtoon?.title ??
    genesisMeta?.title ??
    libraryChapter?.title ??
    `${book?.name ?? "Bible"} ${chapter}`;

  const loadPassage = useCallback(async () => {
    const query = passageQueryFor(bookId, chapter);
    setLoading(true);
    setError(null);
    try {
      if (source.kind === "youversion") {
        const usfm = usfmChapterRef(bookId, chapter);
        if (!usfm) {
          throw new Error("Unknown book for YouVersion reference.");
        }
        const result = await fetchYouVersionPassage(source.versionId, usfm);
        setVerses(result.content);
        setCanonical(result.reference || query);
        setCopyright(result.copyright);
        setCopyrightUrl(YOUVERSION_PLATFORM_URL);
      } else {
        const result = await fetchPassage(query);
        setVerses(result.passages.join("\n\n").trim());
        setCanonical(result.canonical || query);
        setCopyright(ESV_COPYRIGHT_NOTICE);
        setCopyrightUrl(ESV_WEBSITE_URL);
      }
    } catch (err) {
      // Offline / no key: fall back to key verse + summary for Genesis.
      if (genesisMeta) {
        setCanonical(genesisMeta.passageQuery);
        setVerses(
          `${genesisMeta.keyVerseRef}\n\n${genesisMeta.keyVerseEsV}\n\n${genesisMeta.summary}`
        );
        setCopyright(ESV_COPYRIGHT_NOTICE);
        setCopyrightUrl(ESV_WEBSITE_URL);
        setError(
          err instanceof Error
            ? `${err.message} Showing key verse offline.`
            : "Showing key verse offline."
        );
      } else {
        setVerses("");
        setCanonical(query);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load passage. Add a YouVersion or ESV API key."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [bookId, chapter, genesisMeta, source]);

  useFocusEffect(
    useCallback(() => {
      void loadPassage();
      setActivePanel(0);
      return () => {
        void Speech.stop();
        setReading(false);
      };
    }, [loadPassage])
  );

  useEffect(() => {
    setActivePanel(0);
  }, [bookId, chapter]);

  const stopReading = () => {
    void Speech.stop();
    setReading(false);
  };

  const readAloud = () => {
    if (reading) {
      stopReading();
      return;
    }
    const panelLine = comicPanels[activePanel]?.audioText;
    const body = verses.trim();
    const text = [panelLine, body].filter(Boolean).join("\n\n");
    if (!text) {
      return;
    }
    setReading(true);
    Speech.speak(`${canonical || passageQueryFor(bookId, chapter)}. ${text}`, {
      rate: 0.88,
      onDone: () => setReading(false),
      onStopped: () => setReading(false),
      onError: () => setReading(false),
    });
  };

  const goChapter = (delta: number) => {
    if (!book) {
      return;
    }
    const next = chapter + delta;
    if (next < 1 || next > book.chapters) {
      return;
    }
    stopReading();
    setChapter(next);
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* YouVersion-style top chrome */}
      <View className="flex-row items-center justify-between px-3 pb-2 pt-1">
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose book and chapter"
            onPress={() => setPickerOpen(true)}
            className="flex-row items-center rounded-full bg-white/12 px-3 py-2"
          >
            <Text className="text-sm font-bold text-white">
              {book?.name ?? "Bible"} {chapter}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={20}
              color="#FFFFFF"
              style={{ marginLeft: 2 }}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Bible version ${source.abbreviation}`}
            onPress={() => setVersionOpen(true)}
            className="flex-row items-center rounded-full bg-white/12 px-3 py-2"
          >
            <Text className="text-sm font-bold text-white">
              {source.abbreviation}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={20}
              color="#FFFFFF"
              style={{ marginLeft: 2 }}
            />
          </Pressable>
        </View>

        <View className="flex-row items-center">
          <IconButton
            name={reading ? "stop" : "volume-up"}
            label={reading ? "Stop reading" : "Read aloud"}
            onPress={readAloud}
            active={reading}
          />
          <IconButton
            name="search"
            label="Search scripture"
            onPress={() => setSearchOpen(true)}
          />
          <IconButton
            name="more-horiz"
            label="More options"
            onPress={() =>
              navigation.navigate("WebtoonEpisode", {
                bookId,
                chapterNumber: chapter,
                storylineId: webtoon?.storylineId,
              })
            }
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Comic / animation area */}
        <View className="px-4 pb-3 pt-1">
          {comicPanels.length > 0 ? (
            <>
              <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#E4572E]">
                Comic scene
              </Text>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={panelWidth + 12}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / (panelWidth + 12)
                  );
                  setActivePanel(
                    Math.max(0, Math.min(comicPanels.length - 1, index))
                  );
                }}
              >
                {comicPanels.map((panel) => (
                  <View
                    key={panel.id}
                    style={{ width: panelWidth, marginRight: 12 }}
                    className="overflow-hidden rounded-2xl bg-[#111111]"
                  >
                    <Image
                      source={panel.image}
                      style={{ width: panelWidth, height: panelHeight }}
                      resizeMode="cover"
                    />
                    {panel.caption ? (
                      <View className="absolute bottom-0 left-0 right-0 bg-black/65 px-3 py-2">
                        <Text className="text-xs leading-4 text-white/90">
                          {panel.caption}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </ScrollView>
              <Text className="mt-2 text-center text-xs text-white/45">
                Scene {activePanel + 1} / {comicPanels.length}
                {illustratedOptions.length > 1
                  ? " · swipe for more panels"
                  : ""}
              </Text>
            </>
          ) : (
            <View className="mb-2 items-center rounded-2xl bg-white/8 px-4 py-8">
              <MaterialIcons name="auto-awesome" size={28} color="#F0D78C" />
              <Text className="mt-2 text-center text-sm font-semibold text-white">
                Comics coming for this chapter
              </Text>
              <Text className="mt-1 text-center text-xs text-white/50">
                Scripture below still reads like a Bible app — Genesis 1–3 have
                illustrated scenes today.
              </Text>
            </View>
          )}
        </View>

        {/* Bible text */}
        <View className="px-5 pb-6 pt-2">
          <Text className="mb-3 font-serif text-2xl italic text-white">
            {chapterTitle}
          </Text>

          {loading ? (
            <View className="items-center py-10">
              <ActivityIndicator color="#E4572E" />
              <Text className="mt-3 text-sm text-white/55">
                Loading {passageQueryFor(bookId, chapter)}…
              </Text>
            </View>
          ) : (
            <>
              {error ? (
                <Text className="mb-3 text-xs leading-4 text-[#F3A07A]">
                  {error}
                </Text>
              ) : null}
              <Text className="text-[17px] leading-7 text-white/92">
                {verses ||
                  "Add EXPO_PUBLIC_YOUVERSION_APP_KEY or EXPO_PUBLIC_ESV_API_KEY to load full chapter text."}
              </Text>
            </>
          )}

          <Pressable
            accessibilityRole="link"
            className="mt-6"
            onPress={() => {
              void Linking.openURL(copyrightUrl);
            }}
          >
            <Text className="text-center text-[10px] leading-4 text-white/35">
              {copyright}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Floating transport — YouVersion-like */}
      <View className="absolute bottom-3 left-0 right-0 items-center">
        <View className="flex-row items-center rounded-full bg-[#2C2C2E] px-2 py-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous chapter"
            onPress={() => goChapter(-1)}
            className="h-12 w-12 items-center justify-center rounded-full"
          >
            <MaterialIcons name="chevron-left" size={28} color="#FFFFFF" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={reading ? "Pause reading" : "Play reading"}
            onPress={readAloud}
            className="mx-1 h-14 w-14 items-center justify-center rounded-full bg-white/15"
          >
            <MaterialIcons
              name={reading ? "pause" : "play-arrow"}
              size={32}
              color="#FFFFFF"
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next chapter"
            onPress={() => goChapter(1)}
            className="h-12 w-12 items-center justify-center rounded-full"
          >
            <MaterialIcons name="chevron-right" size={28} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScripturePickerModal
        visible={pickerOpen}
        bookId={bookId}
        chapter={chapter}
        onClose={() => setPickerOpen(false)}
        onSelect={(nextBookId, nextChapter) => {
          stopReading();
          setBookId(nextBookId);
          setChapter(nextChapter);
        }}
      />
      <BibleSearchModal
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        onJump={(nextBookId, nextChapter) => {
          stopReading();
          setBookId(nextBookId);
          setChapter(nextChapter);
        }}
      />
      <VersionPickerModal
        visible={versionOpen}
        selected={source}
        onClose={() => setVersionOpen(false)}
        onSelect={(next) => {
          stopReading();
          setSource(next);
        }}
      />
    </SafeAreaView>
  );
}

function IconButton({
  name,
  label,
  onPress,
  active,
}: {
  name: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={`ml-1 h-10 w-10 items-center justify-center rounded-full ${
        active ? "bg-[#E4572E]" : "bg-transparent"
      }`}
      hitSlop={6}
    >
      <MaterialIcons name={name} size={22} color="#FFFFFF" />
    </Pressable>
  );
}
