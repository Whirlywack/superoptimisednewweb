"use client";

import React from "react";
import { api } from "@/lib/trpc/react";

export function ProjectAnnouncement() {
  // Fetch content blocks with tRPC
  const { data: heroLabel } = api.content.getContentBlocks.useQuery(
    { pageKey: "homepage_hero", blockKey: "hero_label" },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { data: heroTitle } = api.content.getContentBlocks.useQuery(
    { pageKey: "homepage_hero", blockKey: "hero_title" },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const { data: heroDescription } = api.content.getContentBlocks.useQuery(
    { pageKey: "homepage_hero", blockKey: "hero_description" },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fallback values
  const label = heroLabel?.content || "Building Decision Made";
  const title = heroTitle?.content || "Magic Link\nQuestionnaire\nSystem";
  const description =
    heroDescription?.content ||
    "I've decided to build an anonymous community feedback system for developers. Traditional sign-ups kill honest feedback—magic links solve this. **Your input helps refine every technical decision along the way.**";

  // Split title into lines for proper rendering
  const titleLines = title.split("\n");

  // Parse description for bold text
  const descriptionParts = description.split("**");

  return (
    <>
      {/* Hero Label - From database */}
      <div className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-primary">
        {label}
      </div>

      {/* Main Headline - From database */}
      <h1 id="hero-heading" className="mb-8 text-mega font-extrabold uppercase text-off-black">
        {titleLines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < titleLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h1>

      {/* Description Paragraph - From database */}
      <p className="mb-12 max-w-prose text-lg leading-relaxed text-warm-gray">
        {descriptionParts.map((part, index) => {
          if (index % 2 === 1) {
            // Odd indices are bold text (between **)
            return (
              <strong key={index} className="font-bold text-warm-gray">
                {part}
              </strong>
            );
          }
          // Even indices are regular text
          return part;
        })}
      </p>
    </>
  );
}
