import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import { MIN_TOUCH_TARGET } from "../../theme/a11y";
import { useTheme } from "../../theme/ThemeProvider";
import {
  listSpeechVoices,
  type SpeechVoiceOption,
} from "../../services/speechPreferences";

type Props = {
  visible: boolean;
  selectedVoiceId: string | null;
  onClose: () => void;
  onSelect: (voiceId: string | null, voiceName: string | null) => void;
};

export default function VoicePickerModal({
  visible,
  selectedVoiceId,
  onClose,
  onSelect,
}: Props) {
  const { colors } = useTheme();
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    void listSpeechVoices().then((items) => {
      if (!cancelled) {
        setVoices(items);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [visible]);

  const preview = (voice: SpeechVoiceOption | null) => {
    void Speech.stop();
    Speech.speak(
      voice
        ? `Hello from ${voice.name}. This is how I sound when reading Scripture.`
        : "Hello. This is the default system voice for reading Scripture.",
      {
        rate: 0.9,
        ...(voice ? { voice: voice.identifier } : {}),
      }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/55" onPress={onClose}>
        <View className="mt-auto max-h-[80%] px-2 pb-4 pt-10">
          <Pressable
            onPress={(event) => event.stopPropagation?.()}
            className="max-h-full overflow-hidden rounded-3xl bg-night-card"
          >
            <View className="flex-row items-center justify-between border-b border-night-border px-4 py-3">
              <View className="flex-1 pr-3">
                <Text className="text-base font-bold text-night-text">
                  Narrator voice
                </Text>
                <Text className="text-xs text-night-muted">
                  Choose a built-in voice from this device
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close voice picker"
                onPress={onClose}
                className="items-center justify-center rounded-full bg-night-elevated"
                style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET }}
              >
                <MaterialIcons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            {loading ? (
              <View className="items-center py-12">
                <ActivityIndicator color={colors.accent} />
              </View>
            ) : (
              <FlatList
                data={voices}
                keyExtractor={(item) => item.identifier}
                contentContainerStyle={{ paddingBottom: 12 }}
                ListHeaderComponent={
                  <VoiceRow
                    label="System default"
                    detail="Uses your device’s default narrator"
                    selected={!selectedVoiceId}
                    onPress={() => {
                      onSelect(null, null);
                      preview(null);
                    }}
                    onPreview={() => preview(null)}
                  />
                }
                ListEmptyComponent={
                  <Text className="px-4 py-8 text-center text-sm text-night-muted">
                    No alternate voices were found on this device. The system
                    default voice will be used.
                  </Text>
                }
                renderItem={({ item }) => (
                  <VoiceRow
                    label={item.name}
                    detail={item.language}
                    selected={selectedVoiceId === item.identifier}
                    onPress={() => {
                      onSelect(item.identifier, item.name);
                      preview(item);
                    }}
                    onPreview={() => preview(item)}
                  />
                )}
              />
            )}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function VoiceRow({
  label,
  detail,
  selected,
  onPress,
  onPreview,
}: {
  label: string;
  detail: string;
  selected: boolean;
  onPress: () => void;
  onPreview: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className="flex-row items-center border-b border-night-border/50 px-4 py-3"
      style={{
        backgroundColor: selected ? "rgba(228,87,46,0.12)" : "transparent",
      }}
    >
      <View className="flex-1 pr-2">
        <Text className="text-sm font-bold text-night-text">{label}</Text>
        <Text className="text-xs text-night-muted">{detail}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Preview ${label}`}
        onPress={onPreview}
        className="mr-2 items-center justify-center rounded-full bg-night-elevated"
        style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET }}
      >
        <MaterialIcons name="volume-up" size={18} color={colors.accent} />
      </Pressable>
      {selected ? (
        <MaterialIcons name="check-circle" size={22} color={colors.accent} />
      ) : (
        <MaterialIcons name="radio-button-unchecked" size={22} color={colors.muted} />
      )}
    </Pressable>
  );
}
