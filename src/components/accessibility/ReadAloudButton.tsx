import { Pressable, Text, View } from "react-native";

type Props = {
  isPlaying: boolean;
  onPress: () => void;
  /** Compact icon-only control for overlay on panels. */
  compact?: boolean;
  label?: string;
  accessibilityHint?: string;
};

/**
 * Accessibility read-aloud control for non-readers.
 * Speaks scripture + dialogue via expo-speech when pressed.
 */
export default function ReadAloudButton({
  isPlaying,
  onPress,
  compact = false,
  label,
  accessibilityHint = "Speaks all text on this scene out loud for non-readers",
}: Props) {
  if (compact) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isPlaying ? "Stop reading aloud" : "Read all text aloud"
        }
        accessibilityHint={accessibilityHint}
        accessibilityState={{ selected: isPlaying }}
        onPress={onPress}
        className={`h-11 w-11 items-center justify-center rounded-full ${
          isPlaying ? "bg-terracotta" : "bg-black/75"
        }`}
        hitSlop={8}
      >
        <Text className="text-lg text-white" accessibilityElementsHidden>
          {isPlaying ? "⏹" : "🔊"}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isPlaying
          ? "Stop reading aloud"
          : label ?? "Read scripture and speech aloud"
      }
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected: isPlaying }}
      onPress={onPress}
      className={`flex-row items-center rounded-full px-4 py-2.5 ${
        isPlaying ? "bg-terracotta" : "bg-teal-ink"
      }`}
    >
      <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-white/15">
        <Text className="text-base text-white" accessibilityElementsHidden>
          {isPlaying ? "⏹" : "🔊"}
        </Text>
      </View>
      <Text className="text-xs font-bold text-white">
        {isPlaying
          ? "Stop reading"
          : label ?? "Read aloud · scripture & speech"}
      </Text>
    </Pressable>
  );
}
