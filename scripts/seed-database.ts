import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      isAdmin: true,
    },
  });

  // Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        email: 'user1@example.com',
        name: 'John Doe',
        role: 'user',
      },
    }),
    prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        email: 'user2@example.com',
        name: 'Jane Smith',
        role: 'user',
      },
    }),
  ]);

  // Create questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        title: "What's your primary programming experience level?",
        description: "Help us understand your background",
        questionType: "multiple_choice",
        questionData: {
          options: ["Beginner (0-1 years)", "Intermediate (2-4 years)", "Advanced (5+ years)", "Expert (10+ years)"]
        },
        category: "experience",
        isActive: true,
        displayOrder: 1,
      },
    }),
    prisma.question.create({
      data: {
        title: "Rate our service quality",
        description: "How would you rate your overall experience?",
        questionType: "rating",
        questionData: {
          scale: 5,
          labels: ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        category: "feedback",
        isActive: true,
        displayOrder: 2,
      },
    }),
    prisma.question.create({
      data: {
        title: "Would you recommend us to others?",
        description: "Net Promoter Score question",
        questionType: "yes_no",
        questionData: {},
        category: "nps",
        isActive: true,
        displayOrder: 3,
      },
    }),
    prisma.question.create({
      data: {
        title: "Additional feedback",
        description: "Please share any additional thoughts or suggestions",
        questionType: "text",
        questionData: {
          maxLength: 500,
          multiline: true
        },
        category: "feedback",
        isActive: true,
        displayOrder: 4,
      },
    }),
  ]);

  // Create questionnaires
  const questionnaire1 = await prisma.questionnaire.create({
    data: {
      title: "Product Experience Survey",
      description: "Help us improve our product based on your experience",
      category: "product",
      status: "active",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  const questionnaire2 = await prisma.questionnaire.create({
    data: {
      title: "User Satisfaction Research",
      description: "Understanding user satisfaction and areas for improvement",
      category: "research",
      status: "active",
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    },
  });

  // Link questions to questionnaires
  await Promise.all([
    prisma.questionnaireQuestion.create({
      data: {
        questionnaireId: questionnaire1.id,
        questionId: questions[0].id,
        displayOrder: 0,
        isRequired: true,
      },
    }),
    prisma.questionnaireQuestion.create({
      data: {
        questionnaireId: questionnaire1.id,
        questionId: questions[1].id,
        displayOrder: 1,
        isRequired: true,
      },
    }),
    prisma.questionnaireQuestion.create({
      data: {
        questionnaireId: questionnaire2.id,
        questionId: questions[2].id,
        displayOrder: 0,
        isRequired: true,
      },
    }),
    prisma.questionnaireQuestion.create({
      data: {
        questionnaireId: questionnaire2.id,
        questionId: questions[3].id,
        displayOrder: 1,
        isRequired: false,
      },
    }),
  ]);

  // Create voter tokens for anonymous responses
  const voterTokens = await Promise.all([
    prisma.voterToken.create({
      data: {
        tokenHash: 'voter1_hash',
        ipAddress: '192.168.1.1',
        voteCount: 3,
      },
    }),
    prisma.voterToken.create({
      data: {
        tokenHash: 'voter2_hash',
        ipAddress: '192.168.1.2',
        voteCount: 2,
      },
    }),
  ]);

  // Create questionnaire responses
  const responses = [];
  for (let i = 0; i < 156; i++) {
    const user = i % 3 === 0 ? users[i % 2] : null;
    const voterToken = i % 3 !== 0 ? voterTokens[i % 2] : null;
    const questionnaire = i % 2 === 0 ? questionnaire1 : questionnaire2;
    
    const response = await prisma.questionnaireResponse.create({
      data: {
        questionnaireId: questionnaire.id,
        userId: user?.id,
        voterTokenId: voterToken?.id,
        status: "completed",
        startedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      },
    });
    responses.push(response);
  }

  // Create individual question responses
  for (const response of responses.slice(0, 100)) {
    const questionIds = response.questionnaireId === questionnaire1.id 
      ? [questions[0].id, questions[1].id]
      : [questions[2].id, questions[3].id];

    for (const questionId of questionIds) {
      const question = questions.find(q => q.id === questionId);
      let responseData;

      switch (question?.questionType) {
        case 'multiple_choice':
          responseData = { selected: Math.floor(Math.random() * 4) };
          break;
        case 'rating':
          responseData = { rating: Math.floor(Math.random() * 5) + 1 };
          break;
        case 'yes_no':
          responseData = { answer: Math.random() > 0.3 };
          break;
        case 'text':
          responseData = { text: "Great service, keep up the good work!" };
          break;
        default:
          responseData = {};
      }

      await prisma.questionResponse.create({
        data: {
          questionId,
          userId: response.userId,
          voterTokenId: response.voterTokenId,
          questionnaireResponseId: response.id,
          responseData,
          ipAddress: response.ipAddress,
          createdAt: response.completedAt || response.startedAt,
        },
      });
    }
  }

  // Create blog posts
  await Promise.all([
    prisma.post.create({
      data: {
        title: "Building Better User Surveys",
        slug: "building-better-user-surveys",
        excerpt: "Learn how to create effective surveys that get real insights from your users.",
        content: "# Building Better User Surveys\n\nSurveys are a crucial tool for understanding your users...",
        postType: "blog",
        status: "published",
        featured: true,
        authorId: adminUser.id,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.post.create({
      data: {
        title: "Analytics Deep Dive",
        slug: "analytics-deep-dive",
        excerpt: "Exploring advanced analytics techniques for questionnaire data.",
        content: "# Analytics Deep Dive\n\nUnderstanding your data is key to making informed decisions...",
        postType: "blog",
        status: "published",
        featured: false,
        authorId: adminUser.id,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.post.create({
      data: {
        title: "Future of User Research",
        slug: "future-of-user-research",
        excerpt: "What's next in the world of user research and feedback collection.",
        content: "# Future of User Research\n\nUser research is evolving rapidly...",
        postType: "blog",
        status: "draft",
        featured: false,
        authorId: adminUser.id,
      },
    }),
  ]);

  // Create engagement stats
  await Promise.all([
    prisma.engagementStats.create({
      data: {
        userId: users[0].id,
        currentStreak: 5,
        longestStreak: 10,
        totalVotes: 25,
        totalXp: 250,
        lastActivity: new Date(),
      },
    }),
    prisma.engagementStats.create({
      data: {
        voterTokenId: voterTokens[0].id,
        currentStreak: 3,
        longestStreak: 7,
        totalVotes: 15,
        totalXp: 150,
        lastActivity: new Date(),
      },
    }),
  ]);

  // Create analytics daily data
  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    await prisma.analyticsDaily.create({
      data: {
        date,
        totalVotes: Math.floor(Math.random() * 50) + 10,
        uniqueVoters: Math.floor(Math.random() * 30) + 5,
        totalXpEarned: Math.floor(Math.random() * 200) + 50,
        newsletterSignups: Math.floor(Math.random() * 5),
        popularQuestions: JSON.stringify([
          { questionId: questions[0].id, votes: Math.floor(Math.random() * 20) + 5 },
          { questionId: questions[1].id, votes: Math.floor(Math.random() * 15) + 3 },
        ]),
      },
    });
  }

  // Create project stats
  await Promise.all([
    prisma.projectStat.create({
      data: {
        statKey: 'total_users',
        statValue: '1247',
        description: 'Total registered users',
      },
    }),
    prisma.projectStat.create({
      data: {
        statKey: 'total_questionnaires',
        statValue: '42',
        description: 'Total questionnaires created',
      },
    }),
    prisma.projectStat.create({
      data: {
        statKey: 'total_responses',
        statValue: '389',
        description: 'Total questionnaire responses',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`Created:`);
  console.log(`- ${users.length + 1} users (including admin)`);
  console.log(`- ${questions.length} questions`);
  console.log(`- 2 questionnaires`);
  console.log(`- ${responses.length} questionnaire responses`);
  console.log(`- 3 blog posts`);
  console.log(`- 30 days of analytics data`);
  console.log(`- Engagement stats and project stats`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });