/** Highlight swatches — YouVersion-style reader colors. */
export const HIGHLIGHT_COLORS = [
  { id: "green", hex: "#34C759", label: "Green" },
  { id: "pink", hex: "#FF2D55", label: "Pink" },
  { id: "orange", hex: "#FF9F0A", label: "Orange" },
  { id: "blue", hex: "#64D2FF", label: "Blue" },
] as const;

export type HighlightColorId = (typeof HIGHLIGHT_COLORS)[number]["id"];

export function highlightHex(id?: string): string {
  return HIGHLIGHT_COLORS.find((color) => color.id === id)?.hex ?? "#FF9F0A";
}
