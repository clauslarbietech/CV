import type { Metadata } from "next";
import Link from "next/link";
import { GamesHub } from "@/components/GamesHub";

export const metadata: Metadata = {
  title: "Games",
  description: "Phonics unscramble, letter flip, nonsense decoding, and a myth-busting scramble challenge.",
};

export default function GamesPage() {
  return (
    <section className="section">
      <div className="site-shell">
        <h1 className="section-title">Reading & phonics games</h1>
        <p className="section-lead">
          Play short rounds that build sound–letter mapping. Looking for more? See researched tools on the{" "}
          <Link href="/research" className="font-semibold text-[var(--teal)] underline-offset-4 hover:underline">
            Research
          </Link>{" "}
          page—including Nonsense!, Nessy, Starfall, and a VR empathy game.
        </p>
        <GamesHub />
      </div>
    </section>
  );
}
