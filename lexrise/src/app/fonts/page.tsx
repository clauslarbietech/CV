import type { Metadata } from "next";
import { PageTopBar } from "@/components/AppShell";
import { FontLab } from "@/components/FontLab";

export const metadata: Metadata = { title: "Font Lab" };

export default function FontsPage() {
  return (
    <>
      <PageTopBar title="Appearance" />
      <p style={{ margin: "0 0 16px", color: "var(--ink-muted)", fontSize: 15, lineHeight: 1.4 }}>
        Spacing often helps more than specialty letter shapes. Keep what feels clearest.
      </p>
      <FontLab />
    </>
  );
}
