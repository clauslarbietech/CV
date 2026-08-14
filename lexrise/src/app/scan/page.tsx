"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveLibraryItem } from "@/lib/hero/store";
import { SAMPLE_SCAN_TEXT } from "@/lib/hero/types";

export default function ScanPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("Scanned passage");

  function captureSample() {
    setText(SAMPLE_SCAN_TEXT);
    setTitle("Einstein quote");
  }

  function continueToReader() {
    const body = text.trim() || SAMPLE_SCAN_TEXT;
    const item = saveLibraryItem({ title: title.trim() || "Scan", text: body, source: text.trim() ? "paste" : "sample" });
    router.push(`/reader?id=${item.id}`);
  }

  return (
    <div>
      <header className="module-header">
        <h1>HERO Scan</h1>
        <p>Camera, image, or PDF → OCR → editable text → Reader → Listen → Library</p>
      </header>

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
