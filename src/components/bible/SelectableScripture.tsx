import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { highlightHex } from "../../theme/highlightColors";
import { readerColors } from "../../theme/readerColors";

export type ScriptureSegment = {
  id: string;
  text: string;
};

export type AppliedHighlight = {
  segmentId: string;
  colorId: string;
  excerpt: string;
};

type Props = {
  text: string;
  selectedId: string | null;
  highlights: AppliedHighlight[];
  onSelect: (segment: ScriptureSegment) => void;
};

/** Split chapter text into tappable verse/paragraph segments. */
export function splitScriptureSegments(text: string): ScriptureSegment[] {
  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }
  const byBreak = trimmed
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (byBreak.length > 1) {
    return byBreak.map((part, index) => ({
      id: `seg-${index}`,
      text: part,
    }));
  }
  // Single block — split on verse-like "1 " / "2 " markers when present.
  const verseParts = trimmed.split(/(?=\b\d{1,3}\s)/).filter((part) => part.trim());
  if (verseParts.length > 1) {
    return verseParts.map((part, index) => ({
      id: `seg-${index}`,
      text: part.trim(),
    }));
  }
  // Fallback: chunk long paragraphs (~2 sentences) for easier selection.
  const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [trimmed];
  const chunks: string[] = [];
  let buffer = "";
  for (const sentence of sentences) {
    const next = `${buffer}${sentence}`.trim();
    if (next.length > 160 && buffer) {
      chunks.push(buffer.trim());
      buffer = sentence;
    } else {
      buffer = next;
    }
  }
  if (buffer.trim()) {
    chunks.push(buffer.trim());
  }
  return chunks.map((part, index) => ({
    id: `seg-${index}`,
    text: part,
  }));
}

/**
 * Tappable scripture — select a segment to open highlight / save / note / copy.
 */
export default function SelectableScripture({
  text,
  selectedId,
  highlights,
  onSelect,
}: Props) {
  const segments = useMemo(() => splitScriptureSegments(text), [text]);
  const highlightBySegment = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of highlights) {
      map.set(item.segmentId, item.colorId);
    }
    return map;
  }, [highlights]);

  if (!segments.length) {
    return (
      <Text className="text-[18px] leading-8" style={{ color: readerColors.text }}>
        {text}
      </Text>
    );
  }

  return (
    <View>
      {segments.map((segment) => {
        const selected = selectedId === segment.id;
        const colorId = highlightBySegment.get(segment.id);
        const underline = colorId ? highlightHex(colorId) : undefined;
        return (
          <Pressable
            key={segment.id}
            accessibilityRole="button"
            accessibilityLabel="Select scripture to highlight or save"
            onPress={() => onSelect(segment)}
            className="mb-2 rounded-xl px-1 py-1"
            style={{
              backgroundColor: selected
                ? "rgba(255,255,255,0.08)"
                : "transparent",
            }}
          >
            <Text
              className="text-[18px] leading-8"
              style={{
                color: readerColors.text,
                textDecorationLine: underline || selected ? "underline" : "none",
                textDecorationColor: underline ?? "rgba(255,255,255,0.55)",
                textDecorationStyle: selected && !underline ? "dotted" : "solid",
              }}
            >
              {segment.text}
            </Text>
          </Pressable>
        );
      })}
      <Text className="mt-2 text-[11px]" style={{ color: readerColors.faint }}>
        Tap a verse or paragraph to highlight, save, note, or copy
      </Text>
    </View>
  );
}
