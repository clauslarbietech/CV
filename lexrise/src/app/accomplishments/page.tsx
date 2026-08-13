import type { Metadata } from "next";
import { accomplishments } from "@/data/accomplishments";

export const metadata: Metadata = {
  title: "Accomplishments",
  description: "People with dyslexia who shaped business, science, sports, film, and more.",
};

export default function AccomplishmentsPage() {
  return (
    <section className="section">
      <div className="site-shell">
        <h1 className="section-title">People with dyslexia who changed the world</h1>
        <p className="section-lead">
          Dyslexia is common—about 1 in 5 people struggle with reading in ways connected to it. These stories show
          what becomes possible when strengths get room to grow.
        </p>

        <ul className="grid gap-10 sm:grid-cols-2">
          {accomplishments.map((person) => (
            <li key={person.name} className="border-t border-[var(--line)] pt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--teal)]">{person.field}</p>
              <h2 className="font-display mt-2 text-3xl text-[var(--bg-deep)]">{person.name}</h2>
              <p className="mt-3 text-[var(--ink-soft)]">{person.achievement}</p>
              {person.quote ? (
                <blockquote className="mt-4 border-l-4 border-[var(--amber)] pl-4 text-[var(--ink)] italic">
                  “{person.quote}”
                </blockquote>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
