import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkTemplate() {
  console.log("🔍 Checking template status...");

  // Get all templates
  const templates = await prisma.contentTemplate.findMany();

  console.log(`📋 Found ${templates.length} template(s):`);

  for (const template of templates) {
    console.log(`\n📄 Template: "${template.title}"`);
    console.log(`   ID: ${template.id}`);
    console.log(`   Content Type: ${template.contentType}`);
    console.log(`   Category: ${template.category}`);
    console.log(`   Description: ${template.description}`);
    console.log(`   Content Length: ${template.defaultContent.length} characters`);
    console.log(
      `   Contains TypeScript: ${template.defaultContent.includes("import React") ? "Yes" : "No"}`
    );
    console.log(`   Usage Count: ${template.usageCount}`);
    console.log(`   Created: ${template.createdAt}`);
    console.log(`   Updated: ${template.updatedAt}`);

    // Show first 200 characters of content
    console.log(`   Content Preview: "${template.defaultContent.substring(0, 200)}..."`);
  }
}

checkTemplate()
  .catch((e) => {
    console.error("❌ Failed to check template:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
