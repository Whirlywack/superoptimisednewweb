import React from "react";
import type { Metadata } from "next";
import { AboutPageWrapper } from "@/components/templates/AboutPageWrapper";

export const metadata: Metadata = {
  title: "About - Superoptimised",
  description:
    "A solo developer's experiment in building products where your input directly shapes what gets built. Sharing failures, wins, and everything in between transparently.",
  openGraph: {
    title: "About - Superoptimised",
    description:
      "A solo developer's experiment in building products where your input directly shapes what gets built. Sharing failures, wins, and everything in between transparently.",
    type: "website",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About - Superoptimised",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About - Superoptimised",
    description:
      "A solo developer's experiment in building products where your input directly shapes what gets built. Sharing failures, wins, and everything in between transparently.",
    images: ["/og-about.jpg"],
  },
};

export default function About() {
  return <AboutPageWrapper />;
}
