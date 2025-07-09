import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const contentTemplate = `[YOUR OPENING PARAGRAPH - Write an engaging introduction that hooks the reader and introduces the main topic]

[YOUR SECOND PARAGRAPH - Expand on the topic and provide context or background information]

## [YOUR FIRST SECTION TITLE]

[YOUR FIRST SECTION CONTENT - Write the main content for this section, explaining key concepts or ideas]

> "[YOUR QUOTE - Add an impactful quote that supports your main argument]"

### Community Impact on This Post

**Initial Votes:** [NUMBER] • **X Replies:** [NUMBER] • **Direction Changes:** [NUMBER]

[DESCRIBE HOW COMMUNITY INPUT SHAPED THIS POST - Explain what feedback you received and how it influenced the content]

## [YOUR SECOND SECTION TITLE]

[YOUR SECOND SECTION CONTENT - Continue building your argument or explanation with additional insights]

[ADDITIONAL PARAGRAPH - Add more detail or examples to support your points]

### [YOUR SUBSECTION TITLE]

[YOUR SUBSECTION CONTENT - Provide more specific information or examples]

[ANOTHER PARAGRAPH - Continue expanding on your ideas]

## [YOUR THIRD SECTION TITLE]

[YOUR THIRD SECTION CONTENT - Conclude your main argument or provide final insights]

**Key Points to Remember:**
- [BULLET POINT 1 - Highlight important takeaways]
- [BULLET POINT 2 - Add another key insight]
- [BULLET POINT 3 - Include practical advice]
- [BULLET POINT 4 - Add final thoughts or next steps]

### Don't Miss a Decision

Major technical choices happen weekly. Get the full context and help influence the direction before decisions are final.

[NEWSLETTER SIGNUP FORM WILL APPEAR HERE]

## [YOUR FINAL SECTION TITLE]

[YOUR FINAL SECTION CONTENT - Wrap up your post with concluding thoughts]

[PENULTIMATE PARAGRAPH - Reinforce your main message]

**[YOUR CALL TO ACTION]** [Encourage reader engagement or next steps]

Follow along on [X (@superoptimised)](https://x.com/superoptimised) for live decisions and vote in real-time polls. This website documents the complete journey for those who want the full context.

---

**In This Post:**
- [TABLE OF CONTENTS ITEM 1]
- [TABLE OF CONTENTS ITEM 2] 
- [TABLE OF CONTENTS ITEM 3]
- [TABLE OF CONTENTS ITEM 4]

**Post Impact:**
- Views: [NUMBER]
- X Shares: [NUMBER]
- Newsletter Signups: [NUMBER]
- Community Votes: [NUMBER]

**Coming Next:**
[NEXT POST TITLE]
[NEXT POST DESCRIPTION]
[Vote on X →](https://x.com/superoptimised)

**Interactive Poll:** [POLL QUESTION]
- [POLL OPTION 1]
- [POLL OPTION 2]
- [POLL OPTION 3]

*Help shape future posts • [Discuss on X](https://x.com/superoptimised)*`;

async function createContentTemplate() {
  console.log("🆕 Creating user-friendly content template...");

  // Delete existing template first
  await prisma.contentTemplate.deleteMany({
    where: { title: "Superoptimised Blog Post" },
  });

  // Create new template
  const template = await prisma.contentTemplate.create({
    data: {
      title: "Superoptimised Blog Post",
      description:
        "Template that matches the journey/day-1-foundation post structure with fillable content placeholders",
      category: "Blog",
      contentType: "markdown",
      defaultContent: contentTemplate,
      usage: 0,
    },
  });

  console.log(`✅ Created template: "${template.title}"`);
  console.log(`   Content Type: ${template.contentType}`);
  console.log(`   Content Length: ${template.defaultContent.length} characters`);
}

createContentTemplate()
  .catch((e) => {
    console.error("❌ Failed to create template:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
