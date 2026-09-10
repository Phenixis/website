import type { Metadata } from "next";
import { JetBrains_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import { getProfile } from "@/lib/db";
import { PROFILE } from "@/app/data";
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

const title = "Maxime Duhamel";
const description = "Designer & builder. Lives in Saint-Brieuc & Montpellier.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
  },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: title,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = (await getProfile()) ?? PROFILE;
  const sameAs = [profile.github, profile.linkedin].filter((url): url is string => Boolean(url));

  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: title,
              url: SITE_URL,
              description,
              jobTitle: "Designer & builder",
              ...(sameAs.length ? { sameAs } : {}),
              address: {
                "@type": "PostalAddress",
                addressLocality: "Saint-Brieuc",
                addressCountry: "FR",
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
