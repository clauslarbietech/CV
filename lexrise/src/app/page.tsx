"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/hero/store";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    const profile = getProfile();
    if (!profile.onboardingComplete) {
      router.replace("/splash");
      return;
    }
    router.replace("/home");
  }, [router]);

  return <p className="splash-note">Loading HERO…</p>;
}
