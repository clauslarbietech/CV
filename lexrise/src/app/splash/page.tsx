"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroBrand } from "@/components/hero/HeroShell";

export default function SplashPage() {
  const router = useRouter();

  return (
    <div className="splash-screen">
      <div className="splash-glow" aria-hidden />
      <HeroBrand />
      <p className="splash-tagline">Read differently. Learn differently. Be powerful.</p>
      <p className="splash-mission">Different minds. Powerful futures.</p>
      <p className="splash-note">Your personalized space for reading, listening, learning, and getting things done differently.</p>
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
