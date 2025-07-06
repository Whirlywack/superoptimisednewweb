import React from "react";
import type { Metadata } from "next";
import { ResearchCompletePage } from "@/components/templates/ResearchCompletePage";

export const metadata: Metadata = {
  title: "Thank You - Research Complete | Superoptimised",
  description: "Thank you for your input! Your votes help shape the future of our building project. Share with others to get more community input.",
  openGraph: {
    title: "Thank You - Research Complete | Superoptimised",
    description: "Thank you for your input! Your votes help shape the future of our building project.",
    type: "website",
    images: [
      {
        url: "/og-research-complete.jpg",
        width: 1200,
        height: 630,
        alt: "Thank You - Research Complete",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thank You - Research Complete | Superoptimised",
    description: "Thank you for your input! Your votes help shape the future of our building project.",
    images: ["/og-research-complete.jpg"],
  },
};

export default function ResearchComplete() {
  return <ResearchCompletePage />;
}