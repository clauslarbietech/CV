import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Lexend } from "next/font/google";
import { HeroAccessibilityProvider } from "@/components/hero/HeroAccessibilityProvider";
import { HeroShell } from "@/components/hero/HeroShell";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HERO — Read differently. Learn differently. Be powerful.",
    template: "%s · HERO",
  },
  description:
    "Inclusive reading and learning platform for children through adults. Supports—not diagnoses—dyslexia and alternative reading needs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lexend.variable} ${atkinson.variable} h-full`}>
      <body className="min-h-full">
        <HeroAccessibilityProvider />
        <HeroShell>{children}</HeroShell>
      </body>
    </html>
  );
}
