import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testContentBlocks() {
  console.log("🔍 Testing Content Blocks API...\n");

  try {
    // 1. Check all content blocks in the database
    console.log("1. All content blocks in database:");
    const allBlocks = await prisma.contentBlock.findMany({
      orderBy: { pageKey: "asc" },
    });

    console.log(`Found ${allBlocks.length} content blocks:`);
    allBlocks.forEach((block) => {
      console.log(
        `  - ${block.pageKey}.${block.blockKey} (${block.contentType}): ${block.content.substring(0, 100)}${block.content.length > 100 ? "..." : ""}`
      );
    });

    // 2. Test about_* page keys
    console.log("\n2. About page content blocks:");
    const aboutBlocks = await prisma.contentBlock.findMany({
      where: {
        pageKey: {
          startsWith: "about_",
        },
      },
      orderBy: { pageKey: "asc" },
    });

    console.log(`Found ${aboutBlocks.length} about_* blocks:`);
    aboutBlocks.forEach((block) => {
      console.log(`  - ${block.pageKey}.${block.blockKey}:`);
      console.log(`    Type: ${block.contentType}`);
      console.log(`    Content: ${block.content}`);
      console.log(`    Active: ${block.isActive}`);
      console.log(`    Updated: ${block.updatedAt}`);
      console.log("");
    });

    // 3. Test specific about page keys
    console.log("3. Testing specific about page keys:");
    const aboutPageKeys = [
      "about_hero",
      "about_mission",
      "about_story",
      "about_journey",
      "about_contact",
    ];

    for (const pageKey of aboutPageKeys) {
      const blocks = await prisma.contentBlock.findMany({
        where: { pageKey, isActive: true },
        orderBy: { blockKey: "asc" },
      });

      console.log(`  ${pageKey}: ${blocks.length} blocks`);
      blocks.forEach((block) => {
        console.log(
          `    - ${block.blockKey}: ${block.content.substring(0, 60)}${block.content.length > 60 ? "..." : ""}`
        );
      });
    }

    // 4. Test homepage blocks for comparison
    console.log("\n4. Homepage content blocks:");
    const homepageBlocks = await prisma.contentBlock.findMany({
      where: {
        pageKey: {
          startsWith: "homepage_",
        },
      },
      orderBy: { pageKey: "asc" },
    });

    console.log(`Found ${homepageBlocks.length} homepage_* blocks:`);
    homepageBlocks.forEach((block) => {
      console.log(`  - ${block.pageKey}.${block.blockKey}:`);
      console.log(`    Type: ${block.contentType}`);
      console.log(`    Content: ${block.content}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testContentBlocks();
