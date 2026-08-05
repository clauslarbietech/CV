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
 * Pix Bible wordmark — both words share the same bold weight and size.
 * Pix uses the orange brand accent; Bible uses ink (or parchment on cover).
 */
export default function BrandWordmark({
  size = "lg",
  centered = true,
  variant = "default",
}: Props) {
  const { colors } = useTheme();
  const wordClass =
    size === "lg" ? "text-[26px] leading-8 font-bold" : "text-xl leading-6 font-bold";

  const pixColor =
    variant === "cover" ? BRAND_COLORS.gold : colors.brand;
  const bibleColor =
    variant === "cover" ? BRAND_COLORS.parchment : colors.text;

  return (
    <View
      className={`flex-row items-center ${centered ? "justify-center" : ""}`}
      accessibilityRole="header"
      accessibilityLabel={BRAND.name}
    >
      <Text className={wordClass} style={{ color: pixColor }}>
        {BRAND.namePix}
      </Text>
      <Text className={`${wordClass} ml-1.5`} style={{ color: bibleColor }}>
        {BRAND.nameBible}
      </Text>
    </View>
  );
}
