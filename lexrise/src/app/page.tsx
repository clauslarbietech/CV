import Link from "next/link";
import { TopChrome } from "@/components/AppShell";

export default function TrainingPage() {
  return (
    <>
      <TopChrome />
      <div className="segmented" role="tablist" aria-label="Day">
        <button type="button" data-active="false" disabled>
          Yesterday
        </button>
        <button type="button" data-active="true">
          Today
        </button>
      </div>

      <Link href="/session" className="session-card">
        <span className="session-orb" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 14c2.2-4 4-6 5-6s2.8 2 5 6c-2.5 1.8-7.5 1.8-10 0Z"
              fill="#5b3cc4"
              opacity="0.35"
              stroke="#5b3cc4"
              strokeWidth="1.5"
            />
            <path
              d="M8 10c1.5-2.5 2.8-3.5 4-3.5s2.5 1 4 3.5"
              stroke="#5b3cc4"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="text-lg font-semibold text-white">Start session</span>
      </Link>

      <p className="session-hint">Start a session and keep building your streak.</p>

      <div className="mt-8 grid gap-3">
        <Link href="/session?game=unscramble" className="panel flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ink-muted)]">Quick practice</p>
            <p className="font-semibold">Phonics unscramble</p>
          </div>
          <span className="text-[var(--ink-muted)]">→</span>
        </Link>
        <Link href="/session?game=flip" className="panel flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ink-muted)]">Letter focus</p>
            <p className="font-semibold">b / d / p / q flip</p>
          </div>
          <span className="text-[var(--ink-muted)]">→</span>
        </Link>
      </div>
    </>
  );
}
