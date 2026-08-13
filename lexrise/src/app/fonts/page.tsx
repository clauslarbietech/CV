import type { Metadata } from "next";
import { FontLab } from "@/components/FontLab";

export const metadata: Metadata = {
  title: "Font Lab",
  description: "Tune fonts, spacing, and contrast for more comfortable dyslexia-friendly reading.",
};

export default function FontsPage() {
  return (
    <section className="section">
      <div className="site-shell">
        <h1 className="section-title">Font Lab</h1>
        <p className="section-lead">
          Special “dyslexia fonts” get a lot of hype. Evidence is mixed—extra letter and word spacing often matters
          more. Dial in what works for your eyes.
        </p>
        <FontLab />
      </div>
    </section>
  );
}
