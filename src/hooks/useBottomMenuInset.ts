import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Typical mobile browser / in-app browser bottom toolbar height. */
const WEB_BROWSER_CHROME_FLOOR = 56;

/**
 * Bottom padding so Home/Bible/Plans/More stays above home indicators
 * and mobile browser chrome (the bar that was covering the tab labels).
 */
export function useBottomMenuInset(): number {
  const insets = useSafeAreaInsets();
  const [visualOverlap, setVisualOverlap] = useState(0);
  const [isCompactWeb, setIsCompactWeb] = useState(
    Platform.OS === "web" &&
      typeof window !== "undefined" &&
      window.innerWidth <= 520
  );

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return;
    }

    const measure = () => {
      setIsCompactWeb(window.innerWidth <= 520);
      const viewport = window.visualViewport;
      if (!viewport) {
        setVisualOverlap(0);
        return;
      }
      // Pixels of layout viewport covered by browser UI at the bottom.
      const overlap = Math.max(
        0,
        window.innerHeight - (viewport.offsetTop + viewport.height)
      );
      setVisualOverlap(overlap);
    };

    measure();
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    window.addEventListener("resize", measure);
    return () => {
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  if (Platform.OS === "web") {
    const floor = isCompactWeb ? WEB_BROWSER_CHROME_FLOOR : 12;
    return Math.max(insets.bottom, visualOverlap, floor);
  }

  return Math.max(insets.bottom, 8);
}
