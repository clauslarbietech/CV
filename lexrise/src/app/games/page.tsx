"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GamesHub } from "@/components/GamesHub";
import { LITERACY_ACTIVITIES } from "@/lib/hero/activity-engine";

const FILTERS = [
  { id: "all", label: "ALL" },
  { id: "sounds", label: "SOUNDS" },
  { id: "reading", label: "READING" },
  { id: "writing", label: "WRITING" },
  { id: "focus", label: "FOCUS" },
] as const;

const CARD_TONES = ["crimson", "teal", "indigo", "amber", "violet", "ocean"] as const;

const FILTER_MAP: Record<string, string[]> = {
  all: [],
  sounds: ["sounds", "letters"],
  reading: ["words", "word-parts", "fluency", "comprehension"],
  writing: ["spelling"],
  focus: ["working-memory", "attention"],
};

function GamesCatalog() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const params = useSearchParams();
  const skill = params.get("skill");

  const games = useMemo(() => {
    const playable = LITERACY_ACTIVITIES.filter((a) => a.href.startsWith("/games") || a.href.startsWith("/train"));
    if (filter === "all") return playable;
    const domains = FILTER_MAP[filter];
    return playable.filter((a) => domains.includes(a.domain));
  }, [filter]);

  if (skill) {
    return (
      <div className="elevate-play">
        <div className="elevate-banner elevate-banner-sm">
          <p>PLAY · PRACTICE · IMPROVE</p>
        </div>
        <div className="elevate-sheet elevate-sheet-play">
          <Link href="/games" className="elevate-back">
            ← Games
          </Link>
          <GamesHub />
        </div>
      </div>
    );
  }

  const featured = games[0];
  const rest = games.slice(1);

  return (
    <div className="elevate-games">
      <div className="elevate-banner">
        <p>TRAIN WITH STRUCTURED LITERACY GAMES</p>
      </div>

      <section className="elevate-sheet">
        <div className="elevate-games-title">
          <h1>Games</h1>
        </div>

        <div className="elevate-pills" role="tablist" aria-label="Game filters">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className="elevate-pill"
              data-active={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {featured ? (
          <>
            <p className="elevate-kicker">GAME OF THE WEEK</p>
            <Link href={featured.href} className={`elevate-featured tone-${CARD_TONES[0]}`}>
              <span className="elevate-featured-icon" aria-hidden>
                🧩
              </span>
              <strong>{featured.title}</strong>
              <span>{featured.detail}</span>
            </Link>
          </>
        ) : null}

        <p className="elevate-kicker">POPULAR</p>
        <div className="elevate-card-grid">
          {rest.map((game, i) => (
            <Link key={game.id} href={game.href} className={`elevate-game-card tone-${CARD_TONES[(i + 1) % CARD_TONES.length]}`}>
              <span className="elevate-game-icon" aria-hidden>
                {game.domain === "sounds"
                  ? "🔊"
                  : game.domain === "spelling"
                    ? "✏️"
                    : game.domain === "fluency"
                      ? "🌊"
                      : game.domain === "word-parts"
                        ? "🧩"
                        : "Aa"}
              </span>
              <strong>{game.title}</strong>
              <span className="elevate-game-tag">{game.domain.replace("-", " ").toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<p className="elevate-loading">Loading games…</p>}>
      <GamesCatalog />
    </Suspense>
  );
}
