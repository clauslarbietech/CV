import { SCIENCE_TIER_META, type ScienceTier } from "@/lib/hero/science";
import type { CSSProperties } from "react";

export function ScienceBadge({ tier, compact }: { tier: ScienceTier; compact?: boolean }) {
  const meta = SCIENCE_TIER_META[tier];
  return (
    <span
      className={`science-badge${compact ? " science-badge-compact" : ""}`}
      style={{ "--tier-color": meta.color } as CSSProperties}
      title={meta.description}
    >
      {meta.label}
    </span>
  );
}

export function ScienceTierLegend() {
  return (
    <div className="science-legend">
      {(Object.keys(SCIENCE_TIER_META) as ScienceTier[]).map((tier) => (
        <div key={tier} className="science-legend-row">
          <ScienceBadge tier={tier} compact />
          <span>{SCIENCE_TIER_META[tier].description}</span>
        </div>
      ))}
    </div>
  );
}
