import Link from "next/link";
import { TrainingTopBar } from "@/components/AppShell";

const items = [
  {
    href: "/accomplishments",
    kicker: "Inspiration",
    title: "Accomplishments",
    body: "People with dyslexia who changed business, science, sports, and art.",
  },
  {
    href: "/research",
    kicker: "Learn",
    title: "Research & tools",
    body: "What evidence says about fonts, phonics, and the scramble myth.",
  },
  {
    href: "/fonts",
    kicker: "Comfort",
    title: "Font Lab",
    body: "Tune Lexend, OpenDyslexic, size, and spacing for easier reading.",
  },
  {
    href: "/session",
    kicker: "Practice",
    title: "Training games",
    body: "Unscramble, letter flip, nonsense decode, and scramble challenge.",
  },
];

export default function ExplorePage() {
  return (
    <>
      <TrainingTopBar />
      <h1 style={{ margin: "8px 0 6px", fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>Explore</h1>
      <p style={{ margin: "0 0 18px", color: "var(--ink-muted)", fontSize: 15, lineHeight: 1.4 }}>
        Inspiration, research, and tools for dyslexic readers.
      </p>
      <div className="explore-grid">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="explore-card">
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{item.kicker}</p>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
