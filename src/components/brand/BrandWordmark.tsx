import { Text, View } from "react-native";
import { BRAND, BRAND_COLORS } from "../../content/brand";

type Props = {
  size?: "sm" | "lg";
  centered?: boolean;
  /** Light text on navy cover splash */
  variant?: "default" | "cover";
};

/**
 * Pix (creative) + BIBLE (traditional) wordmark — premium storytelling, not cartoon.
 */
export default function BrandWordmark({
  size = "lg",
  centered = true,
  variant = "default",
}: Props) {
  const pixClass =
    size === "lg" ? "text-[26px] leading-8" : "text-xl leading-6";
  const bibleClass =
    size === "lg" ? "text-[26px] leading-8" : "text-xl leading-6";

  const pixColor =
    variant === "cover" ? BRAND_COLORS.gold : undefined;
  const bibleColor =
    variant === "cover" ? BRAND_COLORS.parchment : undefined;

  return (
    <View
      className={`flex-row items-baseline ${centered ? "justify-center" : ""}`}
    >
      <Text
        className={`${pixClass} font-bold italic ${variant === "cover" ? "" : "text-ochre"}`}
        style={pixColor ? { color: pixColor } : undefined}
        accessibilityLabel={BRAND.name}
      >
        {BRAND.namePix}
      </Text>
      <Text
        className={`${bibleClass} font-bold tracking-[2.5px] ${variant === "cover" ? "" : "text-night-text"}`}
        style={bibleColor ? { color: bibleColor } : undefined}
      >
        {BRAND.nameBible}
      </Text>
    </View>
  );
}
