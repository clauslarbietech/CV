import { useRef } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatClock } from "../../data/library";
import { MIN_TOUCH_TARGET } from "../../theme/a11y";
import { useTheme } from "../../theme/ThemeProvider";

type Props = {
  title: string;
  subtitle?: string;
  position: number;
  duration: number;
  isPlaying: boolean;
  speed: number;
  favorite: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onToggle: () => void;
  onSeek: (seconds: number) => void;
  onCycleSpeed: () => void;
  onToggleFavorite: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

/**
 * Compact chapter transport:
 * scrub the play line to seek; orange Back / Next for chapters (no ±15).
 */
export default function AudioGuidePlayer({
  title,
  subtitle,
  position,
  duration,
  isPlaying,
  speed,
  favorite,
  hasPrevious,
  hasNext,
  onToggle,
  onSeek,
  onCycleSpeed,
  onToggleFavorite,
  onPrevious,
  onNext,
}: Props) {
  const { colors } = useTheme();
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;
  const trackWidth = useRef(1);

  const seekFromEvent = (event: GestureResponderEvent) => {
    if (duration <= 0) {
      return;
    }
    const x = Math.max(0, Math.min(trackWidth.current, event.nativeEvent.locationX));
    onSeek((x / trackWidth.current) * duration);
  };

  const onTrackLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = Math.max(1, event.nativeEvent.layout.width);
  };

  return (
    <View className="border-t border-night-border bg-night-card px-4 pb-3 pt-3">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-night-text" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-xs text-night-muted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={favorite ? "Remove favorite" : "Favorite chapter"}
          onPress={onToggleFavorite}
          className="mr-2 items-center justify-center rounded-full bg-night-elevated"
          style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET }}
        >
          <MaterialIcons
            name={favorite ? "star" : "star-border"}
            size={20}
            color={favorite ? colors.accent : colors.muted}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change playback speed"
          onPress={onCycleSpeed}
          className="items-center justify-center rounded-full bg-night-elevated px-4"
          style={{ minHeight: MIN_TOUCH_TARGET }}
        >
          <Text className="text-sm font-bold text-night-text" allowFontScaling>
            {speed}x
          </Text>
        </Pressable>
      </View>

      {/* Scrubbable play line — drag/tap to seek */}
      <View
        accessibilityRole="adjustable"
        accessibilityLabel="Playback position"
        accessibilityHint="Drag left or right to rewind or fast forward"
        className="mb-1 justify-center py-2"
        onLayout={onTrackLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={seekFromEvent}
        onResponderMove={seekFromEvent}
      >
        <View className="h-1.5 overflow-hidden rounded-full bg-night-elevated">
          <View
            className="h-full rounded-full bg-terracotta"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
        <View
          pointerEvents="none"
          className="absolute h-3.5 w-3.5 rounded-full bg-terracotta"
          style={{
            left: `${progress * 100}%`,
            marginLeft: -7,
            top: "50%",
            marginTop: -7,
          }}
        />
      </View>
      <View className="mb-3 flex-row justify-between">
        <Text className="text-xs text-night-muted" allowFontScaling>
          {formatClock(position)}
        </Text>
        <Text className="text-xs text-night-muted" allowFontScaling>
          {formatClock(duration)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous chapter"
          disabled={!hasPrevious}
          onPress={onPrevious}
          className={`min-w-[88px] flex-1 items-center rounded-full px-3 py-3 ${
            hasPrevious ? "bg-terracotta" : "bg-night-elevated"
          }`}
        >
          <Text
            className="text-sm font-bold"
            style={{
              color: hasPrevious ? "#FFFFFF" : colors.muted,
            }}
            allowFontScaling
          >
            ← Back
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause narration" : "Play narration"}
          onPress={onToggle}
          className="h-14 w-14 items-center justify-center rounded-full bg-terracotta active:bg-terracotta-dark"
        >
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={32}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next chapter"
          disabled={!hasNext}
          onPress={onNext}
          className={`min-w-[88px] flex-1 items-center rounded-full px-3 py-3 ${
            hasNext ? "bg-terracotta" : "bg-night-elevated"
          }`}
        >
          <Text
            className="text-sm font-bold"
            style={{
              color: hasNext ? "#FFFFFF" : colors.muted,
            }}
            allowFontScaling
          >
            Next →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
