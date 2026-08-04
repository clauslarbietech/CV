import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
 * Uses Google Material Icons (volume_up / stop) — not emoji.
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
        className={`h-12 w-12 items-center justify-center rounded-full ${
          isPlaying ? "bg-terracotta" : "bg-black/75"
        }`}
        hitSlop={10}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <MaterialIcons
          name={isPlaying ? "stop" : "volume-up"}
          size={26}
          color="#FFFFFF"
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
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
      className={`flex-row items-center rounded-full px-4 py-3 ${
        isPlaying ? "bg-terracotta" : "bg-teal-ink"
      }`}
    >
      <View className="mr-2.5 h-9 w-9 items-center justify-center rounded-full bg-white/15">
        <MaterialIcons
          name={isPlaying ? "stop" : "volume-up"}
          size={22}
          color="#FFFFFF"
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </View>
      <View className="flex-1 pr-1">
        <Text className="text-xs font-bold text-white">
          {isPlaying
            ? "Stop reading"
            : label ?? "Hear this scene read aloud"}
        </Text>
        {!isPlaying ? (
          <Text className="mt-0.5 text-[10px] text-white/65">
            Scripture + speech · great for kids who can’t read yet
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
