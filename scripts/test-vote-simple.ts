#!/usr/bin/env npx tsx

import { prisma } from "../src/lib/db";

async function testVoteEndpoints() {
  console.log("🧪 Testing Vote System - Simple Database Test");

  try {
    // Get research questions
    const questions = await prisma.question.findMany({
      where: {
        isActive: true,
        category: "research",
      },
      take: 1,
    });

    if (questions.length === 0) {
      console.log("❌ No research questions found");
      return;
    }

    const question = questions[0];
    console.log("✅ Found question:", question.title);
    console.log("   ID:", question.id);
    console.log("   Type:", question.questionType);
    console.log("   Data:", JSON.stringify(question.questionData, null, 2));

    // Create test voter
    const voter = await prisma.voterToken.create({
      data: {
        tokenHash: `test-simple-${Date.now()}`,
        ipAddress: "127.0.0.1",
        voteCount: 0,
      },
    });

    console.log("✅ Created test voter:", voter.id);

    // Test vote submission
    const responseData = { selectedOption: "option1" };

    const vote = await prisma.questionResponse.create({
      data: {
        questionId: question.id,
        voterTokenId: voter.id,
        responseData: responseData,
        ipAddress: "127.0.0.1",
        userAgent: "Test-Simple",
      },
    });

    console.log("✅ Vote submitted successfully!");
    console.log("   Vote ID:", vote.id);
    console.log("   Response:", vote.responseData);

    // Test vote stats
    const stats = await prisma.questionResponse.groupBy({
      by: ["questionId"],
      where: { questionId: question.id },
      _count: { id: true },
    });

    console.log("✅ Vote stats retrieved:");
    console.log("   Total votes:", stats[0]?._count?.id || 0);

    // Clean up
    await prisma.questionResponse.delete({ where: { id: vote.id } });
    await prisma.voterToken.delete({ where: { id: voter.id } });

    console.log("🎉 ALL DATABASE OPERATIONS WORKING!");
    console.log("✅ The issue is NOT in the database layer");
    console.log("✅ The issue is likely in tRPC middleware or frontend");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testVoteEndpoints().catch(console.error);
