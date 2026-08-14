"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { recordAssistiveUse } from "@/lib/hero/learning-profile";
import { saveLibraryItem } from "@/lib/hero/store";
import { SAMPLE_SCAN_TEXT } from "@/lib/hero/types";

export default function ScanPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("Scanned passage");

  function captureSample() {
    setText(SAMPLE_SCAN_TEXT);
    setTitle("Einstein quote");
    recordAssistiveUse("scans");
  }

  function continueToReader() {
    const body = text.trim() || SAMPLE_SCAN_TEXT;
    recordAssistiveUse("scans");
    const item = saveLibraryItem({ title: title.trim() || "Scan", text: body, source: text.trim() ? "paste" : "sample" });
    router.push(`/reader?id=${item.id}`);
  }

  return (
    <div>
      <header className="module-header">
        <h1>Scan</h1>
        <p>Flagship loop: Scan → Read → Listen → Highlight → Simplify → Save</p>
        <ScienceBadge tier="evidence-informed" />
      </header>

      <div className="panel scan-loop-card">
        <p className="scan-loop-label">HERO signature system</p>
        <strong>Capture text → transform presentation → listen with highlights → save to My Library</strong>
        <p className="home-practice-detail">
          Assistive technology research shows read-aloud and presentation tools can support comprehension—results vary by person.
        </p>
      </div>

      <div className="scan-stage panel">
        <div className="scan-camera" aria-hidden>
          <span>📷</span>
          <p>Camera preview (MVP uses sample or paste)</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={captureSample}>
          Use sample capture
        </button>
      </div>

      <label className="field">
        <span>Title</span>
        <input className="control" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="field">
        <span>Extracted text (editable)</span>
        <textarea className="control scan-textarea" value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Paste or capture text here…" />
      </label>

      <button type="button" className="btn btn-white module-cta" onClick={continueToReader}>
        Continue to Reader
      </button>
    </div>
  );
}
