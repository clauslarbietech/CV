"use client";

import Link from "next/link";
import { ScienceBadge, ScienceTierLegend } from "@/components/hero/ScienceBadge";

const LAB_ITEMS = [
  {
    name: "AI reading assistant",
    status: "Concept",
    summary: "Context-aware simplification and vocabulary support—requires validation before evidence claims.",
  },
  {
    name: "Eye-tracking readability",
    status: "Research track",
    summary: "Exploring gaze patterns during reading. Not a diagnostic screener in current HERO builds.",
  },
  {
    name: "Handwriting analysis",
    status: "Research track",
    summary: "Emerging research area; not presented as established dyslexia assessment.",
  },
  {
    name: "Immersive VR/AR reading",
    status: "Experimental",
    summary: "Useful for empathy and engagement experiments—not a structured literacy curriculum.",
  },
  {
    name: "Neurostimulation interfaces",
    status: "Experimental",
    summary: "Active research with immature clinical evidence; excluded from HERO treatment claims.",
  },
  {
    name: "Adaptive morphology tutor",
    status: "In development",
    summary: "Word-parts training for older learners—grounded in Structured Literacy, expanding in HERO.",
  },
];

export default function LabsPage() {
  return (
    <div>
      <header className="module-header">
        <h1>HERO Labs</h1>
        <p>Experimental capabilities—clearly separated from evidence-based reading support.</p>
      </header>

      <div className="panel labs-banner">
        <ScienceBadge tier="experimental" />
        <p>
          Everything here is exploratory. HERO Labs may become future features, but they are not marketed with the same authority as Structured Literacy and assistive reading tools.
        </p>
      </div>

      <ScienceTierLegend />

      <div className="research-grid">
        {LAB_ITEMS.map((item) => (
          <article key={item.name} className="panel research-card">
            <div className="research-card-head">
              <h2>{item.name}</h2>
              <span className="labs-status">{item.status}</span>
            </div>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>

      <Link href="/research" className="btn btn-white module-cta">
        Back to Science & Research
      </Link>
    </div>
  );
}
