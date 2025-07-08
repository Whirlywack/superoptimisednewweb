#!/usr/bin/env npx tsx
/**
 * Comprehensive tRPC HTTP Endpoint Test Suite
 *
 * This script tests ALL tRPC endpoints via HTTP (not server-side calling)
 * to identify exactly where the failure is occurring in the tRPC middleware chain.
 *
 * Key differences from existing test:
 * - Uses HTTP client instead of server-side createCaller
 * - Tests actual middleware execution and context creation
 * - Identifies voter token context issues
 * - Tests cookie handling and IP address extraction
 * - Focuses on the exact failure points you're experiencing
 */

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import { randomUUID } from "crypto";
import fetch from "node-fetch";
import type { AppRouter } from "@/lib/api/root";

// Global fetch for Node.js
if (!global.fetch) {
  global.fetch = fetch as any;
}

// Test configuration
const BASE_URL = "http://localhost:3004";
const TRPC_URL = `${BASE_URL}/api/trpc`;

// Test utilities
interface TestResult {
  endpoint: string;
  success: boolean;
  error?: string;
  data?: any;
  timing: number;
  context?: string;
}

interface TestContext {
  name: string;
  headers: Record<string, string>;
  description: string;
}

class TRPCHTTPTester {
  private results: TestResult[] = [];
  private questionId: string | null = null;
  private voterToken: string | null = null;

  private createClient(context: TestContext) {
    return createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: TRPC_URL,
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "test-http-client");
            headers.set("user-agent", "tRPC-HTTP-Test-Client");

            // Add context-specific headers
            Object.entries(context.headers).forEach(([key, value]) => {
              headers.set(key, value);
            });

            return headers;
          },
          transformer: SuperJSON,
        }),
      ],
    });
  }

  private async runTest(
    endpoint: string,
    testFn: () => Promise<any>,
    context: TestContext,
    description: string = ""
  ): Promise<TestResult> {
    const fullDescription = `${endpoint}${description ? ` - ${description}` : ""} [${context.name}]`;
    console.log(`\n🧪 Testing ${fullDescription}`);

    const startTime = Date.now();

    try {
      const data = await testFn();
      const timing = Date.now() - startTime;

      console.log(`✅ SUCCESS (${timing}ms)`);
      console.log(`📊 Response type: ${typeof data}`);

      if (data && typeof data === "object") {
        console.log(`📊 Response keys: ${Object.keys(data).join(", ")}`);

        // Check for empty objects (main issue you're experiencing)
        if (Object.keys(data).length === 0) {
          console.log(`⚠️  WARNING: Empty object response - possible context issue`);
        }
      }

      const result: TestResult = {
        endpoint,
        success: true,
        data,
        timing,
        context: context.name,
      };

      this.results.push(result);
      return result;
    } catch (error) {
      const timing = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      console.log(`❌ FAILED (${timing}ms)`);
      console.log(`❌ Error: ${errorMessage}`);

      // Detailed error analysis
      if (error && typeof error === "object") {
        if ("data" in error) {
          console.log(`❌ Error data:`, (error as any).data);
        }
        if ("shape" in error) {
          console.log(`❌ Error shape:`, (error as any).shape);
        }
        if ("cause" in error) {
          console.log(`❌ Error cause:`, (error as any).cause);
        }
      }

      const result: TestResult = {
        endpoint,
        success: false,
        error: errorMessage,
        timing,
        context: context.name,
      };

      this.results.push(result);
      return result;
    }
  }

  private getTestContexts(): TestContext[] {
    return [
      {
        name: "Basic",
        headers: {},
        description: "No special headers - minimal context",
      },
      {
        name: "With IP",
        headers: {
          "x-forwarded-for": "192.168.1.100",
          "x-real-ip": "192.168.1.100",
        },
        description: "With IP address headers",
      },
      {
        name: "With Voter Token",
        headers: {
          cookie: `voter_token=${randomUUID()}`,
        },
        description: "With voter token cookie",
      },
      {
        name: "Full Context",
        headers: {
          "x-forwarded-for": "192.168.1.100",
          "x-real-ip": "192.168.1.100",
          cookie: `voter_token=${randomUUID()}`,
          referer: `${BASE_URL}/research`,
        },
        description: "Full context with all headers",
      },
    ];
  }

  async testQuestionEndpoints() {
    console.log("\n🔍 TESTING QUESTION ENDPOINTS");
    console.log("=".repeat(70));

    const contexts = this.getTestContexts();

    for (const context of contexts) {
      console.log(`\n📍 Testing with context: ${context.name} (${context.description})`);
      const client = this.createClient(context);

      // Test getActiveQuestions
      const result = await this.runTest(
        "question.getActiveQuestions",
        () => client.question.getActiveQuestions.query({ limit: 5 }),
        context,
        "fetch active questions"
      );

      // Store a question ID for later tests
      if (result.success && result.data?.length > 0 && !this.questionId) {
        this.questionId = result.data[0].id;
        console.log(`📝 Stored question ID for later tests: ${this.questionId}`);
      }

      // Test getQuestionById if we have a question ID
      if (this.questionId) {
        await this.runTest(
          "question.getQuestionById",
          () => client.question.getQuestionById.query({ id: this.questionId! }),
          context,
          `get question by ID`
        );
      }
    }
  }

  async testVoteEndpoints() {
    console.log("\n🗳️  TESTING VOTE ENDPOINTS (CRITICAL SECTION)");
    console.log("=".repeat(70));

    if (!this.questionId) {
      console.log("⚠️  Skipping vote tests - no question ID available");
      return;
    }

    const contexts = this.getTestContexts();

    for (const context of contexts) {
      console.log(`\n📍 Testing with context: ${context.name} (${context.description})`);
      const client = this.createClient(context);

      // Test 1: getVoteStats - This is failing with empty objects
      await this.runTest(
        "vote.getVoteStats",
        () => client.vote.getVoteStats.query({ questionId: this.questionId! }),
        context,
        "get vote statistics"
      );

      // Test 2: getEngagementStats - Also showing issues
      await this.runTest(
        "vote.getEngagementStats",
        () => client.vote.getEngagementStats.query({ includeMilestones: true }),
        context,
        "get engagement stats"
      );

      // Test 3: getUserVoteHistory - Uses voter token context
      await this.runTest(
        "vote.getUserVoteHistory",
        () => client.vote.getUserVoteHistory.query(),
        context,
        "get user vote history"
      );

      // Test 4: getFinalXpCalculation - Uses voter token context
      await this.runTest(
        "vote.getFinalXpCalculation",
        () => client.vote.getFinalXpCalculation.query(),
        context,
        "get final XP calculation"
      );

      // Test 5: submitVote - The main failing endpoint
      console.log(`\n🔥 CRITICAL TEST: submitVote with context ${context.name}`);
      const submitResult = await this.runTest(
        "vote.submitVote",
        () =>
          client.vote.submitVote.mutate({
            questionId: this.questionId!,
            response: "yes",
          }),
        context,
        "submit vote (CRITICAL)"
      );

      // If submitVote succeeded, store the voter token
      if (submitResult.success && submitResult.data?.voterToken) {
        this.voterToken = submitResult.data.voterToken;
        console.log(`🔑 Stored voter token: ${this.voterToken}`);

        // Test duplicate vote (should fail)
        await this.runTest(
          "vote.submitVote",
          () =>
            client.vote.submitVote.mutate({
              questionId: this.questionId!,
              response: "no",
            }),
          context,
          "duplicate vote (should fail)"
        );
      }
    }
  }

  async testContentEndpoints() {
    console.log("\n📄 TESTING CONTENT ENDPOINTS");
    console.log("=".repeat(70));

    const contexts = this.getTestContexts();

    for (const context of contexts) {
      console.log(`\n📍 Testing with context: ${context.name} (${context.description})`);
      const client = this.createClient(context);

      // Test getCommunityStats
      await this.runTest(
        "content.getCommunityStats",
        () => client.content.getCommunityStats.query({ includeDaily: true }),
        context,
        "get community stats"
      );

      // Test getProjectStats
      await this.runTest(
        "content.getProjectStats",
        () => client.content.getProjectStats.query({}),
        context,
        "get project stats"
      );

      // Test getContentBlocks
      await this.runTest(
        "content.getContentBlocks",
        () => client.content.getContentBlocks.query({ pageKey: "research" }),
        context,
        "get content blocks"
      );
    }
  }

  async testMiddlewareSpecific() {
    console.log("\n⚙️  TESTING MIDDLEWARE-SPECIFIC SCENARIOS");
    console.log("=".repeat(70));

    // Test scenarios specifically designed to identify middleware issues
    const testScenarios = [
      {
        name: "No Headers",
        headers: {},
        expectedIssues: ["IP address extraction", "Voter token context"],
      },
      {
        name: "Invalid Voter Token",
        headers: {
          cookie: "voter_token=invalid-token-format",
        },
        expectedIssues: ["Token validation"],
      },
      {
        name: "Missing IP Headers",
        headers: {
          cookie: `voter_token=${randomUUID()}`,
        },
        expectedIssues: ["IP address fallback"],
      },
      {
        name: "Multiple IP Headers",
        headers: {
          "x-forwarded-for": "192.168.1.1, 10.0.0.1, 172.16.0.1",
          "x-real-ip": "192.168.1.100",
        },
        expectedIssues: ["IP address precedence"],
      },
    ];

    for (const scenario of testScenarios) {
      console.log(`\n🧪 Testing scenario: ${scenario.name}`);
      console.log(`   Expected issues: ${scenario.expectedIssues.join(", ")}`);

      const context: TestContext = {
        name: scenario.name,
        headers: scenario.headers,
        description: `Middleware test: ${scenario.name}`,
      };

      const client = this.createClient(context);

      // Test a vote endpoint that depends on middleware
      await this.runTest(
        "vote.getEngagementStats",
        () => client.vote.getEngagementStats.query({}),
        context,
        "middleware dependency test"
      );

      // Test vote submission if we have a question
      if (this.questionId) {
        await this.runTest(
          "vote.submitVote",
          () =>
            client.vote.submitVote.mutate({
              questionId: this.questionId!,
              response: `test-${Date.now()}`,
            }),
          context,
          "middleware context test"
        );
      }
    }
  }

  async testErrorHandling() {
    console.log("\n🚨 TESTING ERROR HANDLING");
    console.log("=".repeat(70));

    const context = this.getTestContexts()[0]; // Use basic context
    const client = this.createClient(context);

    // Test invalid inputs
    await this.runTest(
      "vote.submitVote",
      () =>
        client.vote.submitVote.mutate({
          questionId: "invalid-cuid",
          response: "test",
        }),
      context,
      "invalid question ID"
    );

    await this.runTest(
      "vote.getVoteStats",
      () => client.vote.getVoteStats.query({ questionId: "invalid-cuid" }),
      context,
      "invalid question ID in stats"
    );

    await this.runTest(
      "question.getQuestionById",
      () => client.question.getQuestionById.query({ id: "invalid-cuid" }),
      context,
      "invalid question ID"
    );
  }

  generateReport() {
    console.log("\n📊 COMPREHENSIVE TEST REPORT");
    console.log("=".repeat(70));

    const successCount = this.results.filter((r) => r.success).length;
    const failCount = this.results.filter((r) => !r.success).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.timing, 0);

    console.log(`📈 Total Tests: ${this.results.length}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);
    console.log(`⚡ Average Time: ${Math.round(totalTime / this.results.length)}ms`);

    // Group by endpoint for analysis
    const endpointGroups = this.results.reduce(
      (groups, result) => {
        const endpoint = result.endpoint;
        if (!groups[endpoint]) {
          groups[endpoint] = [];
        }
        groups[endpoint].push(result);
        return groups;
      },
      {} as Record<string, TestResult[]>
    );

    console.log("\n📋 ENDPOINT ANALYSIS:");
    Object.entries(endpointGroups).forEach(([endpoint, results]) => {
      const success = results.filter((r) => r.success).length;
      const total = results.length;
      const avgTime = Math.round(results.reduce((sum, r) => sum + r.timing, 0) / total);

      console.log(`\n  ${endpoint}:`);
      console.log(
        `    Success Rate: ${success}/${total} (${Math.round((success / total) * 100)}%)`
      );
      console.log(`    Average Time: ${avgTime}ms`);

      // Show failures by context
      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        console.log(`    Failures:`);
        failures.forEach((f) => {
          console.log(`      - ${f.context}: ${f.error}`);
        });
      }

      // Check for empty object responses
      const emptyResponses = results.filter(
        (r) => r.success && r.data && typeof r.data === "object" && Object.keys(r.data).length === 0
      );
      if (emptyResponses.length > 0) {
        console.log(`    ⚠️  Empty Object Responses: ${emptyResponses.length}`);
        emptyResponses.forEach((e) => console.log(`      - ${e.context}`));
      }
    });

    // Context-specific analysis
    console.log("\n📍 CONTEXT ANALYSIS:");
    const contextGroups = this.results.reduce(
      (groups, result) => {
        const context = result.context || "unknown";
        if (!groups[context]) {
          groups[context] = [];
        }
        groups[context].push(result);
        return groups;
      },
      {} as Record<string, TestResult[]>
    );

    Object.entries(contextGroups).forEach(([context, results]) => {
      const success = results.filter((r) => r.success).length;
      const total = results.length;
      console.log(`  ${context}: ${success}/${total} success rate`);
    });

    // Critical failure analysis
    console.log("\n🔥 CRITICAL FAILURES:");
    const criticalEndpoints = ["vote.submitVote", "vote.getVoteStats", "vote.getUserVoteHistory"];
    const criticalFailures = this.results.filter(
      (r) => !r.success && criticalEndpoints.some((ep) => r.endpoint.includes(ep))
    );

    if (criticalFailures.length > 0) {
      criticalFailures.forEach((failure) => {
        console.log(`  ❌ ${failure.endpoint} [${failure.context}]: ${failure.error}`);
      });
    } else {
      console.log("  ✅ No critical failures detected");
    }

    // Pattern identification
    console.log("\n🔍 PATTERN IDENTIFICATION:");

    // Check if all vote endpoints fail
    const voteResults = this.results.filter((r) => r.endpoint.startsWith("vote."));
    const voteFailures = voteResults.filter((r) => !r.success);

    if (voteFailures.length === voteResults.length) {
      console.log("  🚨 ALL VOTE ENDPOINTS FAILING - Voter token middleware completely broken");
    } else if (voteFailures.length > voteResults.length * 0.5) {
      console.log("  ⚠️  MAJORITY OF VOTE ENDPOINTS FAILING - Voter token middleware issues");
    } else {
      console.log("  ✅ Vote endpoints mostly working");
    }

    // Check context dependency
    const contextDependentEndpoints = ["vote.getUserVoteHistory", "vote.getFinalXpCalculation"];
    const contextResults = this.results.filter((r) =>
      contextDependentEndpoints.some((ep) => r.endpoint.includes(ep))
    );

    const contextFailures = contextResults.filter((r) => !r.success);
    if (contextFailures.length > 0) {
      console.log("  🚨 CONTEXT-DEPENDENT ENDPOINTS FAILING - Voter token context issue");
    }

    // Check empty object responses
    const emptyObjectResults = this.results.filter(
      (r) => r.success && r.data && typeof r.data === "object" && Object.keys(r.data).length === 0
    );

    if (emptyObjectResults.length > 0) {
      console.log("  🚨 EMPTY OBJECT RESPONSES DETECTED - Middleware context not properly set");
      console.log("    This is the main issue you're experiencing!");
    }

    // Recommendations
    console.log("\n🎯 DIAGNOSTIC RECOMMENDATIONS:");

    if (voteFailures.length > 0) {
      console.log("  1. Check voterTokenMiddleware in src/lib/api/trpc.ts");
      console.log("  2. Verify voter token extraction from cookies");
      console.log("  3. Test IP address extraction logic");
      console.log("  4. Check database connection for voter token operations");
    }

    if (emptyObjectResults.length > 0) {
      console.log("  5. Check createTRPCContext function");
      console.log("  6. Verify middleware chain execution order");
      console.log("  7. Test context passing between middleware and procedures");
    }

    if (contextFailures.length > 0) {
      console.log("  8. Check voter token context in procedure calls");
      console.log("  9. Verify voterTokenRecord is properly set");
    }

    // Success indicators
    const questionResults = this.results.filter((r) => r.endpoint.startsWith("question."));
    const questionFailures = questionResults.filter((r) => !r.success);

    if (questionFailures.length === 0) {
      console.log("  ✅ Question endpoints working - tRPC base setup is correct");
    }

    const contentResults = this.results.filter((r) => r.endpoint.startsWith("content."));
    const contentFailures = contentResults.filter((r) => !r.success);

    if (contentFailures.length === 0) {
      console.log("  ✅ Content endpoints working - Database connectivity is good");
    }
  }

  async runAll() {
    console.log("🚀 STARTING COMPREHENSIVE tRPC HTTP ENDPOINT TESTING");
    console.log("=".repeat(70));
    console.log(`🎯 Testing against: ${TRPC_URL}`);
    console.log(`🕒 Started at: ${new Date().toISOString()}`);
    console.log(`🔍 Focus: Identifying exact tRPC middleware failure points`);

    try {
      // Test in order of dependency
      await this.testQuestionEndpoints();
      await this.testVoteEndpoints();
      await this.testContentEndpoints();
      await this.testMiddlewareSpecific();
      await this.testErrorHandling();

      this.generateReport();
    } catch (error) {
      console.error("💥 Test suite failed:", error);
      process.exit(1);
    }
  }
}

// Run the tests
async function main() {
  const tester = new TRPCHTTPTester();
  await tester.runAll();
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { TRPCHTTPTester };
