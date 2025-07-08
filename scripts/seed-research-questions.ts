import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const researchQuestions = [
  {
    title:
      "What type of live interaction would make you most likely to participate in community decisions?",
    description: "Real-Time Engagement",
    questionType: "binary",
    category: "research",
    questionData: {
      options: ["live-voting", "qa-sessions"],
      optionLabels: {
        "live-voting": "Live voting sessions with real-time results",
        "qa-sessions": "Scheduled Q&A sessions with founders",
      },
      optionDescriptions: {
        "live-voting":
          "Watch vote counts change as people participate, see immediate community sentiment",
        "qa-sessions": "Join live discussions where you can ask questions and get direct responses",
      },
    },
    displayOrder: 1,
  },
  {
    title: "Which feedback mechanism would you find most valuable?",
    description: "Community Feedback Loops",
    questionType: "binary",
    category: "research",
    questionData: {
      options: ["comment-threads", "follow-up-polls"],
      optionLabels: {
        "comment-threads": "Comment threads under each question",
        "follow-up-polls": "Follow-up polls based on results",
      },
      optionDescriptions: {
        "comment-threads": "Explain your reasoning, debate with others, see different perspectives",
        "follow-up-polls": "Dive deeper into winning answers with more specific sub-questions",
      },
    },
    displayOrder: 2,
  },
  {
    title: "What would motivate you to answer more questionnaires?",
    description: "Gamification Level",
    questionType: "binary",
    category: "research",
    questionData: {
      options: ["leaderboards", "exclusive-insights"],
      optionLabels: {
        leaderboards: "Leaderboards and community recognition",
        "exclusive-insights": "Access to exclusive founder insights",
      },
      optionDescriptions: {
        leaderboards: "See top contributors, earn badges, get featured for thoughtful responses",
        "exclusive-insights":
          "Unlock behind-the-scenes content, early access to results, private discussions",
      },
    },
    displayOrder: 3,
  },
  {
    title: "How would you prefer to explore questionnaire results?",
    description: "Data Interaction",
    questionType: "binary",
    category: "research",
    questionData: {
      options: ["data-visualizations", "community-analysis"],
      optionLabels: {
        "data-visualizations": "Interactive data visualizations",
        "community-analysis": "Community-generated analysis and discussions",
      },
      optionDescriptions: {
        "data-visualizations":
          "Filter by demographics, compare across time, drill down into specific segments",
        "community-analysis":
          "Read interpretations from other members, contribute your own insights",
      },
    },
    displayOrder: 4,
  },
];

async function seedResearchQuestions() {
  try {
    console.log("🌱 Seeding research questions...");

    // First, deactivate any existing research questions to avoid conflicts
    await prisma.question.updateMany({
      where: { category: "research" },
      data: { isActive: false },
    });

    // Create new research questions
    for (const question of researchQuestions) {
      const created = await prisma.question.create({
        data: question,
      });
      console.log(`✅ Created question: "${created.title}"`);
    }

    console.log("🎉 Research questions seeded successfully!");
    console.log(`📊 Added ${researchQuestions.length} questions to the database`);

    // Verify the questions are there
    const count = await prisma.question.count({
      where: { category: "research", isActive: true },
    });
    console.log(`🔍 Verification: ${count} active research questions in database`);
  } catch (error) {
    console.error("❌ Error seeding research questions:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedResearchQuestions().catch((error) => {
  console.error(error);
  process.exit(1);
});
