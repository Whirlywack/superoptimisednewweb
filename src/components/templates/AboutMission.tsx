import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import {
  Users,
  Lightbulb,
  Target,
  ArrowRight,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Calendar,
  BookOpen,
  Star,
} from "lucide-react";

interface Value {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  metric?: string;
}

interface ContactMethod {
  type: string;
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface AboutMissionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  story?: string;
  mission?: string;
  vision?: string;
  values?: Value[];
  team?: TeamMember[];
  milestones?: Milestone[];
  contactMethods?: ContactMethod[];
  showTeam?: boolean;
  showMilestones?: boolean;
  showContact?: boolean;
  showValues?: boolean;
  onContactClick?: (method: ContactMethod) => void;
  onTeamMemberClick?: (member: TeamMember) => void;
  className?: string;
}

export function AboutMission({
  title = "Our Mission",
  subtitle = "Building transparent tools and sharing authentic experiences in the developer community",
  story = "We believe that the best software is built in public, with transparency, community feedback, and continuous learning at its core.",
  mission = "To democratize access to high-quality development tools and knowledge by building everything in public and sharing the complete journey.",
  vision = "A world where every developer has access to the tools, knowledge, and community they need to build amazing things.",
  values = [],
  team = [],
  milestones = [],
  contactMethods = [],
  showTeam = true,
  showMilestones = true,
  showContact = true,
  showValues = true,
  onContactClick,
  onTeamMemberClick,
  className,
  ...props
}: AboutMissionProps) {
  const defaultValues: Value[] = [
    {
      id: "transparency",
      title: "Radical Transparency",
      description:
        "We share our successes, failures, metrics, and decision-making process openly with the community.",
      icon: BookOpen,
    },
    {
      id: "community",
      title: "Community First",
      description:
        "Every feature, design decision, and strategic choice is influenced by genuine community feedback.",
      icon: Users,
    },
    {
      id: "learning",
      title: "Continuous Learning",
      description:
        "We approach every challenge as a learning opportunity and share our insights with others.",
      icon: Lightbulb,
    },
    {
      id: "quality",
      title: "Sustainable Quality",
      description:
        "Building tools that stand the test of time through thoughtful architecture and user-centered design.",
      icon: Target,
    },
  ];

  const defaultTeam: TeamMember[] = [
    {
      id: "founder",
      name: "Alex Chen",
      role: "Founder & Lead Developer",
      bio: "Full-stack developer passionate about building in public and creating tools that empower other developers.",
      social: {
        github: "https://github.com/alexchen",
        twitter: "https://twitter.com/alexchen",
        linkedin: "https://linkedin.com/in/alexchen",
      },
    },
  ];

  const defaultMilestones: Milestone[] = [
    {
      id: "launch",
      title: "Public Launch",
      description:
        "Launched the first version of our platform with core features and community feedback integration.",
      date: "2023-01-15",
      metric: "100 users",
    },
    {
      id: "community",
      title: "Community Growth",
      description:
        "Reached our first major community milestone with active contributors and feature requests.",
      date: "2023-06-01",
      metric: "1,000 users",
    },
    {
      id: "platform",
      title: "Platform Expansion",
      description:
        "Released comprehensive developer tools and expanded our open source component library.",
      date: "2023-12-01",
      metric: "10,000 users",
    },
  ];

  const defaultContactMethods: ContactMethod[] = [
    {
      type: "email",
      label: "Email Us",
      value: "hello@superoptimised.com",
      href: "mailto:hello@superoptimised.com",
      icon: Mail,
    },
    {
      type: "github",
      label: "GitHub Discussions",
      value: "Join the conversation",
      href: "https://github.com/superoptimised/discussions",
      icon: Github,
    },
    {
      type: "twitter",
      label: "Twitter",
      value: "@superoptimised",
      href: "https://twitter.com/superoptimised",
      icon: Twitter,
    },
  ];

  const displayValues = values.length > 0 ? values : defaultValues;
  const displayTeam = team.length > 0 ? team : defaultTeam;
  const displayMilestones = milestones.length > 0 ? milestones : defaultMilestones;
  const displayContactMethods = contactMethods.length > 0 ? contactMethods : defaultContactMethods;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className={cn("min-h-screen bg-off-white dark:bg-off-black", className)} {...props}>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-4xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold leading-tight text-off-black dark:text-off-white lg:text-5xl">
            {title}
          </h1>

          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-warm-gray">{subtitle}</p>

          <div className="rounded-lg bg-light-gray/50 p-8 text-left dark:bg-warm-gray/10">
            <p className="text-lg leading-relaxed text-warm-gray">{story}</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-light-gray/30 py-16 dark:bg-warm-gray/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Mission */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <LucideIcon icon={Target} size="lg" className="text-primary" />
                <h2 className="text-2xl font-bold text-off-black dark:text-off-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-warm-gray">{mission}</p>
            </div>

            {/* Vision */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <LucideIcon icon={Star} size="lg" className="text-primary" />
                <h2 className="text-2xl font-bold text-off-black dark:text-off-white">
                  Our Vision
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-warm-gray">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      {showValues && displayValues.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-off-black dark:text-off-white">
                Our Values
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-warm-gray">
                The principles that guide every decision we make and every feature we build.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {displayValues.map((value) => (
                <div
                  key={value.id}
                  className="space-y-4 rounded-lg border border-light-gray bg-off-white p-8 dark:border-warm-gray/30 dark:bg-off-black"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <LucideIcon icon={value.icon} size="md" className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
                      {value.title}
                    </h3>
                  </div>
                  <p className="leading-relaxed text-warm-gray">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Milestones */}
      {showMilestones && displayMilestones.length > 0 && (
        <section className="bg-light-gray/30 py-16 dark:bg-warm-gray/5">
          <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-off-black dark:text-off-white">
                Our Journey
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-warm-gray">
                Key milestones in our transparent building journey.
              </p>
            </div>

            <div className="space-y-8">
              {displayMilestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex gap-6">
                  {/* Timeline Line */}
                  {index < displayMilestones.length - 1 && (
                    <div className="absolute left-4 top-12 h-16 w-0.5 bg-light-gray dark:bg-warm-gray/30" />
                  )}

                  {/* Timeline Dot */}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <div className="size-3 rounded-full bg-off-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2 pb-8">
                    <div className="flex flex-wrap items-center gap-4">
                      <h3 className="text-lg font-semibold text-off-black dark:text-off-white">
                        {milestone.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-warm-gray">
                        <LucideIcon icon={Calendar} size="xs" />
                        <span>{formatDate(milestone.date)}</span>
                      </div>
                      {milestone.metric && (
                        <span className="rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                          {milestone.metric}
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed text-warm-gray">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {showTeam && displayTeam.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-off-black dark:text-off-white">
                Meet the Team
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-warm-gray">
                The people building this platform and sharing the journey with you.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayTeam.map((member) => (
                <div
                  key={member.id}
                  onClick={() => onTeamMemberClick?.(member)}
                  className={cn(
                    "space-y-4 rounded-lg border border-light-gray bg-off-white p-6 text-center dark:border-warm-gray/30 dark:bg-off-black",
                    onTeamMemberClick && "cursor-pointer transition-colors hover:border-primary/50"
                  )}
                >
                  {/* Avatar */}
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="mx-auto size-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-light-gray dark:bg-warm-gray/20">
                      <LucideIcon icon={Users} size="lg" className="text-warm-gray" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-off-black dark:text-off-white">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-primary">{member.role}</p>
                    <p className="text-sm leading-relaxed text-warm-gray">{member.bio}</p>
                  </div>

                  {/* Social Links */}
                  {member.social && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                      {member.social.github && (
                        <Link
                          href={member.social.github}
                          external
                          className="text-warm-gray hover:text-primary"
                        >
                          <LucideIcon icon={Github} size="sm" />
                        </Link>
                      )}
                      {member.social.twitter && (
                        <Link
                          href={member.social.twitter}
                          external
                          className="text-warm-gray hover:text-primary"
                        >
                          <LucideIcon icon={Twitter} size="sm" />
                        </Link>
                      )}
                      {member.social.linkedin && (
                        <Link
                          href={member.social.linkedin}
                          external
                          className="text-warm-gray hover:text-primary"
                        >
                          <LucideIcon icon={Linkedin} size="sm" />
                        </Link>
                      )}
                      {member.social.website && (
                        <Link
                          href={member.social.website}
                          external
                          className="text-warm-gray hover:text-primary"
                        >
                          <LucideIcon icon={Globe} size="sm" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {showContact && displayContactMethods.length > 0 && (
        <section className="bg-light-gray/30 py-16 dark:bg-warm-gray/5">
          <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-off-black dark:text-off-white">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-warm-gray">
                We&apos;d love to hear from you. Whether you have questions, feedback, or just want
                to connect.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {displayContactMethods.map((method) => (
                <div
                  key={method.type}
                  onClick={() => onContactClick?.(method)}
                  className={cn(
                    "space-y-4 rounded-lg border border-light-gray bg-off-white p-6 text-center dark:border-warm-gray/30 dark:bg-off-black",
                    "cursor-pointer transition-colors hover:border-primary/50"
                  )}
                >
                  <div className="mx-auto w-fit rounded-lg bg-primary/10 p-3">
                    <LucideIcon icon={method.icon} size="lg" className="text-primary" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-off-black dark:text-off-white">
                      {method.label}
                    </h3>
                    <p className="text-sm text-warm-gray">{method.value}</p>
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={method.href}
                      external={method.type !== "email"}
                      className="no-underline"
                    >
                      <span>Connect</span>
                      <LucideIcon icon={ArrowRight} size="xs" className="ml-2" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
