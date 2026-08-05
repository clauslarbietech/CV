import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Share,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { addFavorite } from "../../services/favoritesService";
import type { FavoriteKind } from "../../services/favoritesService";
import {
  HIGHLIGHT_COLORS,
  type HighlightColorId,
} from "../../theme/highlightColors";
import { readerColors } from "../../theme/readerColors";

type Props = {
  visible: boolean;
  selectedText: string;
  selectionLabel: string;
  bookId: string;
  chapterNumber: number;
  scriptureRef?: string;
  versionLabel?: string;
  favoriteKind?: Extract<FavoriteKind, "bible_highlight" | "story_highlight">;
  onClose: () => void;
  onHighlightSaved?: (color: HighlightColorId, excerpt: string) => void;
};

async function copyText(text: string): Promise<boolean> {
  try {
    if (
      Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      navigator.clipboard?.writeText
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    await Share.share({ message: text });
    return true;
  } catch {
    return false;
  }
}

/**
 * YouVersion-style selection tray: highlight colors, Save, Note, Copy.
 */
export default function SelectionActionSheet({
  visible,
  selectedText,
  selectionLabel,
  bookId,
  chapterNumber,
  scriptureRef,
  versionLabel,
  favoriteKind = "bible_highlight",
  onClose,
  onHighlightSaved,
}: Props) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setNoteOpen(false);
      setNote("");
      setStatus(null);
    }
  }, [visible]);

  const saveHighlight = async (
    color: HighlightColorId,
    comment = "",
    title?: string
  ) => {
    const excerpt = selectedText.trim();
    if (!excerpt) {
      return;
    }
    await addFavorite({
      kind: favoriteKind,
      title:
        title?.trim() ||
        scriptureRef ||
        selectionLabel ||
        `Ch. ${chapterNumber}`,
      note:
        favoriteKind === "story_highlight" ? "Story highlight" : "Bible highlight",
      excerpt,
      comment: comment.trim(),
      highlightColor: color,
      bookId,
      chapterNumber,
      scriptureRef,
    });
    onHighlightSaved?.(color, excerpt);
    setStatus("Saved to Favorites");
    setTimeout(() => {
      setStatus(null);
      onClose();
    }, 700);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/45" onPress={onClose}>
        <Pressable
          onPress={(event) => {
            // Keep sheet open when interacting inside it.
            event.stopPropagation?.();
          }}
          className="rounded-t-3xl px-4 pb-8 pt-3"
          style={{ backgroundColor: readerColors.surface }}
        >
          <View className="mb-3 items-center">
            <View className="mb-2 h-1 w-10 rounded-full bg-white/25" />
            <Text
              className="self-start text-xs font-semibold"
              style={{ color: readerColors.secondary }}
            >
              Selected: {selectionLabel}
              {versionLabel ? ` ${versionLabel}` : ""}
            </Text>
          </View>

          {!noteOpen ? (
            <View className="flex-row flex-wrap items-center justify-between gap-3">
              <View className="flex-row items-center gap-3 rounded-2xl bg-night-elevated px-3 py-3">
                {HIGHLIGHT_COLORS.map((color) => (
                  <Pressable
                    key={color.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Highlight ${color.label}`}
                    onPress={() => {
                      void saveHighlight(color.id);
                    }}
                    className="h-9 w-9 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </View>

              <View className="flex-row gap-2">
                <ActionChip
                  icon="bookmark-border"
                  label="Save"
                  onPress={() => {
                    void saveHighlight("orange");
                  }}
                />
                <ActionChip
                  icon="notes"
                  label="Note"
                  onPress={() => setNoteOpen(true)}
                />
                <ActionChip
                  icon="content-copy"
                  label="Copy"
                  onPress={() => {
                    void copyText(selectedText).then((ok) => {
                      setStatus(ok ? "Copied" : "Could not copy");
                      setTimeout(() => setStatus(null), 900);
                    });
                  }}
                />
              </View>
            </View>
          ) : (
            <View>
              <Text className="mb-2 text-sm font-bold text-night-text">
                Add a note
              </Text>
              <Text
                className="mb-2 text-xs leading-5"
                style={{ color: readerColors.secondary }}
                numberOfLines={3}
              >
                “{selectedText.slice(0, 160)}
                {selectedText.length > 160 ? "…" : ""}”
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="What stood out?"
                placeholderTextColor="#8E8E93"
                multiline
                className="mb-3 min-h-[80px] rounded-2xl bg-night-elevated px-3 py-3 text-sm text-night-text"
                textAlignVertical="top"
                autoFocus
              />
              <View className="flex-row gap-2">
                <Pressable
                  accessibilityRole="button"
                  className="flex-1 items-center rounded-full bg-night-elevated py-3"
                  onPress={() => setNoteOpen(false)}
                >
                  <Text className="text-sm font-bold text-night-text">Back</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  className="flex-1 items-center rounded-full bg-terracotta py-3"
                  onPress={() => {
                    void saveHighlight("pink", note);
                  }}
                >
                  <Text className="text-sm font-bold text-white">
                    Save note
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {status ? (
            <Text className="mt-3 text-center text-xs font-semibold text-ochre-soft">
              {status}
            </Text>
          ) : (
            <Text className="mt-3 text-center text-[11px] text-night-soft">
              Swipe down to close · highlights appear in Favorites
            </Text>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ActionChip({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-14 w-14 items-center justify-center rounded-2xl bg-night-elevated"
    >
      <MaterialIcons name={icon} size={20} color="#F2F2F7" />
      <Text className="mt-0.5 text-[10px] font-semibold text-night-muted">
        {label}
      </Text>
    </Pressable>
  );
}
