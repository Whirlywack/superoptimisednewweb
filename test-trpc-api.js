import { createTRPCClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";

// Create a simple tRPC client for testing
const trpcClient = createTRPCClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      headers: () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "test-script");
        return headers;
      },
      transformer: SuperJSON,
    }),
  ],
});

async function testTRPCAPI() {
  console.log("🔍 Testing tRPC Content Blocks API...\n");

  try {
    // Test 1: Get all content blocks for about_hero
    console.log("1. Testing about_hero content blocks:");
    const aboutHeroBlocks = await trpcClient.content.getContentBlocks.query({
      pageKey: "about_hero",
    });
    console.log("Response:", JSON.stringify(aboutHeroBlocks, null, 2));

    // Test 2: Get all content blocks for about_mission
    console.log("\n2. Testing about_mission content blocks:");
    const aboutMissionBlocks = await trpcClient.content.getContentBlocks.query({
      pageKey: "about_mission",
    });
    console.log("Response:", JSON.stringify(aboutMissionBlocks, null, 2));

    // Test 3: Get all content blocks for about_story
    console.log("\n3. Testing about_story content blocks:");
    const aboutStoryBlocks = await trpcClient.content.getContentBlocks.query({
      pageKey: "about_story",
    });
    console.log("Response:", JSON.stringify(aboutStoryBlocks, null, 2));

    // Test 4: Get specific block
    console.log("\n4. Testing specific block (about_hero.hero_title):");
    const specificBlock = await trpcClient.content.getContentBlocks.query({
      pageKey: "about_hero",
      blockKey: "hero_title",
    });
    console.log("Response:", JSON.stringify(specificBlock, null, 2));

    // Test 5: Get all content blocks for about_newsletter
    console.log("\n5. Testing about_newsletter content blocks:");
    const aboutNewsletterBlocks = await trpcClient.content.getContentBlocks.query({
      pageKey: "about_newsletter",
    });
    console.log("Response:", JSON.stringify(aboutNewsletterBlocks, null, 2));

    // Test 6: Get all content blocks for about_sidebar
    console.log("\n6. Testing about_sidebar content blocks:");
    const aboutSidebarBlocks = await trpcClient.content.getContentBlocks.query({
      pageKey: "about_sidebar",
    });
    console.log("Response:", JSON.stringify(aboutSidebarBlocks, null, 2));

    // Test 7: Test non-existent page
    console.log("\n7. Testing non-existent page (about_nonexistent):");
    const nonExistentBlocks = await trpcClient.content.getContentBlocks.query({
      pageKey: "about_nonexistent",
    });
    console.log("Response:", JSON.stringify(nonExistentBlocks, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testTRPCAPI();
