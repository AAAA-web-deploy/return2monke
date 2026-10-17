import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { loadContent } from "@/lib/content";
import { isIndexable, pageTitle, resolveMetadataBase } from "@/lib/presentation";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const content = loadContent();
const title = pageTitle(content.site, content.copy);
const description = content.site.seo.description;
const social = content.assets[content.site.seo.socialImageAsset];
const favicon = content.assets[content.site.identity.faviconAssetId];
const indexable = isIndexable(content.site.deployment.productionEnabled, process.env.VERCEL_ENV);
const metadataBase = resolveMetadataBase({
  productionEnabled: content.site.deployment.productionEnabled,
  productionDomain: content.site.deployment.productionDomain,
  stagingUrl: content.site.deployment.stagingUrl,
  vercelUrl: process.env.VERCEL_URL,
  nodeEnv: process.env.NODE_ENV,
});
const socialImage = metadataBase
  ? [{ url: social.src, width: social.width, height: social.height, alt: social.alt }]
  : undefined;

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title,
  description,
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: { icon: favicon.src },
  openGraph: {
    title,
    description,
    images: socialImage,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: socialImage?.map((image) => image.url),
  },
};

export const viewport: Viewport = {
  themeColor: "#F6EAD5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
