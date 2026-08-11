import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  CATALOG_BOOKS,
  parseScriptureQuery,
  type CatalogBook,
} from "../../data/bibleCatalog";
import { useTheme } from "../../theme/ThemeProvider";

type Props = {
  visible: boolean;
  books?: CatalogBook[];
  onClose: () => void;
  onJump: (bookId: string, chapter: number) => void;
};

/**
 * Search / jump to a scripture location (e.g. "Genesis 3", "John 3:16").
 */
export default function BibleSearchModal({
  visible,
  books = CATALOG_BOOKS,
  onClose,
  onJump,
}: Props) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const parsed = parseScriptureQuery(query, books);
    if (!parsed) {
      setError('Try something like "Genesis 1" or "John 3"');
      return;
    }
    setError(null);
    onJump(parsed.bookId, parsed.chapter);
    setQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-start bg-black/60 px-4 pt-24">
        <View
          className="rounded-3xl px-4 py-4"
          style={{ backgroundColor: colors.card }}
        >
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-bold" style={{ color: colors.text }}>
              Search scripture
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close search"
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.elevated }}
            >
              <MaterialIcons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>

          <View
            className="mb-3 flex-row items-center rounded-2xl px-3"
            style={{ backgroundColor: colors.elevated }}
          >
            <MaterialIcons name="search" size={22} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={(value) => {
                setQuery(value);
                setError(null);
              }}
              placeholder="e.g. Genesis 3"
              placeholderTextColor={colors.soft}
              autoFocus
              autoCapitalize="words"
              returnKeyType="search"
              onSubmitEditing={submit}
              className="ml-2 flex-1 py-3 text-base"
              style={
                {
                  color: colors.text,
                  outlineStyle: "none",
                } as object
              }
            />
          </View>

          {error ? (
            <Text className="mb-1 text-xs text-[#F3A07A]">{error}</Text>
          ) : (
            <Text className="mb-1 text-xs" style={{ color: colors.muted }}>
              Type a book and chapter, then press Search on the keyboard — e.g.
              Genesis 1 or John 3.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
