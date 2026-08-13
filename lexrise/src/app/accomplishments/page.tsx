import type { Metadata } from "next";
import Link from "next/link";
import { TopChrome } from "@/components/AppShell";
import { accomplishments } from "@/data/accomplishments";

export const metadata: Metadata = {
  title: "Accomplishments",
};

export default function AccomplishmentsPage() {
  return (
    <>
      <TopChrome />
      <Link href="/explore" className="mb-3 inline-flex text-sm text-[var(--ink-muted)]">
        ← Explore
      </Link>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Accomplishments</h1>
      <p className="mb-6 text-[var(--ink-muted)]">
        People with dyslexia who shaped the world—proof that struggle with print is not a ceiling.
      </p>
      <ul className="space-y-4">
        {accomplishments.map((person) => (
          <li key={person.name} className="panel">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">{person.field}</p>
            <h2 className="mt-2 text-xl font-bold">{person.name}</h2>
            <p className="mt-2 text-[var(--ink-soft)]">{person.achievement}</p>
            {person.quote ? (
              <blockquote className="mt-3 border-l-2 border-[var(--accent)] pl-3 text-[var(--ink)] italic">
                “{person.quote}”
              </blockquote>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
