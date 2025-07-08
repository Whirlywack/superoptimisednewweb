#!/usr/bin/env npx tsx

import { prisma } from "../src/lib/db";

async function testVoteSubmission() {
  console.log("🧪 Testing Vote Submission for AB-Test Question");

  try {
    // Get the AB-test question
    const abTestQuestion = await prisma.question.findFirst({
      where: { questionType: "ab-test", isActive: true, category: "research" },
    });

    if (!abTestQuestion) {
      console.log("❌ No AB-test question found");
      return;
    }

    console.log("✅ Found AB-test question:", abTestQuestion.title);
    console.log("   ID:", abTestQuestion.id);
    console.log("   Type:", abTestQuestion.questionType);

    // Create a test voter
    const voter = await prisma.voterToken.create({
      data: {
        tokenHash: `test-vote-${Date.now()}`,
        ipAddress: "127.0.0.1",
        voteCount: 0,
      },
    });

    console.log("✅ Created test voter:", voter.id);

    // Test response data similar to what AB-test component would send
    const responseData = { selectedOption: "magic-link" };

    try {
      const voteResponse = await prisma.questionResponse.create({
        data: {
          questionId: abTestQuestion.id,
          voterTokenId: voter.id,
          responseData: responseData,
          ipAddress: "127.0.0.1",
          userAgent: "Test-Vote-Submission",
        },
      });

      console.log("✅ Vote submission successful!");
      console.log("   Vote ID:", voteResponse.id);
      console.log("   Response Data:", voteResponse.responseData);

      // Clean up
      await prisma.questionResponse.delete({ where: { id: voteResponse.id } });
      await prisma.voterToken.delete({ where: { id: voter.id } });

      console.log("✅ Test completed successfully - vote submission works!");
    } catch (error) {
      console.log("❌ Vote submission failed:", error);

      // Clean up voter
      await prisma.voterToken.delete({ where: { id: voter.id } });
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testVoteSubmission().catch(console.error);
