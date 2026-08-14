"use client";

import Link from "next/link";
import { ScienceBadge } from "@/components/hero/ScienceBadge";

export default function ParentPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Parent / Caregiver</h1>
        <p>See activity and confidence—not shame metrics. HERO supports learning; it does not diagnose.</p>
      </header>

      <div className="panel">
        <p className="science-rec-label">What the research supports</p>
        <ul className="parent-list">
          <li>
            <strong>Structured Literacy</strong> — explicit phonics, syllables, morphology, and spelling (Evidence-Based)
          </li>
          <li>
            <strong>Assistive tools</strong> — Scan, Listen, and Simplify can support everyday reading (Evidence-Informed)
          </li>
          <li>
            <strong>Games</strong> — can boost engagement and some phonological skills; gains do not always transfer to every reading skill
          </li>
          <li>
            <strong>Focus / Memory Lab</strong> — separate from dyslexia treatment claims; not neurofeedback therapy
          </li>
        </ul>
        <ScienceBadge tier="evidence-based" />
      </div>

      <div className="panel">
        <h2 className="text-lg font-bold">How to use HERO with your child</h2>
        <ul className="parent-list">
          <li>Start with a Science Session (sounds → letters → words)</li>
          <li>Prefer short, successful practice over long frustrated sessions</li>
          <li>Celebrate showing up—missing a day never reduces progress</li>
          <li>Use Listen/Scan for homework text when decoding load is high</li>
          <li>Adjust Reading Style: try spacing before specialty fonts</li>
        </ul>
        <Link href="/practice" className="btn btn-white module-cta">
          Open Science Session
        </Link>
      </div>

      <div className="panel">
        <h2 className="text-lg font-bold">Privacy & controls (MVP)</h2>
        <ul className="parent-list">
          <li>Session time reminders (coming soon)</li>
          <li>Activity summary email (coming soon)</li>
          <li>Export or delete child data (coming soon)</li>
          <li>No ads, no data sold</li>
        </ul>
      </div>

      <Link href="/research" className="btn btn-ghost module-cta">
        Read the science notes →
      </Link>
    </div>
  );
}
