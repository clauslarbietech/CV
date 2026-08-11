import { Pressable, Text, View } from "react-native";
import { formatClock } from "../../data/library";

type Props = {
  isRecording: boolean;
  durationMillis: number;
  hasReflection: boolean;
  isPlayingReflection: boolean;
  permissionDenied: boolean;
  isBusy: boolean;
  onStart: () => void;
  onStop: () => void;
  onPlayToggle: () => void;
  onClear: () => void;
};

export default function VoiceReflectionRecorder({
  isRecording,
  durationMillis,
  hasReflection,
  isPlayingReflection,
  permissionDenied,
  isBusy,
  onStart,
  onStop,
  onPlayToggle,
  onClear,
}: Props) {
  return (
    <View className="mb-5 rounded-2xl border border-night-border bg-night-card px-4 py-4">
      <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-ochre-soft">
        Voice reflection
      </Text>
      <Text className="mb-3 text-sm leading-5 text-night-muted">
        Like Through the Word’s group messages — leave a short recorded note for
        this chapter and replay it anytime.
      </Text>

      {permissionDenied ? (
        <Text className="mb-3 text-sm text-terracotta-dark">
          Microphone permission is required to record a reflection.
        </Text>
      ) : null}

      <View className="flex-row flex-wrap items-center gap-2">
        {isRecording ? (
          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            onPress={onStop}
            className="rounded-full bg-terracotta px-4 py-2.5 active:bg-terracotta-dark"
          >
            <Text className="text-sm font-bold text-white">
              Stop · {formatClock(durationMillis / 1000)}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            onPress={onStart}
            className="rounded-full bg-night-elevated px-4 py-2.5 active:bg-night-border"
          >
            <Text className="text-sm font-bold text-white">
              {hasReflection ? "Re-record note" : "Record note"}
            </Text>
          </Pressable>
        )}

        {hasReflection && !isRecording ? (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={onPlayToggle}
              className="rounded-full border border-night-border px-4 py-2.5"
            >
              <Text className="text-sm font-bold text-night-text">
                {isPlayingReflection ? "Pause note" : "Play note"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onClear}
              className="rounded-full px-3 py-2.5"
            >
              <Text className="text-sm font-semibold text-terracotta-dark">
                Clear
              </Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}
