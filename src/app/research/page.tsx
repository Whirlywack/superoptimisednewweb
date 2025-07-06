import React from "react";
import type { Metadata } from "next";
import { ResearchPage } from "@/components/templates/ResearchPage";

export const metadata: Metadata = {
  title: "Research & Community Input - Superoptimised",
  description: "Shape the future of our building project. Cast your vote on key decisions and feature priorities. Your input drives what gets built next.",
  openGraph: {
    title: "Research & Community Input - Superoptimised",
    description: "Shape the future of our building project. Cast your vote on key decisions and feature priorities. Your input drives what gets built next.",
    type: "website",
    images: [
      {
        url: "/og-research.jpg",
        width: 1200,
        height: 630,
        alt: "Research & Community Input - Superoptimised",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research & Community Input - Superoptimised",
    description: "Shape the future of our building project. Cast your vote on key decisions and feature priorities.",
    images: ["/og-research.jpg"],
  },
};

export default function Research() {
  return <ResearchPage />;
}