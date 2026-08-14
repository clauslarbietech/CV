import type { Metadata } from "next";
import { PageTopBar } from "@/components/AppShell";
import { accomplishments } from "@/data/accomplishments";

export const metadata: Metadata = { title: "Accomplishments" };

export default function AccomplishmentsPage() {
  return (
    <>
      <PageTopBar title="Accomplishments" />
      <p style={{ margin: "0 0 16px", color: "var(--ink-muted)", fontSize: 15, lineHeight: 1.4 }}>
        People with dyslexia who shaped the world.
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
        {accomplishments.map((person) => (
          <li key={person.name} className="panel">
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{person.field}</p>
            <h2 style={{ margin: "8px 0 0", fontSize: 18, fontWeight: 700 }}>{person.name}</h2>
            <p style={{ margin: "8px 0 0", color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.45 }}>
              {person.achievement}
            </p>
            {person.quote ? (
              <blockquote
                style={{
                  margin: "12px 0 0",
                  paddingLeft: 12,
                  borderLeft: "2px solid var(--accent)",
                  fontStyle: "italic",
                  color: "#fff",
                }}
              >
                “{person.quote}”
              </blockquote>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
