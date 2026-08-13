import Link from "next/link";
import { TopChrome } from "@/components/AppShell";

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
      <TopChrome />
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Explore</h1>
      <p className="mb-6 text-[var(--ink-muted)]">
        Find inspiration, research, and tools that support dyslexic readers.
      </p>
      <div className="explore-grid">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="explore-card">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">{item.kicker}</p>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
