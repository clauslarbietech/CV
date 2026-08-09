import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as Speech from "expo-speech";

import {
  listSpeechVoices,
  type SpeechVoiceOption,
} from "../../services/speechPreferences";

type Props = {
  visible: boolean;
  selectedVoiceId: string | null;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  onSelect: (voiceId: string | null, voiceName: string | null) => void;
};

/**
 * Horizontal voice carousel that expands under the voice icon.
 */
export default function VoiceCarousel({
  visible,
  selectedVoiceId,
  accentColor,
  surfaceColor,
  textColor,
  mutedColor,
  onSelect,
}: Props) {
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

  if (!visible) {
    return null;
  }

  const previewAndSelect = (voice: SpeechVoiceOption | null) => {
    void Speech.stop();
    onSelect(voice?.identifier ?? null, voice?.name ?? null);
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
    <View className="mb-2">
      <Text
        className="mb-1.5 px-0.5 text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: mutedColor }}
      >
        Narrator voice · swipe
      </Text>
      {loading ? (
        <ActivityIndicator color={accentColor} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 4 }}
        >
          <VoiceChip
            label="Default"
            selected={!selectedVoiceId}
            accentColor={accentColor}
            surfaceColor={surfaceColor}
            textColor={textColor}
            onPress={() => previewAndSelect(null)}
          />
          {voices.map((voice) => (
            <VoiceChip
              key={voice.identifier}
              label={voice.name}
              selected={selectedVoiceId === voice.identifier}
              accentColor={accentColor}
              surfaceColor={surfaceColor}
              textColor={textColor}
              onPress={() => previewAndSelect(voice)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function VoiceChip({
  label,
  selected,
  accentColor,
  surfaceColor,
  textColor,
  onPress,
}: {
  label: string;
  selected: boolean;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Narrator voice ${label}`}
      onPress={onPress}
      className="h-10 max-w-[160px] items-center justify-center rounded-full px-3"
      style={{
        backgroundColor: selected ? accentColor : surfaceColor,
      }}
    >
      <Text
        className="text-xs font-bold"
        numberOfLines={1}
        style={{ color: selected ? "#FFFFFF" : textColor }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
