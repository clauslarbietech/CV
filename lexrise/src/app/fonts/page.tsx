import type { Metadata } from "next";
import Link from "next/link";
import { TopChrome } from "@/components/AppShell";
import { FontLab } from "@/components/FontLab";

export const metadata: Metadata = {
  title: "Font Lab",
};

export default function FontsPage() {
  return (
    <>
      <TopChrome />
      <Link href="/explore" className="mb-3 inline-flex text-sm text-[var(--ink-muted)]">
        ← Explore
      </Link>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Font Lab</h1>
      <p className="mb-6 text-[var(--ink-muted)]">
        Spacing often helps more than specialty letter shapes. Keep what feels clearest for you.
      </p>
      <FontLab />
    </>
  );
}
