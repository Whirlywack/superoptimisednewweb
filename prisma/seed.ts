import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Question bank data from the existing file
const QUESTION_BANK = [
  // Authentication-specific questions
  {
    id: 'auth-1',
    category: 'auth',
    text: 'What\'s your preference for authentication?',
    options: ['Magic links only', 'Traditional login forms']
  },
  {
    id: 'auth-2',
    category: 'auth',
    text: 'Anonymous feedback vs. tracked contributions?',
    options: ['Full anonymity', 'Optional profiles']
  },
  {
    id: 'auth-3',
    category: 'auth',
    text: 'How long should magic links stay valid?',
    options: ['15 minutes', '1 hour']
  },

  // Platform/mobile questions
  {
    id: 'platform-1',
    category: 'platform',
    text: 'Primary device for filling surveys?',
    options: ['Mobile phone', 'Desktop computer']
  },
  {
    id: 'platform-2',
    category: 'platform',
    text: 'Preferred interaction method?',
    options: ['Touch/tap', 'Click/keyboard']
  },
  {
    id: 'platform-3',
    category: 'platform',
    text: 'Survey length preference?',
    options: ['Quick 2-3 questions', 'Detailed 10+ questions']
  },

  // Universal questions
  {
    id: 'general-1',
    category: 'general',
    text: 'What motivates you to give feedback?',
    options: ['Improving the product', 'Helping the community']
  },
  {
    id: 'general-2',
    category: 'general',
    text: 'Ideal feedback frequency?',
    options: ['Weekly check-ins', 'Only major milestones']
  },
  {
    id: 'general-3',
    category: 'general',
    text: 'Transparency level preference?',
    options: ['See all decisions', 'Just final results']
  },
  {
    id: 'general-4',
    category: 'general',
    text: 'Community involvement style?',
    options: ['Active participant', 'Passive observer']
  },
  {
    id: 'general-5',
    category: 'general',
    text: 'Feature priority preference?',
    options: ['User experience', 'Technical robustness']
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.questionResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.xpLedger.deleteMany();
  await prisma.engagementStats.deleteMany();
  await prisma.contentBlock.deleteMany();
  await prisma.projectStat.deleteMany();
  await prisma.liveStat.deleteMany();

  // Seed questions from questionBank
  console.log('📋 Seeding questions...');
  for (const questionData of QUESTION_BANK) {
    await prisma.question.create({
      data: {
        id: questionData.id,
        title: questionData.text,
        description: `Binary choice question from ${questionData.category} category`,
        questionType: 'binary',
        questionData: {
          options: questionData.options
        },
        category: questionData.category,
        isActive: true,
        displayOrder: 0
      }
    });
    console.log(`  ✅ Created question: ${questionData.id}`);
  }

  // Seed initial content blocks
  console.log('📄 Seeding content blocks...');
  const contentBlocks = [
    {
      pageKey: 'homepage_hero',
      blockKey: 'project_title',
      contentType: 'text',
      content: 'Magic Link Questionnaire System'
    },
    {
      pageKey: 'homepage_hero',
      blockKey: 'project_description',
      contentType: 'text',
      content: 'Building a community-driven questionnaire system with radical transparency. Every decision documented, community input shapes the direction.'
    },
    {
      pageKey: 'homepage_community',
      blockKey: 'stats',
      contentType: 'json',
      content: JSON.stringify({
        days_building: 1,
        total_votes: 0,
        decisions_influenced: 0,
        active_polls: 11
      })
    },
    {
      pageKey: 'about_mission',
      blockKey: 'title',
      contentType: 'text',
      content: 'Your Input Shapes What Gets Built'
    },
    {
      pageKey: 'about_mission',
      blockKey: 'description',
      contentType: 'markdown',
      content: 'Every feature decision, every design choice, every technical direction - all influenced by community feedback through bite-sized questions and transparent building in public.'
    }
  ];

  for (const block of contentBlocks) {
    await prisma.contentBlock.create({ data: block });
    console.log(`  ✅ Created content block: ${block.pageKey}.${block.blockKey}`);
  }

  // Seed initial project stats
  console.log('📊 Seeding project stats...');
  const projectStats = [
    {
      statKey: 'progress_percentage',
      statValue: '15',
      description: 'Overall project completion percentage'
    },
    {
      statKey: 'days_building',
      statValue: '1',
      description: 'Number of days actively building'
    },
    {
      statKey: 'milestone_current',
      statValue: 'Database Integration',
      description: 'Current development milestone'
    },
    {
      statKey: 'next_milestone',
      statValue: 'Real-time Voting System',
      description: 'Next planned milestone'
    }
  ];

  for (const stat of projectStats) {
    await prisma.projectStat.create({ data: stat });
    console.log(`  ✅ Created project stat: ${stat.statKey}`);
  }

  // Seed initial live stats
  console.log('📈 Seeding live stats...');
  const liveStats = [
    { statKey: 'total_votes', statValue: 0 },
    { statKey: 'active_questions', statValue: 11 },
    { statKey: 'unique_voters_today', statValue: 0 },
    { statKey: 'total_xp_awarded', statValue: 0 },
    { statKey: 'newsletter_subscribers', statValue: 0 }
  ];

  for (const stat of liveStats) {
    await prisma.liveStat.create({ data: stat });
    console.log(`  ✅ Created live stat: ${stat.statKey}`);
  }

  // Create a sample blog post
  console.log('📝 Seeding sample content...');
  await prisma.post.create({
    data: {
      slug: 'day-1-foundation',
      title: 'Day 1: Foundation - Building in Public',
      excerpt: 'Starting the journey of building a Magic Link Questionnaire System with complete transparency.',
      content: `# Day 1: Foundation - Building in Public

Today marks the beginning of an exciting experiment in radical transparency and community-driven development.

## What We're Building

A Magic Link Questionnaire System that puts community input at the center of every decision. No traditional logins, no passwords - just smooth, accessible feedback collection.

## Why This Matters

Too many products are built in isolation. We're flipping that script by making every technical decision, every design choice, and every feature prioritization a community conversation.

## What's Next

- Set up the database foundation ✅
- Implement real-time voting system
- Create admin dashboard for question management
- Launch first community questionnaire

Your input shapes what gets built. Every vote matters.`,
      postType: 'journey',
      status: 'published',
      featured: true,
      publishedAt: new Date()
    }
  });
  console.log('  ✅ Created sample blog post');

  console.log('\n🎉 Database seeded successfully!');
  console.log(`📊 Summary:`);
  console.log(`  - ${QUESTION_BANK.length} questions created`);
  console.log(`  - ${contentBlocks.length} content blocks created`);
  console.log(`  - ${projectStats.length} project stats created`);
  console.log(`  - ${liveStats.length} live stats created`);
  console.log(`  - 1 sample blog post created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });