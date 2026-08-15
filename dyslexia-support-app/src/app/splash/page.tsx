"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroBrand } from "@/components/hero/HeroShell";
import { SpeedHeroLogo } from "@/components/SpeedHeroLogo";

export default function SplashPage() {
  const router = useRouter();

  return (
    <div className="splash-screen splash-screen-enter">
      <div className="splash-glow" aria-hidden />
      <SpeedHeroLogo size={120} className="splash-speed-logo" title="Speed, HERO reading hero" />
      <HeroBrand />
      <p className="splash-tagline">Read differently. Learn differently. Be powerful.</p>
      <p className="splash-mission">Different minds. Powerful futures.</p>
      <p className="splash-note">
        Your personalized space for reading, listening, learning, and getting things done differently.
      </p>
      <div className="splash-actions">
        <button type="button" className="btn btn-white" onClick={() => router.push("/onboarding/mode")}>
          Get started
        </button>
        <Link href="/home" className="splash-skip">
          Skip to preview
        </Link>
      </div>
    </div>
  );
}
