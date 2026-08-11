import { useEffect } from "react";
import { View } from "react-native";
import Svg, { Path, Rect, G } from "react-native-svg";

type Props = {
  size?: number;
  /** Page fill — parchment on dark cover, ink on light surfaces */
  pageColor?: string;
  accentColor?: string;
  illustrationColors?: [string, string, string];
};

/**
 * Timeless PixBible mark: open Bible with an illustrated page peeking out.
 * Vector fallback when raster assets are unavailable.
 */
export default function PixBibleLogoMark({
  size = 120,
  pageColor = "#F7F4EF",
  accentColor = "#D4A017",
  illustrationColors = ["#E4572E", "#D4A017", "#2A6F7F"],
}: Props) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <G>
          {/* Left page */}
          <Path
            d="M24 32 C24 32 22 88 48 92 C48 92 50 36 50 32 C50 28 28 28 24 32 Z"
            fill={pageColor}
            opacity={0.95}
          />
          {/* Right page */}
          <Path
            d="M96 32 C96 32 98 88 72 92 C72 92 70 36 70 32 C70 28 92 28 96 32 Z"
            fill={pageColor}
            opacity={0.88}
          />
          {/* Illustrated page peek */}
          <Rect
            x="46"
            y="38"
            width="22"
            height="36"
            rx="3"
            fill={pageColor}
          />
          <Rect x="48" y="42" width="18" height="7" rx="1" fill={illustrationColors[1]} opacity={0.85} />
          <Rect x="48" y="51" width="18" height="7" rx="1" fill={illustrationColors[0]} opacity={0.75} />
          <Rect x="48" y="60" width="18" height="7" rx="1" fill={illustrationColors[2]} opacity={0.8} />
          {/* Spine / trust line */}
          <Path
            d="M58 30 L62 30 L62 94 L58 94 Z"
            fill={accentColor}
            opacity={0.9}
          />
          {/* Soft outer ring suggestion */}
          <Path
            d="M60 14 A46 46 0 1 1 59.99 14"
            stroke={accentColor}
            strokeWidth={1.5}
            fill="none"
            opacity={0.35}
          />
        </G>
      </Svg>
    </View>
  );
}
