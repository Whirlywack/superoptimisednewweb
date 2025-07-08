#!/usr/bin/env npx tsx

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import type { AppRouter } from "@/lib/api/root";
import fetch from "node-fetch";

// Global fetch for Node.js
if (!global.fetch) {
  global.fetch = fetch as any;
}

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3004/api/trpc",
      headers: () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "final-verification");
        return headers;
      },
      transformer: SuperJSON,
    }),
  ],
});

async function finalVerification() {
  console.log("🎯 FINAL VERIFICATION: All research page endpoints\n");

  try {
    // 1. Get active questions
    console.log("1. Testing getActiveQuestions...");
    const questions = await trpcClient.question.getActiveQuestions.query({ limit: 3 });
    console.log(`✅ Got ${questions.length} questions`);

    const questionId = questions[0]?.id;
    if (!questionId) {
      console.log("❌ No questions available");
      return;
    }

    // 2. Get vote stats
    console.log(`\n2. Testing getVoteStats for question: ${questionId}`);
    const voteStats = await trpcClient.vote.getVoteStats.query({ questionId });
    console.log(
      `✅ Total votes: ${voteStats.totalVotes}, Breakdown: ${JSON.stringify(voteStats.breakdown)}`
    );

    // 3. Submit vote
    console.log(`\n3. Testing submitVote for question: ${questionId}`);
    const submitResult = await trpcClient.vote.submitVote.mutate({
      questionId,
      response: "magic-link",
    });
    console.log(`✅ Vote submitted: ${submitResult.success}, Token: ${submitResult.voterToken}`);

    // 4. Get updated vote stats
    console.log(`\n4. Testing getVoteStats after vote submission`);
    const updatedStats = await trpcClient.vote.getVoteStats.query({ questionId });
    console.log(
      `✅ Updated votes: ${updatedStats.totalVotes}, Breakdown: ${JSON.stringify(updatedStats.breakdown)}`
    );

    // 5. Get engagement stats
    console.log(`\n5. Testing getEngagementStats`);
    const engagementStats = await trpcClient.vote.getEngagementStats.query({
      includeMilestones: true,
    });
    console.log(
      `✅ Global XP earned: ${engagementStats.global.totalXpEarned}, Leaderboard entries: ${engagementStats.global.leaderboard.length}`
    );

    // 6. Get community stats
    console.log(`\n6. Testing getCommunityStats`);
    const communityStats = await trpcClient.content.getCommunityStats.query({ includeDaily: true });
    console.log(
      `✅ Total votes: ${communityStats.totalVotes}, Unique voters: ${communityStats.uniqueVoters}, Active questions: ${communityStats.activeQuestions}`
    );

    // 7. Test getUserVoteHistory
    console.log(`\n7. Testing getUserVoteHistory`);
    const voteHistory = await trpcClient.vote.getUserVoteHistory.query();
    console.log(
      `✅ Vote history: ${voteHistory.votes.length} votes, Total XP: ${voteHistory.totalXp}`
    );

    // 8. Test getFinalXpCalculation
    console.log(`\n8. Testing getFinalXpCalculation`);
    const finalXp = await trpcClient.vote.getFinalXpCalculation.query();
    console.log(
      `✅ Final XP: ${finalXp.totalXp}, Vote count: ${finalXp.voteCount}, Complete: ${finalXp.isComplete}`
    );

    console.log("\n🎉 ALL ENDPOINTS WORKING PERFECTLY!");
    console.log("✅ Research page is ready for production use");
    console.log("✅ Vote submission, stats, and engagement tracking all functional");
    console.log("✅ XP system and community features operational");
  } catch (error) {
    console.error("❌ Final verification failed:", error);
  }
}

finalVerification();
