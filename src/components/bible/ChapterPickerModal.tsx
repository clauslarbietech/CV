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
  listGenesisByArc,
  type GenesisArc,
  type GenesisChapterMeta,
} from "../../data/genesisChapters";
import { useReaderColors } from "../../theme/ThemeProvider";

type Props = {
  visible: boolean;
  chapterCount: number;
  selectedChapter?: number;
  /** When set, open directly on this arc’s chapter grid. */
  initialArc?: GenesisArc | null;
  onClose: () => void;
  onSelect: (chapterNumber: number) => void;
};

type Step = "arc" | "chapter";

/**
 * Bottom-sheet chapter picker for Genesis —
 * arc first, then a compact chapter grid (YouVersion-style).
 */
export default function ChapterPickerModal({
  visible,
  chapterCount,
  selectedChapter,
  initialArc = null,
  onClose,
  onSelect,
}: Props) {
  const readerColors = useReaderColors();
  const { height, width } = useWindowDimensions();
  const [step, setStep] = useState<Step>("arc");
  const [pendingArc, setPendingArc] = useState<GenesisArc | null>(null);

  const gap = 8;
  const columns = 5;
  const pad = 16;
  const cell =
    (Math.min(width, 480) - pad * 2 - gap * (columns - 1)) / columns;

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (initialArc) {
      setPendingArc(initialArc);
      setStep("chapter");
    } else {
      setStep("arc");
      setPendingArc(null);
    }
  }, [initialArc, visible]);

  const chapters: GenesisChapterMeta[] = useMemo(() => {
    if (!pendingArc) {
      return [];
    }
    return listGenesisByArc(pendingArc).filter(
      (meta) => meta.number <= chapterCount
    );
  }, [chapterCount, pendingArc]);

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
              {step === "chapter" ? (
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
                  Choose chapter
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
                ? `Genesis 1–${chapterCount} · pick an arc`
                : `${pendingArc} · tap a chapter`}
            </Text>
          </View>

          {step === "arc" ? (
            <FlatList
              data={[...GENESIS_ARCS]}
              keyExtractor={(arc) => arc}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: arc }) => {
                const list = listGenesisByArc(arc);
                const range =
                  list.length > 0
                    ? `${list[0].number}–${list[list.length - 1].number}`
                    : "";
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setPendingArc(arc);
                      setStep("chapter");
                    }}
                    className="mb-2 flex-row items-center rounded-2xl px-3 py-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  >
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
                        Chapters {range}
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
              data={chapters}
              keyExtractor={(item) => String(item.number)}
              numColumns={columns}
              columnWrapperStyle={{ gap, marginBottom: gap }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = item.number === selectedChapter;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Chapter ${item.number}, ${item.title}`}
                    onPress={() => {
                      onSelect(item.number);
                      onClose();
                    }}
                    style={{
                      width: cell,
                      height: cell,
                      borderRadius: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: selected
                        ? readerColors.accent
                        : readerColors.elevated,
                    }}
                  >
                    <Text
                      className="text-base font-bold"
                      style={{
                        color: selected ? "#FFFFFF" : readerColors.text,
                      }}
                    >
                      {item.number}
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
