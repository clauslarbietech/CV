import { Image, Platform, View, type ImageSourcePropType } from "react-native";

type Props = {
  source: ImageSourcePropType;
  width: number;
  accessibilityLabel?: string;
  /** Optional Ken-Burns / motion wrapper children instead of a plain Image. */
  children?: never;
};

/**
 * Story premise hero — taller than 16:9 so portrait comics keep heads in frame.
 * Cover is top-anchored (not center-cropped).
 */
export function premiseHeroHeight(width: number): number {
  // ~5:6 portrait-leaning frame; caps so phone screens still leave room for text.
  return Math.round(Math.min(width * 1.18, 460));
}

export default function PremiseHeroImage({
  source,
  width,
  accessibilityLabel,
}: Props) {
  const height = premiseHeroHeight(width);

  return (
    <View
      style={{
        width,
        height,
        overflow: "hidden",
        backgroundColor: "#1A1A1A",
      }}
    >
      {/*
        Native: oversized image pinned to top so cover crops the bottom, not faces.
        Web: object-position top for the same effect.
      */}
      <Image
        source={source}
        accessibilityLabel={accessibilityLabel}
        resizeMode="cover"
        style={[
          Platform.OS === "web"
            ? {
                width: "100%",
                height: "100%",
                // @ts-expect-error objectPosition is valid on react-native-web
                objectPosition: "center top",
              }
            : {
                position: "absolute",
                top: 0,
                left: 0,
                width,
                // Slightly taller than the frame → bottom crops first
                height: Math.round(height * 1.12),
              },
        ]}
      />
    </View>
  );
}
