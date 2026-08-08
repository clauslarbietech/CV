import { Image, type ImageSourcePropType } from "react-native";

/**
 * Natural height/width ratio for a bundled image asset.
 * Falls back to a mild portrait comic ratio when unknown.
 */
export function imageAspectRatio(
  source?: ImageSourcePropType,
  fallback = 1.25
): number {
  if (typeof source === "number") {
    const resolved = Image.resolveAssetSource(source);
    if (resolved?.width && resolved?.height && resolved.width > 0) {
      return resolved.height / resolved.width;
    }
  }
  return fallback;
}

/** Frame height that preserves aspect, with soft phone-friendly caps. */
export function framedImageHeight(
  width: number,
  source?: ImageSourcePropType,
  options?: { maxAspect?: number; maxHeight?: number; fallbackAspect?: number }
): number {
  const maxAspect = options?.maxAspect ?? 1.45;
  const maxHeight = options?.maxHeight ?? 580;
  const aspect = Math.min(
    imageAspectRatio(source, options?.fallbackAspect ?? 1.25),
    maxAspect
  );
  return Math.round(Math.min(width * aspect, maxHeight));
}
