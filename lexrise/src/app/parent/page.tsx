"use client";

export default function ParentPage() {
  return (
    <div>
      <header className="module-header">
        <h1>Parent / Caregiver</h1>
        <p>See activity summaries—not shame metrics. COPPA-ready controls planned for production.</p>
      </header>

      <div className="panel">
        <h2 className="text-lg font-bold">MVP controls</h2>
        <ul className="parent-list">
          <li>Session time reminders (coming soon)</li>
          <li>Activity summary email (coming soon)</li>
          <li>Export or delete child data (coming soon)</li>
          <li>No ads, no data sold</li>
        </ul>
      </div>

      <p className="module-disclaimer">
        Missing a day never reduces progress in HERO Kids. We celebrate showing up, not punishing breaks.
      </p>
    </div>
  );
}
