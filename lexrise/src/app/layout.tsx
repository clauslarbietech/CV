import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LexRise — Dyslexia reading training",
    template: "%s · LexRise",
  },
  description:
    "Daily reading sessions, phonics games, font comfort tools, and accomplishments for people with dyslexia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lexend.variable} h-full`}>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
