import Link from "next/link";
import { IconBrainMark, TrainingTopBar } from "@/components/AppShell";

export default function TrainingPage() {
  return (
    <div className="training-stage">
      <TrainingTopBar />

      <div className="segmented" role="tablist" aria-label="Day">
        <button type="button" data-active="false" tabIndex={-1}>
          Yesterday
        </button>
        <button type="button" data-active="true">
          Today
        </button>
      </div>

      <Link href="/session" className="session-card" aria-label="Start session">
        <span className="session-orb">
          <IconBrainMark />
        </span>
        <span className="session-label">Start session</span>
      </Link>

      <p className="session-hint">Start a session and keep building your streak.</p>
    </div>
  );
}
