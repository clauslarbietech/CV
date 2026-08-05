import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CATALOG_BOOKS, type CatalogBook } from "../../data/bibleCatalog";

type Props = {
  visible: boolean;
  bookId: string;
  chapter: number;
  onClose: () => void;
  onSelect: (bookId: string, chapter: number) => void;
};

type Step = "book" | "chapter";

/**
 * YouVersion-style scripture location picker:
 * choose book → choose chapter.
 */
export default function ScripturePickerModal({
  visible,
  bookId,
  chapter,
  onClose,
  onSelect,
}: Props) {
  const { height } = useWindowDimensions();
  const [step, setStep] = useState<Step>("book");
  const [pendingBook, setPendingBook] = useState<CatalogBook | null>(null);

  const ot = useMemo(
    () => CATALOG_BOOKS.filter((book) => book.testament === "OT"),
    []
  );
  const nt = useMemo(
    () => CATALOG_BOOKS.filter((book) => book.testament === "NT"),
    []
  );

  const open = () => {
    setStep("book");
    setPendingBook(null);
  };

  const chapters = pendingBook
    ? Array.from({ length: pendingBook.chapters }, (_, i) => i + 1)
    : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onShow={open}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/55">
        <View
          className="rounded-t-3xl bg-[#1C1C1E] px-4 pb-8 pt-3"
          style={{ maxHeight: height * 0.82 }}
        >
          <View className="mb-3 items-center">
            <View className="mb-3 h-1 w-10 rounded-full bg-white/25" />
            <View className="w-full flex-row items-center justify-between">
              {step === "chapter" ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setStep("book")}
                  className="flex-row items-center py-1"
                >
                  <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
                  <Text className="ml-1 text-sm font-semibold text-white">
                    Books
                  </Text>
                </Pressable>
              ) : (
                <Text className="text-base font-bold text-white">
                  Choose scripture
                </Text>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close picker"
                onPress={onClose}
                className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
              >
                <MaterialIcons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
            <Text className="mt-1 self-start text-xs text-white/50">
              {step === "book"
                ? "Pick a book — Genesis has comics ready"
                : `${pendingBook?.name} · ${pendingBook?.chapters} chapters`}
            </Text>
          </View>

          {step === "book" ? (
            <FlatList
              data={[...ot, ...nt]}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text className="mb-2 mt-1 text-xs font-bold uppercase tracking-[2px] text-[#E4572E]">
                  Bible books
                </Text>
              }
              renderItem={({ item }) => {
                const selected = item.id === bookId;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setPendingBook(item);
                      setStep("chapter");
                    }}
                    className={`mb-2 flex-row items-center rounded-2xl px-3 py-3 ${
                      selected ? "bg-white/15" : "bg-white/5"
                    }`}
                  >
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <Text className="text-xs font-bold text-white">
                        {item.abbreviation}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-white">
                        {item.name}
                      </Text>
                      <Text className="text-xs text-white/45">
                        {item.testament === "OT" ? "Old Testament" : "New Testament"}
                        {item.illustrated ? " · comics" : ""}
                      </Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color="#9AA0A6"
                    />
                  </Pressable>
                );
              }}
            />
          ) : (
            <FlatList
              data={chapters}
              keyExtractor={(item) => String(item)}
              numColumns={5}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ gap: 8 }}
              contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
              renderItem={({ item }) => {
                const selected =
                  pendingBook?.id === bookId && item === chapter;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      if (!pendingBook) {
                        return;
                      }
                      onSelect(pendingBook.id, item);
                      onClose();
                    }}
                    className={`mb-1 h-12 flex-1 items-center justify-center rounded-xl ${
                      selected ? "bg-[#E4572E]" : "bg-white/10"
                    }`}
                  >
                    <Text
                      className={`text-base font-bold ${
                        selected ? "text-white" : "text-white/85"
                      }`}
                    >
                      {item}
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
