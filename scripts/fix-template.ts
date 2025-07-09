import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixTemplate() {
  console.log("🔧 Fixing template contentType...");

  // Update the existing template to have contentType "tsx"
  const result = await prisma.contentTemplate.updateMany({
    where: { title: "Superoptimised Blog Post" },
    data: { contentType: "tsx" },
  });

  console.log(`✅ Updated ${result.count} template(s) to use contentType "tsx"`);

  // Verify the change
  const template = await prisma.contentTemplate.findFirst({
    where: { title: "Superoptimised Blog Post" },
  });

  if (template) {
    console.log(`✅ Template "${template.title}" now has contentType: "${template.contentType}"`);
  }
}

fixTemplate()
  .catch((e) => {
    console.error("❌ Failed to fix template:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
