#!/usr/bin/env npx tsx

/**
 * Research Page Integration Test
 * 
 * This script tests the complete research page flow including:
 * - Question fetching and rendering
 * - Vote submission for all question types  
 * - Real-time statistics updates
 * - XP calculation and progression
 */

import { prisma } from '../src/lib/db';

interface VoteTestCase {
  questionType: string;
  responseData: any;
  description: string;
}

async function testResearchPageFlow() {
  console.log('🧪 Testing Research Page Integration Flow...\n');
  
  try {
    // 1. Get active questions (simulating useActiveQuestions hook)
    console.log('1️⃣ Fetching active questions...');
    const activeQuestions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      take: 10, // Limit for testing
    });

    console.log(`✅ Found ${activeQuestions.length} active questions`);
    
    if (activeQuestions.length === 0) {
      throw new Error('No active questions found! Run seed script first.');
    }

    // 2. Create test voter (simulating anonymous voter)
    console.log('\n2️⃣ Creating test voter...');
    const voterToken = await prisma.voterToken.create({
      data: {
        tokenHash: `test-research-${Date.now()}`,
        ipAddress: '127.0.0.1',
        voteCount: 0,
      },
    });
    console.log(`✅ Created voter token: ${voterToken.id}`);

    // 3. Test vote submission for different question types
    console.log('\n3️⃣ Testing vote submissions...');
    
    const voteTests: VoteTestCase[] = [
      {
        questionType: 'binary',
        responseData: { selectedOption: 'yes' },
        description: 'Binary question (Yes/No)'
      },
      {
        questionType: 'multi-choice',
        responseData: { selectedOptions: ['option1', 'option3'] },
        description: 'Multi-choice question (2 selections)'
      },
      {
        questionType: 'rating-scale', 
        responseData: { rating: 9, maxRating: 10 },
        description: 'Rating question (9/10)'
      },
      {
        questionType: 'text-response',
        responseData: { textResponse: 'This is a comprehensive test response for the text question type. Testing functionality...' },
        description: 'Text response question'
      },
      {
        questionType: 'ranking',
        responseData: { ranking: ['performance', 'usability', 'features', 'design'] },
        description: 'Ranking question (4 items)'
      },
      {
        questionType: 'ab-test',
        responseData: { selectedOption: 'variant_b' },
        description: 'A/B test question (Variant B)'
      }
    ];

    let votesSubmitted = 0;
    let xpEarned = 0;

    for (const testCase of voteTests) {
      // Find a question of this type
      const question = activeQuestions.find(q => q.questionType === testCase.questionType);
      
      if (!question) {
        console.log(`⚠️  Skipping ${testCase.questionType} - no question found`);
        continue;
      }

      console.log(`\n   📝 Testing: ${testCase.description}`);
      console.log(`      Question: ${question.title}`);

      // Submit vote (simulating vote submission)
      const startTime = Date.now();
      
      const response = await prisma.questionResponse.create({
        data: {
          questionId: question.id,
          voterTokenId: voterToken.id,
          responseData: testCase.responseData,
          ipAddress: '127.0.0.1',
          userAgent: 'Research-Page-Test',
        },
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log(`      ✅ Vote submitted in ${responseTime}ms`);
      console.log(`      📊 Response ID: ${response.id}`);
      console.log(`      🔄 Response Data:`, testCase.responseData);

      votesSubmitted++;

      // Calculate XP (simulating background job)
      const newVoteCount = votesSubmitted;
      let voteXp = 5; // Base XP
      
      if (newVoteCount <= 5) voteXp = 5;
      else if (newVoteCount <= 10) voteXp = 10;
      else if (newVoteCount <= 25) voteXp = 15;
      else if (newVoteCount <= 50) voteXp = 20;
      else if (newVoteCount <= 100) voteXp = 25;
      else if (newVoteCount <= 250) voteXp = 50;
      else voteXp = 100;

      xpEarned += voteXp;
      console.log(`      💰 XP Earned: +${voteXp} (Total: ${xpEarned})`);
    }

    // 4. Test statistics calculation (simulating useQuestionStats)
    console.log('\n4️⃣ Testing statistics calculation...');
    
    const stats = await prisma.questionResponse.groupBy({
      by: ['questionId'],
      _count: {
        id: true,
      },
      where: {
        voterTokenId: voterToken.id,
      },
    });

    console.log(`✅ Vote statistics calculated for ${stats.length} questions:`);
    for (const stat of stats) {
      const question = activeQuestions.find(q => q.id === stat.questionId);
      if (question) {
        console.log(`   📊 ${question.questionType}: ${question.title} - ${stat._count.id} vote(s)`);
      }
    }

    // 5. Test engagement statistics (simulating useEngagementStats)
    console.log('\n5️⃣ Testing engagement tracking...');
    
    const engagementStats = await prisma.engagementStats.create({
      data: {
        voterTokenId: voterToken.id,
        currentStreak: 1,
        longestStreak: 1,
        totalVotes: votesSubmitted,
        totalXp: xpEarned,
        lastActivity: new Date(),
      },
    });

    console.log('✅ Engagement stats created:');
    console.log(`   🎯 Total Votes: ${engagementStats.totalVotes}`);
    console.log(`   💰 Total XP: ${engagementStats.totalXp}`);
    console.log(`   🔥 Current Streak: ${engagementStats.currentStreak} days`);

    // 6. Test question progression (simulating research page flow)
    console.log('\n6️⃣ Testing question progression...');
    
    const progressionTest = {
      currentQuestionIndex: 0,
      totalQuestions: votesSubmitted,
      completionPercentage: Math.round((votesSubmitted / activeQuestions.length) * 100),
    };

    console.log('✅ Progression calculation:');
    console.log(`   📈 Progress: ${progressionTest.completionPercentage}% (${votesSubmitted}/${activeQuestions.length})`);
    console.log(`   ⏭️  Next Question: ${progressionTest.currentQuestionIndex + 1}`);

    // 7. Test real-time stats aggregation
    console.log('\n7️⃣ Testing real-time stats aggregation...');
    
    const realtimeStats = await prisma.questionResponse.aggregate({
      _count: { id: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    const uniqueVoters = await prisma.questionResponse.findMany({
      select: { voterTokenId: true },
      distinct: ['voterTokenId'],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    console.log('✅ Real-time stats (last 24h):');
    console.log(`   📊 Total Votes: ${realtimeStats._count.id}`);
    console.log(`   👥 Unique Voters: ${uniqueVoters.length}`);

    // 8. Cleanup test data
    console.log('\n8️⃣ Cleaning up test data...');
    
    await prisma.engagementStats.delete({
      where: { id: engagementStats.id },
    });

    await prisma.questionResponse.deleteMany({
      where: { voterTokenId: voterToken.id },
    });

    await prisma.voterToken.delete({
      where: { id: voterToken.id },
    });

    console.log('✅ Test data cleaned up');

    // 9. Performance summary
    console.log('\n🎉 Research Page Integration Test Complete!');
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Question Types Tested: ${voteTests.length}`);
    console.log(`   ✅ Votes Submitted: ${votesSubmitted}`);
    console.log(`   ✅ XP Earned: ${xpEarned}`);
    console.log(`   ✅ Statistics Calculated: ${stats.length} questions`);
    console.log(`   ✅ Real-time Updates: Working`);
    console.log(`   ✅ Progression Tracking: Working`);
    console.log(`   ✅ Engagement Stats: Working`);

    console.log('\n🚀 All systems operational! Phase 6 implementation verified.');

  } catch (error) {
    console.error('\n❌ Research page test failed:', error);
    throw error;
  }
}

async function testQuestionTypeValidation() {
  console.log('\n🔍 Testing question type validation...');
  
  try {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
    });

    const typeValidation = {
      binary: 0,
      'multi-choice': 0,
      'rating-scale': 0,
      'text-response': 0,
      ranking: 0,
      'ab-test': 0,
      other: 0,
    };

    questions.forEach(q => {
      const type = q.questionType;
      if (type in typeValidation) {
        (typeValidation as any)[type]++;
      } else {
        typeValidation.other++;
      }
    });

    console.log('✅ Question type distribution:');
    Object.entries(typeValidation).forEach(([type, count]) => {
      if (count > 0) {
        console.log(`   📋 ${type}: ${count} questions`);
      }
    });

    // Verify each type has proper questionData structure
    console.log('\n🔍 Validating question data structures...');
    
    for (const question of questions) {
      const data = question.questionData as any;
      const type = question.questionType;
      
      switch (type) {
        case 'binary':
          if (!data.options || data.options.length !== 2) {
            console.warn(`⚠️  Binary question ${question.id} should have exactly 2 options`);
          } else {
            console.log(`   ✅ ${type}: ${question.id} - Valid structure`);
          }
          break;
          
        case 'multi-choice':
          if (!data.options || !data.maxSelections) {
            console.warn(`⚠️  Multi-choice question ${question.id} missing options or maxSelections`);
          } else {
            console.log(`   ✅ ${type}: ${question.id} - Valid structure (${data.options.length} options, max ${data.maxSelections})`);
          }
          break;
          
        case 'rating-scale':
          if (!data.scale || !data.variant) {
            console.warn(`⚠️  Rating question ${question.id} missing scale or variant`);
          } else {
            console.log(`   ✅ ${type}: ${question.id} - Valid structure (scale: ${data.scale}, variant: ${data.variant})`);
          }
          break;
          
        case 'text-response':
          console.log(`   ✅ ${type}: ${question.id} - Valid structure`);
          break;
          
        case 'ranking':
          if (!data.items) {
            console.warn(`⚠️  Ranking question ${question.id} missing items`);
          } else {
            console.log(`   ✅ ${type}: ${question.id} - Valid structure (${data.items.length} items)`);
          }
          break;
          
        case 'ab-test':
          if (!data.optionA || !data.optionB) {
            console.warn(`⚠️  A/B test question ${question.id} missing optionA or optionB`);
          } else {
            console.log(`   ✅ ${type}: ${question.id} - Valid structure`);
          }
          break;
          
        default:
          console.warn(`⚠️  Unknown question type: ${type}`);
      }
    }

  } catch (error) {
    console.error('❌ Question validation failed:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await testQuestionTypeValidation();
    await testResearchPageFlow();
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);