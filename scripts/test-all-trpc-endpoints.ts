#!/usr/bin/env npx tsx

/**
 * Comprehensive tRPC Endpoint Testing
 * Tests all research page related tRPC endpoints
 */

import { prisma } from "../src/lib/db";

async function testAllTRPCEndpoints() {
  console.log("🧪 Testing ALL tRPC Endpoints for Research Page\n");

  try {
    // Setup: Create a test voter token
    const testVoter = await prisma.voterToken.create({
      data: {
        tokenHash: `trpc-test-${Date.now()}`,
        ipAddress: "127.0.0.1",
        voteCount: 0,
      },
    });

    console.log(`🎫 Created test voter: ${testVoter.id}\n`);

    // Test 1: question.getActiveQuestions
    console.log("📋 Test 1: question.getActiveQuestions");
    try {
      const response = await fetch(
        "http://localhost:3000/api/trpc/question.getActiveQuestions?input=%7B%22category%22%3A%22research%22%2C%22limit%22%3A5%7D"
      );
      const data = await response.json();

      if (response.ok && data.result?.data) {
        console.log("✅ question.getActiveQuestions: SUCCESS");
        console.log(`   Questions found: ${data.result.data.length}`);
        data.result.data.forEach((q: any, i: number) => {
          console.log(`   ${i + 1}. ${q.id}: ${q.questionType}`);
        });
      } else {
        console.log("❌ question.getActiveQuestions: FAILED");
        console.log("   Error:", data.error?.message || "Unknown error");
      }
    } catch (error) {
      console.log("❌ question.getActiveQuestions: NETWORK ERROR");
      console.log("   Error:", error);
    }

    // Test 2: Get a specific question for vote testing
    console.log("\n📋 Test 2: Getting AB-test question for vote test");
    const abTestQuestion = await prisma.question.findFirst({
      where: { questionType: "ab-test", isActive: true, category: "research" },
    });

    if (!abTestQuestion) {
      console.log("❌ No AB-test question found for testing");
      return;
    }

    console.log(`✅ Found test question: ${abTestQuestion.id} - ${abTestQuestion.title}`);

    // Test 3: vote.submitVote
    console.log("\n📤 Test 3: vote.submitVote");
    try {
      const voteData = {
        questionId: abTestQuestion.id,
        response: { selectedOption: "magic-link" },
      };

      const response = await fetch("http://localhost:3000/api/trpc/vote.submitVote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `voterToken=${testVoter.tokenHash}`,
        },
        body: JSON.stringify(voteData),
      });

      const data = await response.json();

      if (response.ok && data.result?.data?.success) {
        console.log("✅ vote.submitVote: SUCCESS");
        console.log(`   Vote ID: ${data.result.data.voteId}`);
        console.log(`   Message: ${data.result.data.message}`);

        // Store vote ID for cleanup
        const voteId = data.result.data.voteId;

        // Test 4: vote.getVoteStats
        console.log("\n📊 Test 4: vote.getVoteStats");
        try {
          const statsUrl = `http://localhost:3000/api/trpc/vote.getVoteStats?input=%7B%22questionId%22%3A%22${abTestQuestion.id}%22%7D`;
          const statsResponse = await fetch(statsUrl);
          const statsData = await statsResponse.json();

          if (statsResponse.ok && statsData.result?.data) {
            console.log("✅ vote.getVoteStats: SUCCESS");
            console.log(`   Total votes: ${statsData.result.data.totalVotes}`);
            console.log(`   Breakdown:`, statsData.result.data.breakdown);
          } else {
            console.log("❌ vote.getVoteStats: FAILED");
            console.log("   Error:", statsData.error?.message || "Unknown error");
          }
        } catch (error) {
          console.log("❌ vote.getVoteStats: NETWORK ERROR");
          console.log("   Error:", error);
        }

        // Test 5: vote.getUserVoteHistory
        console.log("\n📚 Test 5: vote.getUserVoteHistory");
        try {
          const historyResponse = await fetch(
            "http://localhost:3000/api/trpc/vote.getUserVoteHistory",
            {
              headers: {
                Cookie: `voterToken=${testVoter.tokenHash}`,
              },
            }
          );
          const historyData = await historyResponse.json();

          if (historyResponse.ok && historyData.result?.data) {
            console.log("✅ vote.getUserVoteHistory: SUCCESS");
            console.log(`   Total votes: ${historyData.result.data.votes.length}`);
            console.log(`   Total XP: ${historyData.result.data.totalXp}`);
          } else {
            console.log("❌ vote.getUserVoteHistory: FAILED");
            console.log("   Error:", historyData.error?.message || "Unknown error");
          }
        } catch (error) {
          console.log("❌ vote.getUserVoteHistory: NETWORK ERROR");
          console.log("   Error:", error);
        }

        // Test 6: vote.getEngagementStats
        console.log("\n🎯 Test 6: vote.getEngagementStats");
        try {
          const engagementUrl = `http://localhost:3000/api/trpc/vote.getEngagementStats?input=%7B%22voterTokenId%22%3A%22${testVoter.id}%22%2C%22includeMilestones%22%3Atrue%7D`;
          const engagementResponse = await fetch(engagementUrl);
          const engagementData = await engagementResponse.json();

          if (engagementResponse.ok && engagementData.result?.data) {
            console.log("✅ vote.getEngagementStats: SUCCESS");
            console.log(`   Global total XP: ${engagementData.result.data.global.totalXpEarned}`);
            console.log(`   User votes: ${engagementData.result.data.user?.totalVotes || 0}`);
          } else {
            console.log("❌ vote.getEngagementStats: FAILED");
            console.log("   Error:", engagementData.error?.message || "Unknown error");
          }
        } catch (error) {
          console.log("❌ vote.getEngagementStats: NETWORK ERROR");
          console.log("   Error:", error);
        }

        // Test 7: content.getCommunityStats
        console.log("\n🌍 Test 7: content.getCommunityStats");
        try {
          const communityResponse = await fetch(
            "http://localhost:3000/api/trpc/content.getCommunityStats?input=%7B%22includeDaily%22%3Afalse%7D"
          );
          const communityData = await communityResponse.json();

          if (communityResponse.ok && communityData.result?.data) {
            console.log("✅ content.getCommunityStats: SUCCESS");
            console.log(`   Total votes: ${communityData.result.data.totalVotes}`);
            console.log(`   Unique voters: ${communityData.result.data.uniqueVoters}`);
          } else {
            console.log("❌ content.getCommunityStats: FAILED");
            console.log("   Error:", communityData.error?.message || "Unknown error");
          }
        } catch (error) {
          console.log("❌ content.getCommunityStats: NETWORK ERROR");
          console.log("   Error:", error);
        }

        // Clean up the test vote
        if (voteId) {
          await prisma.questionResponse.delete({ where: { id: voteId } });
          console.log("\n🧹 Test vote cleaned up");
        }
      } else {
        console.log("❌ vote.submitVote: FAILED");
        console.log("   Error:", data.error?.message || "Unknown error");
        if (data.error?.data) {
          console.log("   Details:", data.error.data);
        }
      }
    } catch (error) {
      console.log("❌ vote.submitVote: NETWORK ERROR");
      console.log("   Error:", error);
    }

    // Clean up test voter
    await prisma.voterToken.delete({ where: { id: testVoter.id } });
    console.log("\n🧹 Test voter cleaned up");

    console.log("\n🎉 tRPC Endpoint Testing Complete!");
    console.log("\nIf all tests passed, the research page should work correctly.");
    console.log("If any tests failed, those endpoints need debugging.");
  } catch (error) {
    console.error("❌ Test setup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAllTRPCEndpoints().catch(console.error);
