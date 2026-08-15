"use client";

import Link from "next/link";
import { ScienceBadge, ScienceTierLegend } from "@/components/hero/ScienceBadge";
import { HERO_FEATURES, RESEARCH_PILLARS } from "@/lib/hero/science";
import { externalGames, researchFindings } from "@/data/research";

export default function ResearchPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Science & Research</h1>
        <p>How HERO uses dyslexia research—honestly labeled by evidence strength.</p>
      </header>

      <ScienceTierLegend />

      <p className="section-label">Research pillars</p>
      <div className="research-grid">
        {RESEARCH_PILLARS.map((pillar) => (
          <article key={pillar.id} className="panel research-card">
            <div className="research-card-head">
              <h2>{pillar.title}</h2>
              <ScienceBadge tier={pillar.tier} compact />
            </div>
            <p>{pillar.summary}</p>
          </article>
        ))}
      </div>

      <p className="section-label">HERO features & claims</p>
      <div className="research-grid">
        {HERO_FEATURES.map((feature) => (
          <article key={feature.id} className="panel research-card">
            <div className="research-card-head">
              <h2>{feature.name}</h2>
              <ScienceBadge tier={feature.tier} compact />
            </div>
            <p>{feature.summary}</p>
            <p className="research-claim">{feature.claim}</p>
          </article>
        ))}
      </div>

      <p className="section-label">Detailed findings</p>
      <div className="research-grid">
        {researchFindings.map((item) => (
          <article key={item.title} className="panel research-card">
            <div className="research-card-head">
              <h2>{item.title}</h2>
              <ScienceBadge tier={item.tier} compact />
            </div>
            <p>{item.summary}</p>
            <p className="research-claim">{item.takeaway}</p>
            {item.href ? (
              <a href={item.href} className="research-link" target="_blank" rel="noreferrer">
                {item.sourceLabel} →
              </a>
            ) : (
              <p className="research-source">{item.sourceLabel}</p>
            )}
          </article>
        ))}
      </div>

      <p className="section-label">Recommended external tools</p>
      <ul className="research-external-list">
        {externalGames.map((game) => (
          <li key={game.name} className="panel">
            <p className="research-external-kind">{game.kind}</p>
            <a href={game.href} target="_blank" rel="noreferrer" className="research-external-name">
              {game.name}
            </a>
            <p className="research-external-why">{game.why}</p>
          </li>
        ))}
      </ul>

      <Link href="/labs" className="btn btn-ghost module-cta">
        Explore HERO Labs (Experimental) →
      </Link>

      <p className="module-disclaimer">
        HERO supports reading and learning. It does not diagnose dyslexia. With appropriate consent and privacy protections, HERO could eventually contribute to dyslexia research through institutional partnerships.
      </p>
    </div>
  );
}
