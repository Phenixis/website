import type { Metadata } from "next";
import { JetBrains_Mono, Fraunces } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Maxime Duhamel",
  description: "Designer & builder. Lives in Saint-Brieuc & Montpellier.",
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
