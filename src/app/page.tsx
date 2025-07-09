import React from "react";
import type { Metadata } from "next";
import { HomepageNavigation } from "@/components/templates/Homepage/HomepageNavigation";
import { HeroSection } from "@/components/templates/Homepage/HeroSection";
import { BuildingPhilosophy } from "@/components/templates/Homepage/BuildingPhilosophy";
import { CommunityProof } from "@/components/templates/Homepage/CommunityProof";
import { NewsletterSection } from "@/components/templates/Homepage/NewsletterSection";
import { HomepageFooter } from "@/components/templates/Homepage/HomepageFooter";
import { XPToastProvider } from "@/components/templates/Homepage/XPToastProvider";

export const metadata: Metadata = {
  title: "Superoptimised - Building in Public",
  description: "Building a Magic Link Questionnaire System with radical transparency. Every decision documented, community input shapes the direction. Join the building process.",
  openGraph: {
    title: "Superoptimised - Building in Public",
    description: "Building a Magic Link Questionnaire System with radical transparency. Every decision documented, community input shapes the direction.",
    type: "website",
    images: [
      {
        url: "/api/og/homepage",
        width: 1200,
        height: 630,
        alt: "Superoptimised - Building in Public",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superoptimised - Building in Public",
    description: "Building a Magic Link Questionnaire System with radical transparency. Every decision documented, community input shapes the direction.",
    images: ["/api/og/homepage"],
  },
};

export default function HomePage() {
  return (
    <XPToastProvider>
      <div className="flex min-h-screen flex-col bg-off-white">
        {/* Block 1: Navigation Bar */}
        <HomepageNavigation />

        {/* Main Content */}
        <main className="flex-1">
          {/* Block 2: Hero Section */}
          <HeroSection />

          {/* Block 3: Building Philosophy */}
          <BuildingPhilosophy />

          {/* Block 4: Community Proof */}
          <CommunityProof />

          {/* Block 5: Newsletter Signup */}
          <NewsletterSection />
        </main>

        {/* Block 6: Footer */}
        <HomepageFooter />
      </div>
    </XPToastProvider>
  );
}