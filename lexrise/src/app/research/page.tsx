import type { Metadata } from "next";
import { PageTopBar } from "@/components/AppShell";
import { externalGames, researchFindings } from "@/data/research";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <>
      <PageTopBar title="Research" />
      <p style={{ margin: "0 0 16px", color: "var(--ink-muted)", fontSize: 15, lineHeight: 1.4 }}>
        Evidence notes and tools worth knowing.
      </p>
      <div style={{ display: "grid", gap: 12 }}>
        {researchFindings.map((item) => (
          <article key={item.title} className="panel">
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{item.title}</h2>
            <p style={{ margin: "8px 0 0", color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.45 }}>
              {item.summary}
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 14, fontWeight: 500 }}>{item.takeaway}</p>
            {item.href ? (
              <a
                href={item.href}
                className="mt-3 inline-flex text-sm font-semibold"
                style={{ color: "var(--accent)" }}
                target="_blank"
                rel="noreferrer"
              >
                Open source →
              </a>
            ) : null}
          </article>
        ))}
      </div>
      <h2 style={{ margin: "28px 0 12px", fontSize: 22, fontWeight: 700 }}>Recommended games</h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
        {externalGames.map((game) => (
          <li key={game.name} className="panel">
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{game.kind}</p>
            <a href={game.href} target="_blank" rel="noreferrer" style={{ display: "block", marginTop: 6, fontSize: 17, fontWeight: 700 }}>
              {game.name}
            </a>
            <p style={{ margin: "8px 0 0", color: "var(--ink-muted)", fontSize: 14, lineHeight: 1.4 }}>{game.why}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
