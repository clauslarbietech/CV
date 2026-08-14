"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getLibrary, subscribeHero } from "@/lib/hero/store";

export default function LibraryPage() {
  const items = useSyncExternalStore(subscribeHero, getLibrary, () => []);

  return (
    <div>
      <header className="module-header">
        <h1>My Library</h1>
        <p>Saved scans and passages ready to read or listen again.</p>
      </header>

      {items.length === 0 ? (
        <div className="panel">
          <p>No saved items yet.</p>
          <Link href="/scan" className="btn btn-white module-cta">
            Scan your first page
          </Link>
        </div>
      ) : (
        <ul className="library-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/reader?id=${item.id}`} className="library-row">
                <strong>{item.title}</strong>
                <span>{item.source} · {new Date(item.createdAt).toLocaleDateString()}</span>
                <span className="chevron">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
