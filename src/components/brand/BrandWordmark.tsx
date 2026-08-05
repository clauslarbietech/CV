import { Text, View } from "react-native";
import { BRAND } from "../../content/brand";

type Props = {
  size?: "sm" | "lg";
  centered?: boolean;
};

/**
 * Pix (creative) + BIBLE (traditional) wordmark — premium storytelling, not cartoon.
 */
export default function BrandWordmark({ size = "lg", centered = true }: Props) {
  const pixClass =
    size === "lg" ? "text-[26px] leading-8" : "text-xl leading-6";
  const bibleClass =
    size === "lg" ? "text-[26px] leading-8" : "text-xl leading-6";

  return (
    <View
      className={`flex-row items-baseline ${centered ? "justify-center" : ""}`}
    >
      <Text
        className={`${pixClass} font-bold italic text-ochre`}
        accessibilityLabel={BRAND.name}
      >
        {BRAND.namePix}
      </Text>
      <Text
        className={`${bibleClass} font-bold tracking-[2.5px] text-night-text`}
      >
        {BRAND.nameBible}
      </Text>
    </View>
  );
}
