import { Pressable, Text, View } from "react-native";
import { formatClock } from "../../data/library";

type Props = {
  title: string;
  narrator: string;
  position: number;
  duration: number;
  isPlaying: boolean;
  speed: number;
  downloaded: boolean;
  favorite: boolean;
  completed: boolean;
  onToggle: () => void;
  onSkip: (deltaSeconds: number) => void;
  onCycleSpeed: () => void;
  onToggleFavorite: () => void;
  onToggleComplete: () => void;
  onDownload: () => void;
};

export default function AudioGuidePlayer({
  title,
  narrator,
  position,
  duration,
  isPlaying,
  speed,
  downloaded,
  favorite,
  completed,
  onToggle,
  onSkip,
  onCycleSpeed,
  onToggleFavorite,
  onToggleComplete,
  onDownload,
}: Props) {
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <View className="border-t border-teal-deep/15 bg-white px-4 pb-3 pt-3">
      <View className="mb-2 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-teal-ink" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-sm text-teal-deep">{narrator}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change playback speed"
          onPress={onCycleSpeed}
          className="rounded-full bg-teal-mist px-3 py-1.5"
        >
          <Text className="text-xs font-bold text-teal-ink">{speed}x</Text>
        </Pressable>
      </View>

      <View className="mb-1 h-1.5 overflow-hidden rounded-full bg-teal-mist">
        <View
          className="h-full rounded-full bg-terracotta"
          style={{ width: `${progress * 100}%` }}
        />
      </View>
      <View className="mb-3 flex-row justify-between">
        <Text className="text-[11px] text-parchment-ink/60">
          {formatClock(position)}
        </Text>
        <Text className="text-[11px] text-parchment-ink/60">
          {formatClock(duration)}
        </Text>
      </View>

      <View className="mb-3 flex-row items-center justify-center gap-8">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip back 15 seconds"
          onPress={() => onSkip(-15)}
          className="h-11 w-11 items-center justify-center rounded-full border border-teal-deep/15"
        >
          <Text className="text-sm font-bold text-teal-ink">−15</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause narration" : "Play narration"}
          onPress={onToggle}
          className="h-16 w-16 items-center justify-center rounded-full bg-terracotta active:bg-terracotta-dark"
        >
          <Text className="text-xl font-bold text-white">
            {isPlaying ? "❚❚" : "▶"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip forward 15 seconds"
          onPress={() => onSkip(15)}
          className="h-11 w-11 items-center justify-center rounded-full border border-teal-deep/15"
        >
          <Text className="text-sm font-bold text-teal-ink">+15</Text>
        </Pressable>
      </View>

      <View className="flex-row justify-between">
        <Pressable
          accessibilityRole="button"
          onPress={onDownload}
          className="rounded-full px-2 py-1"
        >
          <Text className="text-xs font-semibold text-teal-deep">
            {downloaded ? "Downloaded" : "Download"}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleFavorite}
          className="rounded-full px-2 py-1"
        >
          <Text className="text-xs font-semibold text-teal-deep">
            {favorite ? "Favorited" : "Favorite"}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleComplete}
          className="rounded-full px-2 py-1"
        >
          <Text className="text-xs font-semibold text-teal-deep">
            {completed ? "Completed" : "Mark done"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
