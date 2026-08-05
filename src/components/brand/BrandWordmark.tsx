import { Text, View } from "react-native";
import { BRAND, BRAND_COLORS } from "../../content/brand";
import { useTheme } from "../../theme/ThemeProvider";

type Props = {
  size?: "sm" | "lg";
  centered?: boolean;
  /** Light text on navy cover splash */
  variant?: "default" | "cover";
};

/**
 * Pix (orange) + BIBLE (ink) — matches Through-the-Word orange brand accent.
 */
export default function BrandWordmark({
  size = "lg",
  centered = true,
  variant = "default",
}: Props) {
  const { colors } = useTheme();
  const pixClass =
    size === "lg" ? "text-[26px] leading-8" : "text-xl leading-6";
  const bibleClass =
    size === "lg" ? "text-[26px] leading-8" : "text-xl leading-6";

  const pixColor =
    variant === "cover" ? BRAND_COLORS.gold : colors.brand;
  const bibleColor =
    variant === "cover" ? BRAND_COLORS.parchment : colors.text;

  return (
    <View
      className={`flex-row items-baseline ${centered ? "justify-center" : ""}`}
    >
      <Text
        className={`${pixClass} font-bold italic`}
        style={{ color: pixColor }}
        accessibilityLabel={BRAND.name}
      >
        {BRAND.namePix}
      </Text>
      <Text
        className={`${bibleClass} font-bold tracking-[2.5px]`}
        style={{ color: bibleColor }}
      >
        {BRAND.nameBible}
      </Text>
    </View>
  );
}
