import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkQuestions() {
  try {
    console.log("🔍 Checking questions in database...");

    // Check all questions
    const allQuestions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        questionType: true,
        isActive: true,
        questionData: true,
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    console.log(`📊 Total questions: ${allQuestions.length}`);

    // Check research questions specifically
    const researchQuestions = allQuestions.filter((q) => q.category === "research");
    console.log(`🔬 Research questions: ${researchQuestions.length}`);

    if (researchQuestions.length > 0) {
      console.log("\n📝 Research questions:");
      researchQuestions.forEach((q, index) => {
        console.log(`${index + 1}. ${q.title}`);
        console.log(`   - ID: ${q.id}`);
        console.log(`   - Type: ${q.questionType}`);
        console.log(`   - Active: ${q.isActive}`);
        console.log(`   - Responses: ${q._count.responses}`);
        console.log(`   - Options: ${JSON.stringify(q.questionData, null, 2)}`);
        console.log("");
      });
    } else {
      console.log("❌ No research questions found!");
    }

    // Check other categories
    const categories = [...new Set(allQuestions.map((q) => q.category))];
    console.log(`📂 Categories found: ${categories.join(", ")}`);
  } catch (error) {
    console.error("❌ Error checking questions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuestions();
