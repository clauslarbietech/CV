"use client";

import { useSyncExternalStore } from "react";
import { getProfile, subscribeHero } from "@/lib/hero/store";
import type { HeroProfile } from "@/lib/hero/types";
import { DEFAULT_PROFILE } from "@/lib/hero/types";

export function useHeroProfile(): HeroProfile {
  return useSyncExternalStore(subscribeHero, getProfile, () => DEFAULT_PROFILE);
}
