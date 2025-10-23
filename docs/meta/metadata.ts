import type { Metadata } from "next";
import { config } from "@/config";

export const meta: Metadata = {
  // metadataBase: new URL(config.DOMAIN ? config.DOMAIN : "/"),
  title: {
    template: "%s | Primehooks",
    default: "Primehooks",
  },
  description: `Modern, lightweight and performance-optimized React hooks library for building powerful web applications with ease.`,
  generator: "NextJS",
  applicationName: "Primehooks",
  referrer: "origin-when-cross-origin",
  keywords: [],
  authors: [{ name: "iPuppyYT", url: "https://github.com/ipuppyyt" }],
  creator: "iPuppyYT",
  publisher: "Primehooks",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Primehooks",
    description:
      "Modern, lightweight and performance-optimized React hooks library for building powerful web applications with ease.",
    url: config.DOMAIN,
    siteName: "Primehooks",
    images: [
      {
        url: `${config.DOMAIN}/images/seo/root.webp`,
        width: 1200,
        height: 630,
        alt: "Primehooks - Modern, lightweight and performance oriented hook library",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Primehooks",
    description:
      "Modern, lightweight and performance-optimized React hooks library for building powerful web applications with ease.",
    images: `${config.DOMAIN}/images/seo/root.webp`,
  },
  icons: {
    apple: [
      { url: "/assets/meta/apple-touch-icon-png" },
      {
        url: "/assets/meta/apple-touch-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/assets/meta/apple-touch-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/assets/meta/apple-touch-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/assets/meta/apple-touch-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/assets/meta/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/assets/meta/apple-touch-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/assets/meta/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/assets/meta/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: config.DOMAIN,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
