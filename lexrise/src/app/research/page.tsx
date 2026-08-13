import type { Metadata } from "next";
import Link from "next/link";
import { TopChrome } from "@/components/AppShell";
import { externalGames, researchFindings } from "@/data/research";

export const metadata: Metadata = {
  title: "Research",
};

export default function ResearchPage() {
  return (
    <>
      <TopChrome />
      <Link href="/explore" className="mb-3 inline-flex text-sm text-[var(--ink-muted)]">
        ← Explore
      </Link>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Research</h1>
      <p className="mb-6 text-[var(--ink-muted)]">
        Evidence notes and tools worth knowing—structured phonics over viral quizzes.
      </p>

      <div className="space-y-4">
        {researchFindings.map((item) => (
          <article key={item.title} className="panel">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-[var(--ink-soft)]">{item.summary}</p>
            <p className="mt-3 font-medium">{item.takeaway}</p>
            {item.href ? (
              <a
                href={item.href}
                className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)]"
                target="_blank"
                rel="noreferrer"
              >
                Open source →
              </a>
            ) : null}
          </article>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-2xl font-bold">Recommended games</h2>
      <ul className="space-y-3">
        {externalGames.map((game) => (
          <li key={game.name} className="panel">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">{game.kind}</p>
            <a href={game.href} target="_blank" rel="noreferrer" className="mt-1 block text-lg font-bold">
              {game.name}
            </a>
            <p className="mt-2 text-[var(--ink-muted)]">{game.why}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
