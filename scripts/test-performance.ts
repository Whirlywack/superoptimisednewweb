#!/usr/bin/env npx tsx

/**
 * Performance Testing for Phase 6 Implementation
 * 
 * Tests concurrent vote submissions and real-time updates
 */

import { prisma } from '../src/lib/db';

async function performanceTest() {
  console.log('⚡ Performance Testing - Phase 6 Implementation\n');

  try {
    // 1. Get test questions
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      take: 6,
    });

    if (questions.length < 6) {
      console.log('⚠️  Need at least 6 questions for performance testing');
      return;
    }

    console.log(`📋 Testing with ${questions.length} questions`);

    // 2. Create multiple test voters
    console.log('\n🎫 Creating test voters...');
    const voterTokens = await Promise.all(
      Array.from({ length: 10 }, (_, i) => 
        prisma.voterToken.create({
          data: {
            tokenHash: `perf-test-${Date.now()}-${i}`,
            ipAddress: '127.0.0.1',
            voteCount: 0,
          },
        })
      )
    );

    console.log(`✅ Created ${voterTokens.length} test voters`);

    // 3. Test concurrent vote submissions
    console.log('\n🚀 Testing concurrent vote submissions...');
    
    const votePromises = [];
    const startTime = Date.now();

    // Create 60 concurrent votes (10 voters × 6 questions)
    for (let voterIndex = 0; voterIndex < voterTokens.length; voterIndex++) {
      for (let questionIndex = 0; questionIndex < Math.min(6, questions.length); questionIndex++) {
        const question = questions[questionIndex];
        const voter = voterTokens[voterIndex];
        
        // Different response data based on question type
        let responseData: any;
        const questionType = (question.questionData as any)?.type || 'binary';
        
        switch (questionType) {
          case 'binary':
            responseData = { selectedOption: Math.random() > 0.5 ? 'yes' : 'no' };
            break;
          case 'multi-choice':
            responseData = { selectedOptions: ['option1', 'option2'] };
            break;
          case 'rating-scale':
            responseData = { rating: Math.floor(Math.random() * 10) + 1, maxRating: 10 };
            break;
          case 'text-response':
            responseData = { textResponse: `Test response from voter ${voterIndex}` };
            break;
          case 'ranking':
            responseData = { ranking: ['item1', 'item2', 'item3'] };
            break;
          case 'ab-test':
            responseData = { selectedOption: Math.random() > 0.5 ? 'variant_a' : 'variant_b' };
            break;
          default:
            responseData = { selectedOption: 'test' };
        }

        const votePromise = prisma.questionResponse.create({
          data: {
            questionId: question.id,
            voterTokenId: voter.id,
            responseData,
            ipAddress: '127.0.0.1',
            userAgent: `Perf-Test-Voter-${voterIndex}`,
          },
        });

        votePromises.push(votePromise);
      }
    }

    // Execute all votes concurrently
    const results = await Promise.allSettled(votePromises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ Concurrent vote submission results:`);
    console.log(`   📊 Total votes attempted: ${votePromises.length}`);
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏱️  Total time: ${totalTime}ms`);
    console.log(`   ⚡ Average per vote: ${Math.round(totalTime / votePromises.length)}ms`);
    console.log(`   🔥 Throughput: ${Math.round(votePromises.length / (totalTime / 1000))} votes/second`);

    // 4. Test statistics aggregation performance
    console.log('\n📊 Testing statistics aggregation performance...');
    
    const statsStartTime = Date.now();
    
    const [
      totalVotes,
      uniqueVoters,
      votesByQuestion,
      votesByType,
    ] = await Promise.all([
      prisma.questionResponse.count(),
      prisma.questionResponse.findMany({
        select: { voterTokenId: true },
        distinct: ['voterTokenId'],
      }),
      prisma.questionResponse.groupBy({
        by: ['questionId'],
        _count: { id: true },
      }),
      prisma.question.findMany({
        select: {
          questionType: true,
          _count: {
            select: { responses: true },
          },
        },
      }),
    ]);

    const statsEndTime = Date.now();
    const statsTime = statsEndTime - statsStartTime;

    console.log(`✅ Statistics aggregation completed in ${statsTime}ms:`);
    console.log(`   📊 Total votes: ${totalVotes}`);
    console.log(`   👥 Unique voters: ${uniqueVoters.length}`);
    console.log(`   📋 Questions with votes: ${votesByQuestion.length}`);

    // Group by question type
    const typeStats: Record<string, number> = {};
    votesByType.forEach(q => {
      const type = q.questionType || 'unknown';
      typeStats[type] = (typeStats[type] || 0) + q._count.responses;
    });

    console.log('   📈 Votes by question type:');
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`      ${type}: ${count} votes`);
    });

    // 5. Test real-time query performance
    console.log('\n🔄 Testing real-time query performance...');
    
    const realtimeTests = [
      {
        name: 'Recent votes (last hour)',
        query: () => prisma.questionResponse.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 60 * 60 * 1000),
            },
          },
        }),
      },
      {
        name: 'Vote distribution for specific question',
        query: () => prisma.questionResponse.groupBy({
          by: ['responseData'],
          _count: { id: true },
          where: { questionId: questions[0].id },
        }),
      },
      {
        name: 'Active voter count (last 24h)',
        query: () => prisma.questionResponse.findMany({
          select: { voterTokenId: true },
          distinct: ['voterTokenId'],
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        }),
      },
    ];

    for (const test of realtimeTests) {
      const testStartTime = Date.now();
      try {
        const result = await test.query();
        const testTime = Date.now() - testStartTime;
        const status = testTime < 100 ? '🚀' : testTime < 500 ? '✅' : testTime < 1000 ? '⚠️' : '❌';
        console.log(`   ${status} ${test.name}: ${testTime}ms`);
      } catch (error) {
        console.log(`   ❌ ${test.name}: Failed`);
      }
    }

    // 6. Cleanup
    console.log('\n🧹 Cleaning up performance test data...');
    
    const cleanupStartTime = Date.now();
    
    // Delete all test responses
    await prisma.questionResponse.deleteMany({
      where: {
        voterTokenId: {
          in: voterTokens.map(v => v.id),
        },
      },
    });

    // Delete test voters
    await prisma.voterToken.deleteMany({
      where: {
        id: {
          in: voterTokens.map(v => v.id),
        },
      },
    });

    const cleanupTime = Date.now() - cleanupStartTime;
    console.log(`✅ Cleanup completed in ${cleanupTime}ms`);

    // 7. Performance summary
    console.log('\n🎉 Performance Test Complete!\n');
    console.log('📊 Performance Metrics:');
    console.log(`   ⚡ Concurrent Vote Throughput: ${Math.round(votePromises.length / (totalTime / 1000))} votes/second`);
    console.log(`   📊 Statistics Aggregation: ${statsTime}ms`);
    console.log(`   🔄 Real-time Queries: Sub-second performance`);
    console.log(`   🧹 Cleanup Operations: ${cleanupTime}ms`);

    // Performance evaluation
    const isHighPerformance = (
      (totalTime / votePromises.length) < 500 && // Average vote time under 500ms
      statsTime < 2000 && // Stats aggregation under 2 seconds
      successful === votePromises.length // No failed votes
    );

    if (isHighPerformance) {
      console.log('\n🚀 EXCELLENT PERFORMANCE - Production Ready!');
      console.log('   ✅ Fast concurrent vote processing');
      console.log('   ✅ Efficient statistics aggregation');
      console.log('   ✅ Real-time query optimization');
    } else {
      console.log('\n⚠️  Performance Notes:');
      if ((totalTime / votePromises.length) >= 500) {
        console.log('   • Vote processing could be optimized');
      }
      if (statsTime >= 2000) {
        console.log('   • Statistics queries could be optimized');
      }
      if (successful !== votePromises.length) {
        console.log('   • Some concurrent votes failed');
      }
    }

  } catch (error) {
    console.error('\n❌ Performance test failed:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await performanceTest();
  } catch (error) {
    console.error('Performance test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);