import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      isAdmin: true,
    },
  });

  // Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "user1@example.com" },
      update: {},
      create: {
        email: "user1@example.com",
        name: "John Doe",
        role: "user",
      },
    }),
    prisma.user.upsert({
      where: { email: "user2@example.com" },
      update: {},
      create: {
        email: "user2@example.com",
        name: "Jane Smith",
        role: "user",
      },
    }),
  ]);

  // Create questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        title: "What's your primary programming experience level?",
        description: "Help us understand your background",
        questionType: "multiple_choice",
        questionData: {
          options: [
            "Beginner (0-1 years)",
            "Intermediate (2-4 years)",
            "Advanced (5+ years)",
            "Expert (10+ years)",
          ],
        },
        category: "experience",
        isActive: true,
        displayOrder: 1,
      },
    }),
    prisma.question.create({
      data: {
        title: "Rate our service quality",
        description: "How would you rate your overall experience?",
        questionType: "rating",
        questionData: {
          scale: 5,
          labels: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
        },
        category: "feedback",
        isActive: true,
        displayOrder: 2,
      },
    }),
    prisma.question.create({
      data: {
        title: "Would you recommend us to others?",
        description: "Net Promoter Score question",
        questionType: "yes_no",
        questionData: {},
        category: "nps",
        isActive: true,
        displayOrder: 3,
      },
    }),
    prisma.question.create({
      data: {
        title: "Additional feedback",
        description: "Please share any additional thoughts or suggestions",
        questionType: "text",
        questionData: {
          maxLength: 500,
          multiline: true,
        },
        category: "feedback",
        isActive: true,
        displayOrder: 4,
      },
    }),
  ]);

  // Create questionnaires
  const questionnaire1 = await prisma.questionnaire.create({
    data: {
      title: "Product Experience Survey",
      description: "Help us improve our product based on your experience",
      category: "product",
      status: "active",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  const questionnaire2 = await prisma.questionnaire.create({
    data: {
      title: "User Satisfaction Research",
      description: "Understanding user satisfaction and areas for improvement",
      category: "research",
      status: "active",
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    },
  });

  // Link questions to questionnaires
  await Promise.all([
    prisma.questionnaireQuestion.create({
      data: {
        questionnaireId: questionnaire1.id,
        questionId: questions[0].id,
        displayOrder: 0,
        isRequired: true,
      },
    }),
    prisma.questionnaireQuestion.create({
      data: {
        questionnaireId: questionnaire1.id,
        questionId: questions[1].id,
        displayOrder: 1,
        isRequired: true,
      },
    }),
    prisma.questionnaireQuestion.create({
      data: {
        questionnaireId: questionnaire2.id,
        questionId: questions[2].id,
        displayOrder: 0,
        isRequired: true,
      },
    }),
    prisma.questionnaireQuestion.create({
      data: {
        questionnaireId: questionnaire2.id,
        questionId: questions[3].id,
        displayOrder: 1,
        isRequired: false,
      },
    }),
  ]);

  // Create voter tokens for anonymous responses
  const voterTokens = await Promise.all([
    prisma.voterToken.upsert({
      where: { tokenHash: "voter1_hash" },
      update: {},
      create: {
        tokenHash: "voter1_hash",
        ipAddress: "192.168.1.1",
        voteCount: 3,
      },
    }),
    prisma.voterToken.upsert({
      where: { tokenHash: "voter2_hash" },
      update: {},
      create: {
        tokenHash: "voter2_hash",
        ipAddress: "192.168.1.2",
        voteCount: 2,
      },
    }),
  ]);

  // Create questionnaire responses
  const responses = [];
  for (let i = 0; i < 156; i++) {
    const user = i % 3 === 0 ? users[i % 2] : null;
    const voterToken = i % 3 !== 0 ? voterTokens[i % 2] : null;
    const questionnaire = i % 2 === 0 ? questionnaire1 : questionnaire2;

    const response = await prisma.questionnaireResponse.create({
      data: {
        questionnaireId: questionnaire.id,
        userId: user?.id,
        voterTokenId: voterToken?.id,
        status: "completed",
        startedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      },
    });
    responses.push(response);
  }

  // Create individual question responses
  for (const response of responses.slice(0, 100)) {
    const questionIds =
      response.questionnaireId === questionnaire1.id
        ? [questions[0].id, questions[1].id]
        : [questions[2].id, questions[3].id];

    for (const questionId of questionIds) {
      const question = questions.find((q) => q.id === questionId);
      let responseData;

      switch (question?.questionType) {
        case "multiple_choice":
          responseData = { selected: Math.floor(Math.random() * 4) };
          break;
        case "rating":
          responseData = { rating: Math.floor(Math.random() * 5) + 1 };
          break;
        case "yes_no":
          responseData = { answer: Math.random() > 0.3 };
          break;
        case "text":
          responseData = { text: "Great service, keep up the good work!" };
          break;
        default:
          responseData = {};
      }

      await prisma.questionResponse.create({
        data: {
          questionId,
          userId: response.userId,
          voterTokenId: response.voterTokenId,
          questionnaireResponseId: response.id,
          responseData,
          ipAddress: response.ipAddress,
          createdAt: response.completedAt || response.startedAt,
        },
      });
    }
  }

  // Create blog posts with TypeScript content
  await Promise.all([
    prisma.post.upsert({
      where: { slug: "building-better-user-surveys" },
      update: {},
      create: {
        title: "Building Better User Surveys",
        slug: "building-better-user-surveys",
        excerpt: "Learn how to create effective surveys that get real insights from your users.",
        content: `"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { XPToastContext } from "../Homepage/XPToastProvider";

export function BuildingBetterUserSurveysContent() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast("+10 XP • Great insight!");
    setTimeout(() => setSelectedPoll(null), 2000);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    try {
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
        <div className="col-span-12 md:col-span-8">
          <div className="max-w-prose">
            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Most surveys fail because they ask the wrong questions to the wrong people at the wrong time. The result? Data that looks impressive but leads to poor decisions.
            </p>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              The Problem with Traditional Surveys
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Traditional surveys suffer from response bias, leading questions, and poor timing. Users either don't respond or give answers they think you want to hear.
            </p>

            <div className="mx-0 my-2xl max-w-prose rounded-lg border-2 border-light-gray bg-white p-lg">
              <div className="mb-md text-sm font-semibold leading-relaxed text-off-black">
                What's the biggest survey mistake you've seen?
              </div>
              <div className="mb-md flex flex-wrap gap-sm">
                {[
                  { value: "leading", label: "Leading Questions" },
                  { value: "timing", label: "Poor Timing" },
                  { value: "length", label: "Too Long" },
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
            </div>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              Building Better Surveys
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Effective surveys are short, contextual, and designed to capture genuine user sentiment. They integrate naturally into the user experience.
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">Key Takeaways</h3>
              <ul className="text-sm text-warm-gray space-y-2">
                <li>• Keep surveys under 5 questions</li>
                <li>• Ask at the right moment</li>
                <li>• Use neutral language</li>
                <li>• Test with real users first</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`,
        contentType: "tsx",
        postType: "blog",
        status: "published",
        featured: true,
        authorId: adminUser.id,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.post.upsert({
      where: { slug: "analytics-deep-dive" },
      update: {},
      create: {
        title: "Analytics Deep Dive",
        slug: "analytics-deep-dive",
        excerpt: "Exploring advanced analytics techniques for questionnaire data.",
        content: `"use client";

import React, { useState } from "react";

export function AnalyticsDeepDiveContent() {
  return (
    <section className="w-full px-4 py-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
          <div className="max-w-prose">
            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Data without context is just numbers. Understanding your questionnaire analytics requires looking beyond response rates to find the real insights.
            </p>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              Beyond Response Rates
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Most teams focus on quantity metrics like response rates and completion percentages. But the real insights come from understanding user behavior patterns.
            </p>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              Key Metrics That Matter
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Track time spent per question, abandonment points, and sentiment analysis. These reveal what users actually think, not just what they say.
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">Analytics Checklist</h3>
              <ul className="text-sm text-warm-gray space-y-2">
                <li>• Time per question analysis</li>
                <li>• Drop-off point identification</li>
                <li>• Sentiment trend tracking</li>
                <li>• Response quality scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`,
        contentType: "tsx",
        postType: "blog",
        status: "published",
        featured: false,
        authorId: adminUser.id,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.post.upsert({
      where: { slug: "future-of-user-research" },
      update: {},
      create: {
        title: "Future of User Research",
        slug: "future-of-user-research",
        excerpt: "What's next in the world of user research and feedback collection.",
        content: `"use client";

import React from "react";

export function FutureOfUserResearchContent() {
  return (
    <section className="w-full px-4 py-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
          <div className="max-w-prose">
            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              User research is evolving from periodic surveys to continuous, contextual feedback loops. The future is about understanding users in real-time.
            </p>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              Continuous Feedback Loops
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Instead of quarterly surveys, successful products are building feedback directly into the user experience. Micro-interactions that capture sentiment without interrupting flow.
            </p>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              AI-Powered Insights
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Machine learning will help us understand not just what users say, but what they mean. Pattern recognition in user behavior will reveal insights humans miss.
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">Future Trends</h3>
              <ul className="text-sm text-warm-gray space-y-2">
                <li>• Real-time sentiment analysis</li>
                <li>• Behavioral pattern recognition</li>
                <li>• Contextual micro-surveys</li>
                <li>• Predictive user needs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`,
        contentType: "tsx",
        postType: "blog",
        status: "draft",
        featured: false,
        authorId: adminUser.id,
      },
    }),
  ]);

  // Create engagement stats
  await Promise.all([
    prisma.engagementStats.upsert({
      where: { userId: users[0].id },
      update: {},
      create: {
        userId: users[0].id,
        currentStreak: 5,
        longestStreak: 10,
        totalVotes: 25,
        totalXp: 250,
        lastActivity: new Date(),
      },
    }),
    prisma.engagementStats.upsert({
      where: { voterTokenId: voterTokens[0].id },
      update: {},
      create: {
        voterTokenId: voterTokens[0].id,
        currentStreak: 3,
        longestStreak: 7,
        totalVotes: 15,
        totalXp: 150,
        lastActivity: new Date(),
      },
    }),
  ]);

  // Create analytics daily data
  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    await prisma.analyticsDaily.upsert({
      where: { date },
      update: {},
      create: {
        date,
        totalVotes: Math.floor(Math.random() * 50) + 10,
        uniqueVoters: Math.floor(Math.random() * 30) + 5,
        totalXpEarned: Math.floor(Math.random() * 200) + 50,
        newsletterSignups: Math.floor(Math.random() * 5),
        popularQuestions: JSON.stringify([
          { questionId: questions[0].id, votes: Math.floor(Math.random() * 20) + 5 },
          { questionId: questions[1].id, votes: Math.floor(Math.random() * 15) + 3 },
        ]),
      },
    });
  }

  // Create project stats
  await Promise.all([
    prisma.projectStat.upsert({
      where: { statKey: "total_users" },
      update: {},
      create: {
        statKey: "total_users",
        statValue: "1247",
        description: "Total registered users",
      },
    }),
    prisma.projectStat.upsert({
      where: { statKey: "total_questionnaires" },
      update: {},
      create: {
        statKey: "total_questionnaires",
        statValue: "42",
        description: "Total questionnaires created",
      },
    }),
    prisma.projectStat.upsert({
      where: { statKey: "total_responses" },
      update: {},
      create: {
        statKey: "total_responses",
        statValue: "389",
        description: "Total questionnaire responses",
      },
    }),
  ]);

  // Create content templates
  const existingTemplate = await prisma.contentTemplate.findFirst({
    where: { title: "Superoptimised Blog Post" },
  });

  if (!existingTemplate) {
    await prisma.contentTemplate.create({
      data: {
        title: "Superoptimised Blog Post",
        description:
          "Complete blog post template with elevated brutalism design, interactive polls, newsletter CTAs, and community engagement features",
        category: "Blog",
        contentType: "tsx",
        defaultContent: `"use client";

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
}`,
        usage: 0,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`Created:`);
  console.log(`- ${users.length + 1} users (including admin)`);
  console.log(`- ${questions.length} questions`);
  console.log(`- 2 questionnaires`);
  console.log(`- ${responses.length} questionnaire responses`);
  console.log(`- 3 blog posts`);
  console.log(`- 30 days of analytics data`);
  console.log(`- Engagement stats and project stats`);
  console.log(`- 1 content template (Superoptimised Blog Post)`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
