#!/usr/bin/env npx tsx

import { createCaller } from "../src/lib/api/root";
import { createTRPCContext } from "../src/lib/api/trpc";
import { prisma } from "../src/lib/db";

async function testTRPCVoteSubmission() {
  console.log("🧪 Testing tRPC Vote Submission");

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

    // Create a test voter token
    const voterToken = await prisma.voterToken.create({
      data: {
        tokenHash: `trpc-test-${Date.now()}`,
        ipAddress: "127.0.0.1",
        voteCount: 0,
      },
    });

    console.log("✅ Created test voter:", voterToken.id);

    // Create tRPC context similar to what would happen in the browser
    const ctx = await createTRPCContext({
      req: {
        headers: {
          "x-forwarded-for": "127.0.0.1",
          "user-agent": "Test-tRPC-Client",
          cookie: `voterToken=${voterToken.tokenHash}`,
        },
      } as any,
      res: {} as any,
    });

    // Create the tRPC caller
    const caller = createCaller(ctx);

    // Test AB-test vote submission
    const responseData = { selectedOption: "magic-link" };

    console.log("📤 Submitting vote via tRPC...");
    console.log("   Question ID:", abTestQuestion.id);
    console.log("   Response Data:", responseData);

    try {
      const result = await caller.vote.submitVote({
        questionId: abTestQuestion.id,
        response: responseData,
      });

      console.log("✅ tRPC Vote submission successful!");
      console.log("   Result:", result);

      // Clean up the vote
      if (result.voteId) {
        await prisma.questionResponse.delete({ where: { id: result.voteId } });
      }
    } catch (error) {
      console.log("❌ tRPC Vote submission failed:");
      console.log("   Error:", error.message);
      console.log("   Code:", error.code);
      console.log("   Data:", error.data);
    }

    // Clean up voter
    await prisma.voterToken.delete({ where: { id: voterToken.id } });
  } catch (error) {
    console.error("❌ Test setup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testTRPCVoteSubmission().catch(console.error);
