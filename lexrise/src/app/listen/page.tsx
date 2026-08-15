"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useHeroProfile } from "@/hooks/useHeroProfile";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { recordAssistiveUse } from "@/lib/hero/store";
import { SAMPLE_SCAN_TEXT } from "@/lib/hero/types";

function ListenContent({ initialText }: { initialText: string }) {
  const profile = useHeroProfile();
  const [text, setText] = useState(initialText);
  const [speaking, setSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);

  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    recordAssistiveUse("listenSessions");
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = profile.tts.rate;
    utter.onend = () => {
      setSpeaking(false);
      setProgress(100);
    };
    utter.onboundary = () => setProgress((p) => Math.min(p + 8, 95));
    setSpeaking(true);
    setProgress(0);
    window.speechSynthesis.speak(utter);
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  return (
    <div>
      <header className="module-header">
        <h1>Listen</h1>
        <p>Paste, type, scan, or import text—then listen with synchronized highlighting in Reader.</p>
        <ScienceBadge tier="evidence-informed" />
      </header>

      <label className="field">
        <span>Text</span>
        <textarea className="control scan-textarea" rows={5} value={text} onChange={(e) => setText(e.target.value)} />
      </label>

      <div className="listen-controls panel">
        <label className="field">
          <span>Speed — {profile.tts.rate.toFixed(1)}×</span>
          <input className="w-full accent-[var(--accent)]" type="range" min={0.6} max={1.4} step={0.1} defaultValue={profile.tts.rate} disabled />
        </label>
        <p className="listen-voice">Voice: {profile.tts.voiceLabel} (system voice in MVP)</p>
        <div className="listen-wave" aria-hidden>
          <div className="listen-wave-fill" style={{ width: `${progress}%` }} />
        </div>
        {speaking ? (
          <button type="button" className="btn btn-ghost" onClick={stop}>
            Pause
          </button>
        ) : (
          <button type="button" className="btn btn-white" onClick={speak}>
            Play narration
          </button>
        )}
      </div>

      <p className="section-label">Sentences</p>
      <ul className="sentence-list">
        {sentences.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <Link href={`/reader?text=${encodeURIComponent(text.slice(0, 120))}`} className="home-soft-link">
        Open in Reader with word highlights →
      </Link>
    </div>
  );
}

function ListenInner() {
  const params = useSearchParams();
  const initial = params.get("text") ?? SAMPLE_SCAN_TEXT;
  return <ListenContent key={initial} initialText={initial} />;
}

export default function ListenPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ListenInner />
    </Suspense>
  );
}
