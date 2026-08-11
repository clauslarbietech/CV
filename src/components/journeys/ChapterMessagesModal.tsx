import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { formatClock } from "../../data/library";
import { useChapterVoiceNote } from "../../hooks/useChapterVoiceNote";
import { MIN_TOUCH_TARGET } from "../../theme/a11y";
import { useTheme } from "../../theme/ThemeProvider";
import {
  addTextMessage,
  addVoiceMessage,
  listChapterMessages,
  markChapterMessagesRead,
  type ChapterMessage,
} from "../../services/journeyMessages";

type Props = {
  visible: boolean;
  groupId: string;
  journeyTitle: string;
  bookId: string;
  chapterNumber: number;
  chapterTitle: string;
  memberCount: number;
  onClose: () => void;
  onMessagesChanged?: () => void;
};

export default function ChapterMessagesModal({
  visible,
  groupId,
  journeyTitle,
  bookId,
  chapterNumber,
  chapterTitle,
  memberCount,
  onClose,
  onMessagesChanged,
}: Props) {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<ChapterMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const listRef = useRef<FlatList<ChapterMessage>>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listChapterMessages({ groupId, bookId, chapterNumber });
      setMessages(items);
      await markChapterMessagesRead({ groupId, bookId, chapterNumber });
      onMessagesChanged?.();
    } finally {
      setLoading(false);
    }
  }, [bookId, chapterNumber, groupId, onMessagesChanged]);

  useEffect(() => {
    if (visible) {
      void refresh();
    } else {
      setDraft("");
      setPlayingId(null);
    }
  }, [refresh, visible]);

  const voice = useChapterVoiceNote();

  const sendText = async () => {
    const body = draft.trim();
    if (!body || sending) {
      return;
    }
    setSending(true);
    try {
      await addTextMessage({
        groupId,
        bookId,
        chapterNumber,
        body,
      });
      setDraft("");
      await refresh();
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    } finally {
      setSending(false);
    }
  };

  const sendVoice = async () => {
    if (!voice.previewUri || sending) {
      return;
    }
    setSending(true);
    try {
      await addVoiceMessage({
        groupId,
        bookId,
        chapterNumber,
        voiceUri: voice.previewUri,
        voiceDurationSeconds: voice.recordedDurationMs / 1000,
      });
      voice.clearPreview();
      await refresh();
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    } finally {
      setSending(false);
    }
  };

  const playVoiceMessage = (message: ChapterMessage) => {
    if (!message.voiceUri) {
      return;
    }
    setPlayingId(message.id);
    voice.playMessageUri(message.voiceUri, message.voiceDurationSeconds);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/55" onPress={onClose}>
        <View className="mt-auto max-h-[88%] flex-1 justify-end px-2 pb-4 pt-10">
          <Pressable
            onPress={(event) => event.stopPropagation?.()}
            className="max-h-full overflow-hidden rounded-3xl bg-night-card"
          >
            <View className="border-b border-night-border px-4 py-3">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-bold text-night-text">
                    Chapter messages
                  </Text>
                  <Text className="mt-0.5 text-xs text-night-muted" numberOfLines={1}>
                    {journeyTitle} Together · Ch. {chapterNumber}
                  </Text>
                  <Text className="text-xs text-night-muted" numberOfLines={1}>
                    {chapterTitle}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close messages"
                  onPress={onClose}
                  className="items-center justify-center rounded-full bg-night-elevated"
                  style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET }}
                >
                  <MaterialIcons name="close" size={20} color={colors.text} />
                </Pressable>
              </View>
              <Text className="mt-2 text-xs leading-5 text-night-muted">
                {memberCount > 1
                  ? `${memberCount} people in your reading group. Leave a note after this chapter.`
                  : "Invite a friend to read together, then leave notes for each chapter."}
                {" "}
                Messages save on this device until group sync is enabled.
              </Text>
            </View>

            <View className="min-h-[220px] max-h-[340px]">
              {loading && messages.length === 0 ? (
                <View className="flex-1 items-center justify-center py-10">
                  <ActivityIndicator color={colors.accent} />
                </View>
              ) : (
                <FlatList
                  ref={listRef}
                  data={messages}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
                  ListEmptyComponent={
                    <Text className="py-8 text-center text-sm text-night-muted">
                      No messages yet. Say hello or record a voice note for your
                      reading partner.
                    </Text>
                  }
                  renderItem={({ item }) => (
                    <MessageBubble
                      message={item}
                      isPlaying={playingId === item.id && voice.isPlayingPreview}
                      onPlayVoice={() => playVoiceMessage(item)}
                    />
                  )}
                  onContentSizeChange={() => {
                    if (messages.length) {
                      listRef.current?.scrollToEnd({ animated: false });
                    }
                  }}
                />
              )}
            </View>

            {voice.showLimitHint ? (
              <View className="mx-4 mb-2 rounded-2xl bg-terracotta/15 px-3 py-2">
                <Text className="text-xs font-semibold text-terracotta">
                  You have up to 3 minutes to record
                </Text>
                <Text className="text-xs text-night-muted">
                  {formatClock(voice.durationMillis / 1000)} recorded ·{" "}
                  {formatClock(voice.remainingMillis / 1000)} left
                </Text>
              </View>
            ) : null}

            {voice.permissionDenied ? (
              <Text className="mx-4 mb-2 text-xs text-terracotta-dark">
                Microphone access is needed to record voice notes.
              </Text>
            ) : null}

            {voice.previewUri && !voice.isRecording ? (
              <View className="mx-4 mb-2 flex-row flex-wrap items-center gap-2 rounded-2xl bg-night-elevated px-3 py-2">
                <Text className="text-xs font-semibold text-night-text">
                  Voice note ready · {formatClock(voice.durationMillis / 1000)}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={voice.togglePreview}
                  className="rounded-full bg-night-card px-3 py-1.5"
                >
                  <Text className="text-xs font-bold text-night-text">
                    {voice.isPlayingPreview ? "Pause" : "Preview"}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={sending}
                  onPress={() => void sendVoice()}
                  className="rounded-full bg-terracotta px-3 py-1.5"
                >
                  <Text className="text-xs font-bold text-white">Send voice</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={voice.clearPreview}
                  className="rounded-full px-2 py-1.5"
                >
                  <Text className="text-xs font-semibold text-terracotta-dark">
                    Discard
                  </Text>
                </Pressable>
              </View>
            ) : null}

            <View className="border-t border-night-border px-3 py-3">
              <View className="flex-row items-end gap-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    voice.isRecording ? "Stop recording voice note" : "Record voice note"
                  }
                  accessibilityHint="You can record up to 3 minutes"
                  disabled={voice.isBusy || sending}
                  onPress={() => {
                    if (voice.isRecording) {
                      void voice.stopRecording();
                      return;
                    }
                    void voice.startRecording();
                  }}
                  className={`items-center justify-center rounded-full ${
                    voice.isRecording ? "bg-terracotta" : "bg-night-elevated"
                  }`}
                  style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET }}
                >
                  <MaterialIcons
                    name={voice.isRecording ? "stop" : "mic"}
                    size={22}
                    color={voice.isRecording ? "#FFFFFF" : colors.accent}
                  />
                </Pressable>

                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="Write a message…"
                  placeholderTextColor={colors.muted}
                  multiline
                  className="max-h-24 min-h-[44px] flex-1 rounded-2xl bg-night-elevated px-3 py-2.5 text-sm text-night-text"
                  style={{ color: colors.text }}
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Send message"
                  disabled={!draft.trim() || sending}
                  onPress={() => void sendText()}
                  className={`items-center justify-center rounded-full ${
                    draft.trim() ? "bg-terracotta" : "bg-night-elevated"
                  }`}
                  style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET }}
                >
                  {sending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <MaterialIcons
                      name="send"
                      size={20}
                      color={draft.trim() ? "#FFFFFF" : colors.muted}
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function MessageBubble({
  message,
  isPlaying,
  onPlayVoice,
}: {
  message: ChapterMessage;
  isPlaying: boolean;
  onPlayVoice: () => void;
}) {
  const isVoice = message.kind === "voice";

  return (
    <View className="mb-3">
      <Text className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-night-muted">
        {message.authorLabel}
      </Text>
      {isVoice ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Play voice note"
          onPress={onPlayVoice}
          className="flex-row items-center self-start rounded-2xl bg-night-elevated px-3 py-2.5"
        >
          <MaterialIcons
            name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
            size={28}
            color="#E4572E"
          />
          <Text className="ml-2 text-sm font-semibold text-night-text">
            Voice note · {formatClock(message.voiceDurationSeconds ?? 0)}
          </Text>
        </Pressable>
      ) : (
        <View className="self-start rounded-2xl bg-night-elevated px-3 py-2.5">
          <Text className="text-sm leading-5 text-night-text">{message.body}</Text>
        </View>
      )}
    </View>
  );
}
