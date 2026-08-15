"use client";

import { useEffect } from "react";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { applyAccessibilityPrefs } from "@/lib/hero/accessibility";

export function HeroAccessibilityProvider() {
  const profile = useHeroProfile();

  useEffect(() => {
    applyAccessibilityPrefs(profile.accessibility);
  }, [profile.accessibility]);

  return null;
}
