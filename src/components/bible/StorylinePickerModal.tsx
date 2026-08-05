import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  GENESIS_ARCS,
  getGenesisChapter,
  type GenesisArc,
} from "../../data/genesisChapters";
import type { WebtoonEpisode } from "../../data/webtoonEpisodes";
import { useReaderColors } from "../../theme/ThemeProvider";

type Props = {
  visible: boolean;
  episodes: WebtoonEpisode[];
  onClose: () => void;
  onSelect: (episode: WebtoonEpisode) => void;
};

type Step = "arc" | "storyline";

/**
 * Bottom-sheet picker for illustrated storylines —
 * same pattern as Bible version / chapter pickers (not an endless page scroll).
 */
export default function StorylinePickerModal({
  visible,
  episodes,
  onClose,
  onSelect,
}: Props) {
  const readerColors = useReaderColors();
  const { height } = useWindowDimensions();
  const [step, setStep] = useState<Step>("arc");
  const [pendingArc, setPendingArc] = useState<GenesisArc | null>(null);

  const byArc = useMemo(() => {
    const map = new Map<GenesisArc, WebtoonEpisode[]>();
    for (const episode of episodes) {
      const arc = getGenesisChapter(episode.chapterNumber)?.arc ?? "Creation";
      const list = map.get(arc) ?? [];
      list.push(episode);
      map.set(arc, list);
    }
    return map;
  }, [episodes]);

  const arcsWithArt = useMemo(
    () => GENESIS_ARCS.filter((arc) => (byArc.get(arc)?.length ?? 0) > 0),
    [byArc]
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    setStep("arc");
    setPendingArc(null);
  }, [visible]);

  const storylines = pendingArc ? (byArc.get(pendingArc) ?? []) : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/55">
        <View
          className="rounded-t-3xl px-4 pb-8 pt-3"
          style={{
            maxHeight: height * 0.82,
            backgroundColor: readerColors.surface,
          }}
        >
          <View className="mb-3 items-center">
            <View
              className="mb-3 h-1 w-10 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            />
            <View className="w-full flex-row items-center justify-between">
              {step === "storyline" ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setStep("arc")}
                  className="flex-row items-center py-1"
                >
                  <MaterialIcons
                    name="arrow-back"
                    size={22}
                    color={readerColors.text}
                  />
                  <Text
                    className="ml-1 text-sm font-semibold"
                    style={{ color: readerColors.text }}
                  >
                    Arcs
                  </Text>
                </Pressable>
              ) : (
                <Text
                  className="text-base font-bold"
                  style={{ color: readerColors.text }}
                >
                  Illustrated storylines
                </Text>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close picker"
                onPress={onClose}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: readerColors.elevated }}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color={readerColors.text}
                />
              </Pressable>
            </View>
            <Text
              className="mt-1 self-start text-xs"
              style={{ color: readerColors.secondary }}
            >
              {step === "arc"
                ? `${episodes.length} comics · pick an arc`
                : `${pendingArc} · ${storylines.length} storylines`}
            </Text>
          </View>

          {step === "arc" ? (
            <FlatList
              data={arcsWithArt}
              keyExtractor={(arc) => arc}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: arc }) => {
                const count = byArc.get(arc)?.length ?? 0;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setPendingArc(arc);
                      setStep("storyline");
                    }}
                    className="mb-2 flex-row items-center rounded-2xl px-3 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  >
                    <View
                      className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: readerColors.elevated }}
                    >
                      <MaterialIcons
                        name="auto-stories"
                        size={20}
                        color={readerColors.highlight}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-base font-bold"
                        style={{ color: readerColors.text }}
                      >
                        {arc}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: readerColors.secondary }}
                      >
                        {count} illustrated {count === 1 ? "storyline" : "storylines"}
                      </Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color={readerColors.secondary}
                    />
                  </Pressable>
                );
              }}
            />
          ) : (
            <FlatList
              data={storylines}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="mb-2 rounded-2xl px-3 py-3"
                  style={{ backgroundColor: readerColors.elevated }}
                >
                  <Text
                    className="text-[10px] font-bold uppercase tracking-[1.5px]"
                    style={{ color: readerColors.accentSoft }}
                  >
                    {item.episodeLabel} · Ch. {item.chapterNumber}
                  </Text>
                  <Text
                    className="mt-1 text-base font-bold"
                    style={{ color: readerColors.text }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="mt-0.5 text-xs"
                    style={{ color: readerColors.secondary }}
                    numberOfLines={2}
                  >
                    {item.subtitle} · {item.panels.length} scenes
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
