import type { Metadata } from "next";
import { externalGames, researchFindings } from "@/data/research";

export const metadata: Metadata = {
  title: "Research",
  description: "Evidence notes on dyslexia fonts, phonics, myths, and recommended games.",
};

export default function ResearchPage() {
  return (
    <section className="section">
      <div className="site-shell">
        <h1 className="section-title">Research & recommended games</h1>
        <p className="section-lead">
          LexRise is built around what evidence actually supports: structured phonics practice, comfortable
          spacing, and celebrating dyslexic strengths—not viral quizzes.
        </p>

        <div className="space-y-10">
          {researchFindings.map((item) => (
            <article key={item.title} className="border-t border-[var(--line)] pt-6">
              <h2 className="font-display text-2xl text-[var(--bg-deep)] sm:text-3xl">{item.title}</h2>
              <p className="mt-3 text-[var(--ink-soft)]">{item.summary}</p>
              <p className="mt-3 font-medium text-[var(--ink)]">{item.takeaway}</p>
              <p className="mt-3 text-sm text-[var(--ink-soft)]">
                Source notes: {item.sourceLabel}
                {item.href ? (
                  <>
                    {" · "}
                    <a
                      href={item.href}
                      className="font-semibold text-[var(--teal)] underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open source
                    </a>
                  </>
                ) : null}
              </p>
            </article>
          ))}
        </div>

        <h2 className="section-title mt-16">Games & tools worth knowing</h2>
        <p className="section-lead">
          External apps and sites that teach phonics the way dyslexic readers often need—systematic sound work, not
          “only dyslexics can read this” gimmicks.
        </p>

        <ul className="grid gap-8 md:grid-cols-2">
          {externalGames.map((game) => (
            <li key={game.name} className="border-t border-[var(--line)] pt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--amber-deep)]">{game.kind}</p>
              <h3 className="font-display mt-2 text-2xl text-[var(--bg-deep)]">
                <a href={game.href} target="_blank" rel="noreferrer" className="hover:text-[var(--teal)]">
                  {game.name}
                </a>
              </h3>
              <p className="mt-2 text-[var(--ink-soft)]">{game.why}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
