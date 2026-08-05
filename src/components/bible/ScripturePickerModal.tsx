import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CATALOG_BOOKS, type CatalogBook } from "../../data/bibleCatalog";
import { readerColors } from "../../theme/readerColors";

type Props = {
  visible: boolean;
  bookId: string;
  chapter: number;
  books?: CatalogBook[];
  loading?: boolean;
  onClose: () => void;
  onSelect: (bookId: string, chapter: number) => void;
};

type Step = "book" | "chapter";

/**
 * YouVersion-style scripture location picker:
 * choose book → choose chapter (full API catalog when provided).
 */
export default function ScripturePickerModal({
  visible,
  bookId,
  chapter,
  books = CATALOG_BOOKS,
  loading = false,
  onClose,
  onSelect,
}: Props) {
  const { height } = useWindowDimensions();
  const [step, setStep] = useState<Step>("book");
  const [pendingBook, setPendingBook] = useState<CatalogBook | null>(null);

  const ot = useMemo(
    () => books.filter((book) => book.testament === "OT"),
    [books]
  );
  const nt = useMemo(
    () => books.filter((book) => book.testament === "NT"),
    [books]
  );
  const dc = useMemo(
    () => books.filter((book) => book.testament === "DC"),
    [books]
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    setStep("book");
    setPendingBook(null);
  }, [visible]);

  const chapters = pendingBook
    ? Array.from({ length: pendingBook.chapters }, (_, i) => i + 1)
    : [];

  const bookRows = useMemo(() => {
    const rows: Array<
      | { type: "header"; id: string; title: string }
      | { type: "book"; id: string; book: CatalogBook }
    > = [];
    if (ot.length) {
      rows.push({ type: "header", id: "ot", title: "Old Testament" });
      for (const book of ot) {
        rows.push({ type: "book", id: book.usfm, book });
      }
    }
    if (nt.length) {
      rows.push({ type: "header", id: "nt", title: "New Testament" });
      for (const book of nt) {
        rows.push({ type: "book", id: book.usfm, book });
      }
    }
    if (dc.length) {
      rows.push({ type: "header", id: "dc", title: "Deuterocanon" });
      for (const book of dc) {
        rows.push({ type: "book", id: book.usfm, book });
      }
    }
    return rows;
  }, [dc, nt, ot]);

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
                  onPress={() => setStep("book")}
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
                    Books
                  </Text>
                </Pressable>
              ) : (
                <Text
                  className="text-base font-bold"
                  style={{ color: readerColors.text }}
                >
                  Choose scripture
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
              {step === "book"
                ? `${books.length} books · Genesis has comics ready`
                : `${pendingBook?.name} · ${pendingBook?.chapters} chapters`}
            </Text>
          </View>

          {loading ? (
            <View className="items-center py-10">
              <ActivityIndicator color={readerColors.accent} />
              <Text
                className="mt-3 text-sm"
                style={{ color: readerColors.secondary }}
              >
                Loading Bible books…
              </Text>
            </View>
          ) : step === "book" ? (
            <FlatList
              data={bookRows}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                if (item.type === "header") {
                  return (
                    <Text
                      className="mb-2 mt-3 text-xs font-bold uppercase tracking-[2px]"
                      style={{ color: readerColors.accent }}
                    >
                      {item.title}
                    </Text>
                  );
                }
                const book = item.book;
                const selected = book.usfm === bookId || book.id === bookId;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setPendingBook(book);
                      setStep("chapter");
                    }}
                    className="mb-2 flex-row items-center rounded-2xl px-3 py-3"
                    style={{
                      backgroundColor: selected
                        ? readerColors.elevated
                        : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <View
                      className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: readerColors.elevated }}
                    >
                      <Text
                        className="text-[10px] font-bold"
                        style={{ color: readerColors.text }}
                      >
                        {book.abbreviation.slice(0, 3)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-base font-bold"
                        style={{ color: readerColors.text }}
                      >
                        {book.name}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: readerColors.secondary }}
                      >
                        {book.chapters} chapters
                        {book.illustrated ? " · comics" : ""}
                      </Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color={readerColors.faint}
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
                  (pendingBook?.usfm === bookId ||
                    pendingBook?.id === bookId) &&
                  item === chapter;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      if (!pendingBook) {
                        return;
                      }
                      onSelect(pendingBook.usfm, item);
                      onClose();
                    }}
                    className="mb-1 h-12 flex-1 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: selected
                        ? readerColors.accent
                        : readerColors.elevated,
                    }}
                  >
                    <Text
                      className="text-base font-bold"
                      style={{ color: readerColors.text }}
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
