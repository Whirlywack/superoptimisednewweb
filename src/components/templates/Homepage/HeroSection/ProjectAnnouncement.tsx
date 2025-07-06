import React from "react";
import { getContentWithFallback } from "@/lib/content-blocks";

export async function ProjectAnnouncement() {
  // Fetch content blocks with fallbacks
  const [heroLabel, heroTitle, heroDescription] = await Promise.all([
    getContentWithFallback("homepage_hero", "hero_label", "Building Decision Made"),
    getContentWithFallback("homepage_hero", "hero_title", "Magic Link\nQuestionnaire\nSystem"),
    getContentWithFallback(
      "homepage_hero",
      "hero_description",
      "I've decided to build an anonymous community feedback system for developers. Traditional sign-ups kill honest feedback—magic links solve this. **Your input helps refine every technical decision along the way.**"
    ),
  ]);

  // Split title into lines for proper rendering
  const titleLines = heroTitle.split("\n");

  // Parse description for bold text
  const descriptionParts = heroDescription.split("**");

  return (
    <>
      {/* Hero Label - From database */}
      <div className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-primary">
        {heroLabel}
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
