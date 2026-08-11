import { useRef, useState } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import VoiceCarousel from "../bible/VoiceCarousel";
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
  messageCount?: number;
  onOpenMessages?: () => void;
  narratorVoiceId?: string | null;
  onSelectVoice?: (voiceId: string | null) => void;
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
 * Compact chapter transport for every Bible journey:
 * voice carousel, speed, scrub, Back / Play / Next.
 */
export default function AudioGuidePlayer({
  title,
  subtitle,
  position,
  duration,
  isPlaying,
  speed,
  favorite,
  messageCount = 0,
  onOpenMessages,
  narratorVoiceId = null,
  onSelectVoice,
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
  const [voiceMenuOpen, setVoiceMenuOpen] = useState(false);
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;
  const trackWidth = useRef(1);
  const speedLabel =
    Math.abs(speed - 1) < 0.01 ? "1x" : `${Number(speed.toFixed(2))}x`;

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
    <View
      accessibilityRole="toolbar"
      accessibilityLabel="Journey audio guide controls"
      className="border-t border-night-border bg-night-card px-4 pb-3 pt-3"
    >
      <View className="mb-2 flex-row items-center justify-between">
        <View className="min-w-0 flex-1 pr-2">
          <Text className="text-base font-bold text-night-text" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-xs text-night-muted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {onSelectVoice ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose narrator voice"
            accessibilityState={{ expanded: voiceMenuOpen }}
            accessibilityHint="Shows a swipeable list of narrator voices"
            onPress={() => setVoiceMenuOpen((open) => !open)}
            className="mr-2 items-center justify-center rounded-full"
            style={{
              minWidth: MIN_TOUCH_TARGET,
              minHeight: MIN_TOUCH_TARGET,
              backgroundColor: voiceMenuOpen ? colors.accent : colors.elevated,
            }}
          >
            <MaterialIcons
              name="record-voice-over"
              size={20}
              color={voiceMenuOpen ? "#FFFFFF" : colors.text}
            />
          </Pressable>
        ) : null}

        {onOpenMessages ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Chapter messages"
            accessibilityHint="Open chat and voice notes for this chapter"
            onPress={onOpenMessages}
            className="relative mr-2 items-center justify-center rounded-full bg-night-elevated"
            style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET }}
          >
            <MaterialIcons name="chat-bubble-outline" size={20} color={colors.text} />
            {messageCount > 0 ? (
              <View
                className="absolute -right-0.5 -top-0.5 min-w-[16px] items-center justify-center rounded-full bg-terracotta px-1"
                style={{ minHeight: 16 }}
              >
                <Text className="text-[10px] font-bold text-white">
                  {messageCount > 9 ? "9+" : messageCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}

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
          accessibilityLabel={`Playback speed ${speedLabel}. Tap to change.`}
          accessibilityHint="Cycles through slower and faster reading speeds"
          onPress={onCycleSpeed}
          className="items-center justify-center rounded-full bg-night-elevated px-4"
          style={{ minHeight: MIN_TOUCH_TARGET, minWidth: MIN_TOUCH_TARGET }}
        >
          <Text className="text-sm font-bold text-night-text" allowFontScaling>
            {speedLabel}
          </Text>
        </Pressable>
      </View>

      {onSelectVoice ? (
        <VoiceCarousel
          visible={voiceMenuOpen}
          selectedVoiceId={narratorVoiceId}
          accentColor={colors.accent}
          surfaceColor={colors.elevated}
          textColor={colors.text}
          mutedColor={colors.muted}
          onSelect={(nextId) => {
            onSelectVoice(nextId);
          }}
        />
      ) : null}

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
          style={{ minHeight: MIN_TOUCH_TARGET }}
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
          style={{ minHeight: MIN_TOUCH_TARGET }}
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
