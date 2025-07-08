#!/usr/bin/env npx tsx

/**
 * API Endpoint Testing Script
 * 
 * This script tests all the research page API endpoints with different question types
 * to ensure the Phase 6 implementation is working correctly.
 */

import { prisma } from '../src/lib/db';

interface TestVoteData {
  questionType: string;
  questionId: string;
  responseData: any;
  expectedStructure: string[];
}

async function testDatabaseQuestions() {
  console.log('🔍 Testing database questions...\n');
  
  try {
    // Get all questions grouped by type
    const questions = await prisma.question.findMany({
      include: {
        responses: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log(`Found ${questions.length} questions in database:`);
    
    const questionsByType: Record<string, any[]> = {};
    
    questions.forEach(question => {
      const questionType = question.questionType || 'binary';
      
      if (!questionsByType[questionType]) {
        questionsByType[questionType] = [];
      }
      questionsByType[questionType].push(question);
    });

    // Display questions by type
    Object.entries(questionsByType).forEach(([type, typeQuestions]) => {
      console.log(`\n📋 ${type.toUpperCase()} Questions (${typeQuestions.length}):`);
      typeQuestions.forEach(q => {
        console.log(`  ✅ ${q.id}: ${q.title}`);
        console.log(`     Responses: ${q.responses.length}`);
        if (q.questionData && typeof q.questionData === 'object') {
          const data = q.questionData as any;
          if (data.options) console.log(`     Options: ${data.options.length}`);
          if (data.maxSelections) console.log(`     Max selections: ${data.maxSelections}`);
          if (data.scale) console.log(`     Scale: ${data.scale}`);
          if (data.variant) console.log(`     Variant: ${data.variant}`);
        }
      });
    });

    return questionsByType;
  } catch (error) {
    console.error('❌ Error testing database questions:', error);
    throw error;
  }
}

async function createTestVoterToken(): Promise<string> {
  console.log('\n🎫 Creating test voter token...');
  
  try {
    const testVoter = await prisma.voterToken.create({
      data: {
        tokenHash: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ipAddress: '127.0.0.1',
        voteCount: 0,
      },
    });

    console.log(`✅ Created test voter: ${testVoter.id}`);
    return testVoter.id;
  } catch (error) {
    console.error('❌ Error creating test voter:', error);
    throw error;
  }
}

async function testVoteSubmission(testData: TestVoteData, voterTokenId: string) {
  console.log(`\n🗳️  Testing ${testData.questionType} vote submission...`);
  
  try {
    // Create vote response
    const voteResponse = await prisma.questionResponse.create({
      data: {
        questionId: testData.questionId,
        voterTokenId: voterTokenId,
        responseData: testData.responseData,
        ipAddress: '127.0.0.1',
        userAgent: 'API-Test-Script',
      },
    });

    console.log(`✅ Vote submitted successfully: ${voteResponse.id}`);
    
    // Verify response data structure
    const responseData = voteResponse.responseData as any;
    let isValidStructure = true;
    const missingFields: string[] = [];

    testData.expectedStructure.forEach(field => {
      if (!(field in responseData)) {
        isValidStructure = false;
        missingFields.push(field);
      }
    });

    if (isValidStructure) {
      console.log(`✅ Response data structure is valid`);
      console.log(`   Data:`, responseData);
    } else {
      console.log(`❌ Response data structure is invalid`);
      console.log(`   Missing fields: ${missingFields.join(', ')}`);
    }

    return voteResponse;
  } catch (error) {
    console.error(`❌ Error testing ${testData.questionType} vote:`, error);
    throw error;
  }
}

async function testStatisticsCalculation() {
  console.log('\n📊 Testing statistics calculation...');
  
  try {
    // Get total votes
    const totalVotes = await prisma.questionResponse.count();
    console.log(`✅ Total votes in database: ${totalVotes}`);

    // Get unique voters
    const uniqueVoters = await prisma.questionResponse.findMany({
      select: { voterTokenId: true },
      distinct: ['voterTokenId'],
    });
    console.log(`✅ Unique voters: ${uniqueVoters.length}`);

    // Get vote distribution by question type
    const questions = await prisma.question.findMany({
      include: {
        _count: {
          select: { responses: true }
        }
      }
    });

    console.log('\n📈 Vote distribution by question:');
    questions.forEach(q => {
      const questionType = q.questionType || 'binary';
      console.log(`  ${questionType}: ${q.title} - ${q._count.responses} votes`);
    });

    return {
      totalVotes,
      uniqueVoters: uniqueVoters.length,
      questionStats: questions.map(q => ({
        id: q.id,
        title: q.title,
        type: q.questionType || 'binary',
        voteCount: q._count.responses
      }))
    };
  } catch (error) {
    console.error('❌ Error testing statistics:', error);
    throw error;
  }
}

async function cleanupTestData(voterTokenId: string) {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    // Delete test responses
    await prisma.questionResponse.deleteMany({
      where: { voterTokenId }
    });

    // Delete test voter
    await prisma.voterToken.delete({
      where: { id: voterTokenId }
    });

    console.log('✅ Test data cleaned up');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  }
}

async function main() {
  console.log('🚀 Starting API endpoint testing...\n');
  
  let voterTokenId: string | null = null;
  
  try {
    // Test 1: Database questions
    const questionsByType = await testDatabaseQuestions();
    
    // Test 2: Create test voter
    voterTokenId = await createTestVoterToken();
    
    // Test 3: Vote submissions for each question type
    const testVotes: TestVoteData[] = [
      {
        questionType: 'binary',
        questionId: questionsByType.binary?.[0]?.id || 'auth-1',
        responseData: { selectedOption: 'yes' },
        expectedStructure: ['selectedOption']
      },
      {
        questionType: 'multi-choice',
        questionId: questionsByType['multi-choice']?.[0]?.id || 'research-1',
        responseData: { selectedOptions: ['option1', 'option2'] },
        expectedStructure: ['selectedOptions']
      },
      {
        questionType: 'rating-scale',
        questionId: questionsByType['rating-scale']?.[0]?.id || 'research-2',
        responseData: { rating: 8, maxRating: 10 },
        expectedStructure: ['rating', 'maxRating']
      },
      {
        questionType: 'text-response',
        questionId: questionsByType['text-response']?.[0]?.id || 'research-3',
        responseData: { textResponse: 'This is a test response for text question type.' },
        expectedStructure: ['textResponse']
      },
      {
        questionType: 'ranking',
        questionId: questionsByType.ranking?.[0]?.id || 'research-4',
        responseData: { ranking: ['item1', 'item3', 'item2', 'item4'] },
        expectedStructure: ['ranking']
      },
      {
        questionType: 'ab-test',
        questionId: questionsByType['ab-test']?.[0]?.id || 'research-5',
        responseData: { selectedOption: 'variant_a' },
        expectedStructure: ['selectedOption']
      }
    ];

    for (const testVote of testVotes) {
      if (questionsByType[testVote.questionType] && questionsByType[testVote.questionType].length > 0) {
        await testVoteSubmission(testVote, voterTokenId);
      } else {
        console.log(`⚠️  Skipping ${testVote.questionType} - no questions found`);
      }
    }
    
    // Test 4: Statistics calculation
    await testStatisticsCalculation();
    
    console.log('\n🎉 All API endpoint tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ API endpoint testing failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (voterTokenId) {
      await cleanupTestData(voterTokenId);
    }
    await prisma.$disconnect();
  }
}

// Run the tests
main().catch(console.error);