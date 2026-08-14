"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { applyAccessibilityPrefs, readerSurfaceStyle } from "@/lib/hero/accessibility";
import { getLibraryItem, saveLibraryItem } from "@/lib/hero/store";
import { SAMPLE_SCAN_TEXT } from "@/lib/hero/types";
import { useHeroProfile } from "@/hooks/useHeroProfile";

function ReaderContent({ id, textParam }: { id: string | null; textParam: string | null }) {
  const profile = useHeroProfile();
  const item = id ? getLibraryItem(id) : undefined;
  const text = item?.text ?? (textParam ? decodeURIComponent(textParam) : SAMPLE_SCAN_TEXT);
  const title = item?.title ?? (textParam ? "Imported text" : "Reader");
  const [speaking, setSpeaking] = useState(false);
  const [wordIndex, setWordIndex] = useState(-1);

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  useEffect(() => {
    applyAccessibilityPrefs(profile.accessibility);
  }, [profile.accessibility]);

  const surface = readerSurfaceStyle(profile.accessibility);

  function saveToLibrary() {
    saveLibraryItem({ title, text, source: "paste" });
  }

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = profile.tts.rate;
    let idx = 0;
    utter.onboundary = (e) => {
      if (e.name === "word") {
        setWordIndex(idx);
        idx += 1;
      }
    };
    utter.onend = () => {
      setSpeaking(false);
      setWordIndex(-1);
    };
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setWordIndex(-1);
  }

  return (
    <div className="reader-page">
      <div className="reader-top">
        <Link href="/home" className="icon-btn" aria-label="Back">
          ←
        </Link>
        <strong>{title}</strong>
        <Link href="/style" className="icon-btn" aria-label="Reading style">
          Aa
        </Link>
      </div>

      <div className="reader-body panel" style={surface}>
        <p className="reader-text">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className={profile.accessibility.highlightWords && wordIndex === i ? "reader-word-active" : undefined}>
              {word}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="reader-controls">
        {speaking ? (
          <button type="button" className="btn btn-ghost" onClick={stop}>
            Pause
          </button>
        ) : (
          <button type="button" className="btn btn-white" onClick={speak}>
            Listen with highlights
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={saveToLibrary}>
          Save to library
        </button>
        <Link href={`/listen?text=${encodeURIComponent(text.slice(0, 200))}`} className="btn btn-ghost">
          Open in Listen
        </Link>
      </div>
    </div>
  );
}

function ReaderInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const textParam = params.get("text");
  return <ReaderContent key={`${id ?? ""}-${textParam ?? ""}`} id={id} textParam={textParam} />;
}

export default function ReaderPage() {
  return (
    <Suspense fallback={<p>Loading reader…</p>}>
      <ReaderInner />
    </Suspense>
  );
}
