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
  addFavorite,
  type FavoriteKind,
} from "../../services/favoritesService";

type Props = {
  visible: boolean;
  kind: Extract<FavoriteKind, "bible_highlight" | "story_highlight">;
  bookId: string;
  chapterNumber: number;
  defaultExcerpt: string;
  scriptureRef?: string;
  storylineId?: string;
  onClose: () => void;
  onSaved?: () => void;
};

/**
 * Highlight a verse or story line, optionally leave a comment,
 * and save into Favorites with a clear type label.
 */
export default function HighlightModal({
  visible,
  kind,
  bookId,
  chapterNumber,
  defaultExcerpt,
  scriptureRef,
  storylineId,
  onClose,
  onSaved,
}: Props) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState(defaultExcerpt.slice(0, 280));
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const resetAndClose = () => {
    setTitle("");
    setExcerpt(defaultExcerpt.slice(0, 280));
    setComment("");
    onClose();
  };

  const save = async () => {
    if (!excerpt.trim()) {
      return;
    }
    setSaving(true);
    try {
      await addFavorite({
        kind,
        title:
          title.trim() ||
          (kind === "bible_highlight"
            ? scriptureRef ?? `Genesis ${chapterNumber}`
            : `Story · Ch. ${chapterNumber}`),
        note:
          kind === "bible_highlight"
            ? "Bible highlight"
            : "Story highlight",
        excerpt: excerpt.trim(),
        comment: comment.trim(),
        bookId,
        chapterNumber,
        scriptureRef,
        storylineId,
      });
      onSaved?.();
      resetAndClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={resetAndClose}
    >
      <View className="flex-1 justify-end bg-black/55">
        <View className="rounded-t-3xl bg-night-card px-4 pb-8 pt-3">
          <View className="mb-3 items-center">
            <View className="mb-3 h-1 w-10 rounded-full bg-white/25" />
            <View className="w-full flex-row items-center justify-between">
              <Text className="text-base font-bold text-night-text">
                {kind === "bible_highlight"
                  ? "Highlight Bible text"
                  : "Highlight this story"}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={resetAndClose}
                className="h-9 w-9 items-center justify-center rounded-full bg-night-elevated"
              >
                <MaterialIcons name="close" size={20} color="#F2F2F7" />
              </Pressable>
            </View>
            <Text className="mt-1 self-start text-xs text-night-muted">
              Add a short title, then leave a comment if you want.
            </Text>
          </View>

          <Text className="mb-1 text-xs font-bold uppercase tracking-wide text-ochre-soft">
            Title / note
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Promise to Abraham"
            placeholderTextColor="#8E8E93"
            className="mb-3 rounded-2xl bg-night-elevated px-3 py-3 text-sm text-night-text"
          />

          <Text className="mb-1 text-xs font-bold uppercase tracking-wide text-ochre-soft">
            Highlighted words
          </Text>
          <TextInput
            value={excerpt}
            onChangeText={setExcerpt}
            multiline
            placeholder="Paste or keep the selected lines"
            placeholderTextColor="#8E8E93"
            className="mb-3 min-h-[88px] rounded-2xl bg-night-elevated px-3 py-3 text-sm text-night-text"
            textAlignVertical="top"
          />

          <Text className="mb-1 text-xs font-bold uppercase tracking-wide text-ochre-soft">
            Comment (optional)
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder="What stood out to you?"
            placeholderTextColor="#8E8E93"
            className="mb-4 min-h-[72px] rounded-2xl bg-night-elevated px-3 py-3 text-sm text-night-text"
            textAlignVertical="top"
          />

          <Pressable
            accessibilityRole="button"
            disabled={saving || !excerpt.trim()}
            onPress={() => {
              void save();
            }}
            className="items-center rounded-full bg-terracotta py-3.5"
          >
            <Text className="text-sm font-bold text-white">
              {saving ? "Saving…" : "Save to Favorites"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
