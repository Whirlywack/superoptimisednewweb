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
        headers.set("x-trpc-source", "test-script");
        return headers;
      },
      transformer: SuperJSON,
    }),
  ],
});

async function testBasicEndpoints() {
  console.log("🧪 Testing basic tRPC endpoints...\n");

  try {
    // Test 1: getActiveQuestions
    console.log("1. Testing getActiveQuestions...");
    const questions = await trpcClient.question.getActiveQuestions.query({});
    console.log(`✅ Got ${questions.length} questions`);

    if (questions.length > 0) {
      console.log("First question:", {
        id: questions[0].id,
        title: questions[0].title,
        questionType: questions[0].questionType,
        questionData: questions[0].questionData,
      });
    }

    if (questions.length > 0) {
      const questionId = questions[0].id;
      console.log(`\n2. Testing getVoteStats with ID: ${questionId}`);

      try {
        const voteStats = await trpcClient.vote.getVoteStats.query({ questionId });
        console.log("✅ Vote stats retrieved:", voteStats);
      } catch (error) {
        console.log("❌ Vote stats failed:", error);
      }

      console.log(`\n3. Testing submitVote with ID: ${questionId}`);
      try {
        const submitResult = await trpcClient.vote.submitVote.mutate({
          questionId,
          response: "yes",
        });
        console.log("✅ Vote submitted:", submitResult);
      } catch (error) {
        console.log("❌ Vote submission failed:", error);
      }
    }

    // Test 4: getEngagementStats
    console.log("\n4. Testing getEngagementStats...");
    try {
      const engagementStats = await trpcClient.vote.getEngagementStats.query({});
      console.log("✅ Engagement stats retrieved:", engagementStats);
    } catch (error) {
      console.log("❌ Engagement stats failed:", error);
    }

    // Test 5: getCommunityStats
    console.log("\n5. Testing getCommunityStats...");
    try {
      const communityStats = await trpcClient.content.getCommunityStats.query({});
      console.log("✅ Community stats retrieved:", communityStats);
    } catch (error) {
      console.log("❌ Community stats failed:", error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testBasicEndpoints();
