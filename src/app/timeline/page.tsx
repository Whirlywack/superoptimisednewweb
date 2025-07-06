import { ProjectTimelinePage } from "@/components/templates/ProjectTimelinePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Timeline | Superoptimised",
  description:
    "Track the development progress of our Magic Link Questionnaire System with real dates and milestones.",
  openGraph: {
    title: "Project Timeline | Superoptimised",
    description:
      "Building in public: Follow our development journey with real-time progress tracking.",
    type: "website",
  },
};

export default function TimelinePage() {
  return <ProjectTimelinePage />;
}
