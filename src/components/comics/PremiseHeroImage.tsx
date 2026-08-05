import {
  Image,
  View,
  type ImageSourcePropType,
} from "react-native";

type Props = {
  source: ImageSourcePropType;
  width: number;
  accessibilityLabel?: string;
};

/**
 * Full-view story premise — never crops faces.
 * Uses contain + a frame sized to the art’s real aspect ratio.
 */
export function premiseHeroHeight(
  width: number,
  source?: ImageSourcePropType
): number {
  if (typeof source === "number") {
    const resolved = Image.resolveAssetSource(source);
    if (resolved?.width && resolved?.height && resolved.width > 0) {
      const aspect = resolved.height / resolved.width;
      // Fit the full image; soft cap so very tall art doesn’t dominate the phone.
      return Math.round(Math.min(width * aspect, width * 1.45, 580));
    }
  }
  // Default portrait comic frame (~4:5) when dimensions are unknown.
  return Math.round(Math.min(width * 1.25, 520));
}

export default function PremiseHeroImage({
  source,
  width,
  accessibilityLabel,
}: Props) {
  const height = premiseHeroHeight(width, source);

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: "#1A1A1A",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={source}
        accessibilityLabel={accessibilityLabel}
        resizeMode="contain"
        style={{ width, height }}
      />
    </View>
  );
}
