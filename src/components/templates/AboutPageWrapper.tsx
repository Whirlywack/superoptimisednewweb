import React from "react";
import { getContentBlocks, parseJsonContent } from "@/lib/content-blocks";
import { AboutPage } from "./AboutPage";

export interface AboutPageContent {
  hero: {
    label: string;
    title: string;
    description: string;
  };
  mission: {
    title: string;
    description: string;
  };
  newsletter: {
    title: string;
    description: string;
    buttonText: string;
  };
  story: {
    intro: string;
    problem: string;
    quote: string;
    experiment: string;
    currentFocus: string;
    uncertainty: string;
    conclusion: string;
    callToAction: string;
  };
  sidebar: {
    takeActionTitle: string;
    currentFocusTitle: string;
    currentFocusData: Record<string, unknown>;
  };
}

export async function AboutPageWrapper() {
  // Fetch all content blocks for the About page
  const [heroBlocks, missionBlocks, newsletterBlocks, storyBlocks, sidebarBlocks] =
    await Promise.all([
      getContentBlocks("about_hero"),
      getContentBlocks("about_mission"),
      getContentBlocks("about_newsletter"),
      getContentBlocks("about_story"),
      getContentBlocks("about_sidebar"),
    ]);

  // Convert blocks to structured content with fallbacks
  const content: AboutPageContent = {
    hero: {
      label:
        heroBlocks.find((b) => b.blockKey === "hero_label")?.content || "Solo Developer Experiment",
      title:
        heroBlocks.find((b) => b.blockKey === "hero_title")?.content ||
        "Your Input Shapes\nWhat Gets Built",
      description:
        heroBlocks.find((b) => b.blockKey === "hero_description")?.content ||
        "This is an experiment in building products where the community has direct say in every decision. We're a small team (just me) sharing failures and wins transparently, learning together, and letting your feedback guide what gets created next.",
    },
    mission: {
      title: missionBlocks.find((b) => b.blockKey === "title")?.content || "Mission Statement",
      description:
        missionBlocks.find((b) => b.blockKey === "description")?.content ||
        "Building in the open with community feedback.",
    },
    newsletter: {
      title:
        newsletterBlocks.find((b) => b.blockKey === "title")?.content || "Follow Every Decision",
      description:
        newsletterBlocks.find((b) => b.blockKey === "description")?.content ||
        "Weekly insights when valuable content is ready. Be among the first 100 builders to get behind-the-scenes development updates.",
      buttonText:
        newsletterBlocks.find((b) => b.blockKey === "button_text")?.content || "Get Inside Access",
    },
    story: {
      intro:
        storyBlocks.find((b) => b.blockKey === "intro_paragraph")?.content ||
        "Like most developers, I've built plenty of things that nobody wanted. The pattern was always the same: great idea (I thought), months of solo development, launch to silence, wonder what went wrong.",
      problem:
        storyBlocks.find((b) => b.blockKey === "problem_paragraph")?.content ||
        "The problem wasn't the code—it was the isolation. I was solving problems that existed mostly in my head, building features based on assumptions instead of conversations with real people.",
      quote:
        storyBlocks.find((b) => b.blockKey === "quote")?.content ||
        "What if instead of building and then asking for feedback, I asked for feedback while building?",
      experiment:
        storyBlocks.find((b) => b.blockKey === "experiment_paragraph")?.content ||
        "So here's the experiment: I'm building everything completely in the open. Every technical decision gets discussed on X (@superoptimised). Every mistake gets documented. Every success gets shared transparently.",
      currentFocus:
        storyBlocks.find((b) => b.blockKey === "current_focus")?.content ||
        "Right now, we're building a magic link questionnaire system because the community voted that traditional signup forms kill honest feedback. But that choice came from real conversations, not boardroom assumptions.",
      uncertainty:
        storyBlocks.find((b) => b.blockKey === "uncertainty")?.content ||
        "I don't know where this experiment will lead. Maybe we'll build something genuinely useful. Maybe we'll discover that certain approaches don't work. Maybe we'll learn things that change how we think about building products altogether.",
      conclusion:
        storyBlocks.find((b) => b.blockKey === "conclusion")?.content ||
        "What I do know is that every conversation so far has been more valuable than any assumption I would have made alone. **Your input doesn't just inform the product—it becomes part of the story.**",
      callToAction:
        storyBlocks.find((b) => b.blockKey === "call_to_action")?.content ||
        "Want to help shape what gets built next? The most interesting conversations happen in real-time, where your feedback can change the direction before decisions are locked in.",
    },
    sidebar: {
      takeActionTitle:
        sidebarBlocks.find((b) => b.blockKey === "take_action_title")?.content || "Take Action",
      currentFocusTitle:
        sidebarBlocks.find((b) => b.blockKey === "current_focus_title")?.content || "Right Now",
      currentFocusData: parseJsonContent(
        sidebarBlocks.find((b) => b.blockKey === "current_focus_data")?.content || "{}"
      ) || {
        building: "Magic Links",
        learning: "User Feedback",
        next: "You Decide",
      },
    },
  };

  return <AboutPage content={content} />;
}
