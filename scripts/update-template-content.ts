import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tsxTemplateContent = `"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { XPToastContext } from "../Homepage/XPToastProvider";

export function {{COMPONENT_NAME}}() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast("+10 XP • Building momentum!");

    // Auto-refresh poll after vote (simulated)
    setTimeout(() => {
      setSelectedPoll(null);
    }, 2000);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual newsletter signup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmail("");
      showXPToast("+25 XP • Newsletter signup!");
    } catch (error) {
      console.error("Newsletter signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full px-4 py-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        {/* Post Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          {/* Main Content */}
          <div className="max-w-prose">
            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              {{POST_INTRO}}
            </p>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              {{POST_DESCRIPTION}}
            </p>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              {{SECTION_1_TITLE}}
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              {{SECTION_1_CONTENT}}
            </p>

            <blockquote className="mx-0 my-xl max-w-prose border-l-4 border-primary bg-primary/10 p-xl text-lg italic text-off-black">
              &ldquo;{{QUOTE_TEXT}}&rdquo;
            </blockquote>

            {/* Community Impact Section */}
            <div className="mx-0 my-2xl max-w-prose rounded-lg border-2 border-primary bg-primary/5 p-lg">
              <div className="mb-md font-mono text-sm font-semibold text-primary">
                {{IMPACT_SECTION_TITLE}}
              </div>
              <div className="mb-md grid grid-cols-3 gap-md">
                {[
                  { number: "{{STAT_1_NUMBER}}", label: "{{STAT_1_LABEL}}" },
                  { number: "{{STAT_2_NUMBER}}", label: "{{STAT_2_LABEL}}" },
                  { number: "{{STAT_3_NUMBER}}", label: "{{STAT_3_LABEL}}" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-mono text-xl font-extrabold text-primary">
                      {stat.number}
                    </div>
                    <div className="mt-xs text-xs text-warm-gray">{stat.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-warm-gray">
                {{IMPACT_DESCRIPTION}}
              </p>
            </div>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              {{SECTION_2_TITLE}}
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              {{SECTION_2_CONTENT}}
            </p>

            {/* Interactive Poll */}
            <div className="mx-0 my-2xl max-w-prose rounded-lg border-2 border-light-gray bg-white p-lg transition-all duration-200">
              <div className="mb-md text-sm font-semibold leading-relaxed text-off-black">
                {{POLL_QUESTION}}
              </div>
              <div className="mb-md flex flex-wrap gap-sm">
                {[
                  { value: "{{POLL_OPTION_1_VALUE}}", label: "{{POLL_OPTION_1_LABEL}}" },
                  { value: "{{POLL_OPTION_2_VALUE}}", label: "{{POLL_OPTION_2_LABEL}}" },
                  { value: "{{POLL_OPTION_3_VALUE}}", label: "{{POLL_OPTION_3_LABEL}}" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePollVote(option.value)}
                    className={cn(
                      "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                      selectedPoll === option.value
                        ? "border-2 border-primary bg-primary text-white"
                        : "border-2 border-transparent bg-light-gray text-off-black hover:border-primary hover:bg-white"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="text-center text-xs text-warm-gray">
                <span className="font-mono">Help shape future posts</span> •
                <a
                  href="{{SOCIAL_LINK}}"
                  className="ml-1 text-primary hover:underline"
                >
                  {{SOCIAL_CTA}}
                </a>
              </div>
            </div>

            {/* Mid-Content Newsletter CTA */}
            <div
              className="max-w-prose rounded-lg border-2 border-primary bg-white p-lg text-center"
              style={{ margin: "4rem 0" }}
            >
              <h3 className="mb-md text-lg font-bold text-off-black">{{NEWSLETTER_TITLE}}</h3>
              <p className="mb-lg text-sm text-warm-gray">
                {{NEWSLETTER_DESCRIPTION}}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                  className={cn(
                    "w-full rounded-sm border-2 border-light-gray px-md py-sm",
                    "bg-white text-base",
                    "focus:border-primary focus:outline-none",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className={cn(
                    "w-full rounded-sm border-none bg-primary py-sm text-base text-white",
                    "cursor-pointer font-semibold transition-all duration-200",
                    "hover:-translate-y-px hover:bg-off-black",
                    "disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {{NEWSLETTER_BUTTON_TEXT}}
                </button>
              </form>
            </div>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              {{SECTION_3_TITLE}}
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              {{SECTION_3_CONTENT}}
            </p>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              {{CLOSING_CONTENT}}
            </p>
          </div>
        </div>

        {/* Content Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            {/* Table of Contents */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">In This Post</h3>
              <div className="text-sm text-warm-gray">
                <ul className="text-sm" style={{ paddingLeft: "2rem", margin: 0 }}>
                  <li className="text-sm" style={{ marginBottom: "0.5rem" }}>
                    <a href="#section1" className="text-warm-gray hover:text-primary">
                      {{TOC_ITEM_1}}
                    </a>
                  </li>
                  <li className="text-sm" style={{ marginBottom: "0.5rem" }}>
                    <a href="#section2" className="text-warm-gray hover:text-primary">
                      {{TOC_ITEM_2}}
                    </a>
                  </li>
                  <li className="text-sm" style={{ marginBottom: "0.5rem" }}>
                    <a href="#section3" className="text-warm-gray hover:text-primary">
                      {{TOC_ITEM_3}}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Post Stats */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">Post Impact</h3>
              <div className="text-sm text-warm-gray">
                {[
                  { label: "Views", value: "{{POST_VIEWS}}" },
                  { label: "Shares", value: "{{POST_SHARES}}" },
                  { label: "Newsletter Signups", value: "{{POST_SIGNUPS}}" },
                  { label: "Community Votes", value: "{{POST_VOTES}}" },
                ].map((stat, index) => (
                  <div key={index} className="mb-sm flex justify-between">
                    <span>{stat.label}</span>
                    <span className="font-mono text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Next */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">Coming Next</h3>
              <div className="text-sm text-warm-gray">
                <p className="mb-sm font-semibold">{{NEXT_POST_TITLE}}</p>
                <p className="mb-sm">
                  {{NEXT_POST_DESCRIPTION}}
                </p>
                <a href="{{NEXT_POST_LINK}}" className="text-primary hover:underline">
                  {{NEXT_POST_CTA}} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`;

async function updateTemplateContent() {
  console.log("🔄 Updating template content to TypeScript...");

  // Update the existing template with TypeScript content
  const result = await prisma.contentTemplate.updateMany({
    where: {
      title: "Superoptimised Blog Post",
      contentType: "tsx",
    },
    data: {
      defaultContent: tsxTemplateContent,
      contentType: "tsx",
    },
  });

  console.log(`✅ Updated ${result.count} template(s) with TypeScript content`);

  // Verify the change
  const template = await prisma.contentTemplate.findFirst({
    where: { title: "Superoptimised Blog Post" },
  });

  if (template) {
    console.log(`✅ Template "${template.title}" contentType: "${template.contentType}"`);
    console.log(`✅ Content length: ${template.defaultContent.length} characters`);
    console.log(
      `✅ Contains TypeScript: ${template.defaultContent.includes("import React") ? "Yes" : "No"}`
    );
  }
}

updateTemplateContent()
  .catch((e) => {
    console.error("❌ Failed to update template:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
