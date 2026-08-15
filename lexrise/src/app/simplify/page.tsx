"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ScienceBadge } from "@/components/hero/ScienceBadge";
import { simplifyText } from "@/data/literacy";
import { recordAssistiveUse, saveLibraryItem } from "@/lib/hero/store";
import { SAMPLE_SCAN_TEXT } from "@/lib/hero/types";

export default function SimplifyPage() {
  const router = useRouter();
  const [input, setInput] = useState(
    "Please utilize this document in order to demonstrate approximately how additional requirements may assist you at this point in time.",
  );
  const simplified = useMemo(() => simplifyText(input || SAMPLE_SCAN_TEXT), [input]);

  function saveSimplified() {
    const item = saveLibraryItem({
      title: "Simplified passage",
      text: simplified,
      source: "paste",
    });
    router.push(`/reader?id=${item.id}`);
  }

  return (
    <div>
      <header className="module-header">
        <h1>Simplify</h1>
        <p>Make difficult wording clearer—part of HERO&apos;s everyday assistive loop.</p>
        <ScienceBadge tier="evidence-informed" />
      </header>

      <div className="panel">
        <p className="home-practice-detail">
          Assistive presentation can support comprehension. Results vary by person and text. This is not a clinical rewriting service.
        </p>
      </div>

      <label className="field">
        <span>Original text</span>
        <textarea className="control scan-textarea" rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>

      <p className="section-label">Simplified</p>
      <div className="panel simplify-output">
        <p className="reader-text" style={{ whiteSpace: "pre-wrap" }}>
          {simplified || "Paste text above to simplify."}
        </p>
      </div>

      <div className="reader-controls">
        <button type="button" className="btn btn-white" onClick={saveSimplified}>
          Open in Reader
        </button>
        <Link
          href={`/listen?text=${encodeURIComponent(simplified.slice(0, 400))}`}
          className="btn btn-ghost"
          onClick={() => recordAssistiveUse("listenSessions")}
        >
          Listen
        </Link>
      </div>
    </div>
  );
}
