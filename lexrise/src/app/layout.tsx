import type { Metadata } from "next";
import { Fraunces, Lexend } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LexRise — Dyslexia reading tools, fonts & games",
    template: "%s · LexRise",
  },
  description:
    "LexRise helps people with dyslexia practice reading with adjustable fonts, phonics games, research-backed tips, and a hall of accomplishments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lexend.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col reading-surface">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
