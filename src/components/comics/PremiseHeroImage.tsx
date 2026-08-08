import {
  Image,
  View,
  type ImageSourcePropType,
} from "react-native";
import { framedImageHeight, imageAspectRatio } from "../../utils/imageAspect";

type Props = {
  source: ImageSourcePropType;
  width: number;
  /** Optional fixed frame height; image is contained inside (never stretched). */
  frameHeight?: number;
  accessibilityLabel?: string;
};

/**
 * Full-view story premise — never crops faces or stretches art.
 * Frame follows the art’s real aspect ratio; image uses contain.
 */
export function premiseHeroHeight(
  width: number,
  source?: ImageSourcePropType
): number {
  return framedImageHeight(width, source);
}

export default function PremiseHeroImage({
  source,
  width,
  frameHeight,
  accessibilityLabel,
}: Props) {
  const naturalHeight = premiseHeroHeight(width, source);
  const height = frameHeight ?? naturalHeight;
  const aspect = imageAspectRatio(source);
  // Fit inside the frame without stretching — letterbox if needed.
  const fittedWidth = Math.min(width, height / aspect);
  const fittedHeight = Math.min(height, width * aspect);

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: "#1A1A1A",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Image
        source={source}
        accessibilityLabel={accessibilityLabel}
        resizeMode="contain"
        style={{
          width: Math.round(fittedWidth),
          height: Math.round(fittedHeight),
        }}
      />
    </View>
  );
}
