import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Laine — Calm yarn stash & project home",
  description:
    "The calm, premium home for serious knitters and crocheters. Organise your yarn, finish more projects, and connect with makers who care.",
  applicationName: "Laine",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Laine",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/icon-192.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4A5D4E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--text-primary)] font-sans">
        {children}
        <InstallPrompt />
        <OnboardingFlow />
      </body>
    </html>
  );
}
