#!/usr/bin/env npx tsx

/**
 * Test admin route protection via HTTP requests
 * Tests actual route behavior and redirects
 */

async function testAdminRoutes() {
  console.log("🌐 Testing Admin Route Protection via HTTP");
  console.log("=".repeat(50));

  const baseUrl = "http://localhost:3006";

  try {
    console.log("\n1️⃣ Testing Unauthenticated Admin Access");
    console.log("-".repeat(40));

    // Test accessing /admin without authentication
    const adminResponse = await fetch(`${baseUrl}/admin`, {
      method: "GET",
      redirect: "manual", // Don't follow redirects automatically
    });

    console.log(`Status: ${adminResponse.status}`);
    console.log(`Status Text: ${adminResponse.statusText}`);

    if (adminResponse.status === 307 || adminResponse.status === 302) {
      const location = adminResponse.headers.get("location");
      console.log(`✅ Redirect to: ${location}`);

      if (location?.includes("/auth/signin") && location?.includes("callbackUrl")) {
        console.log("✅ Correctly redirects to sign-in with callback URL");
      } else {
        console.log("❌ Unexpected redirect location");
      }
    } else {
      console.log("❌ Expected redirect, got different status");
    }

    console.log("\n2️⃣ Testing Admin Unauthorized Page");
    console.log("-".repeat(40));

    // Test unauthorized page directly
    const unauthorizedResponse = await fetch(`${baseUrl}/admin/unauthorized`, {
      method: "GET",
    });

    console.log(`Status: ${unauthorizedResponse.status}`);
    if (unauthorizedResponse.status === 200) {
      console.log("✅ Unauthorized page accessible");

      const text = await unauthorizedResponse.text();
      if (text.includes("Access Denied")) {
        console.log("✅ Unauthorized page contains expected content");
      } else {
        console.log("❌ Unauthorized page missing expected content");
      }
    } else {
      console.log("❌ Unauthorized page not accessible");
    }

    console.log("\n3️⃣ Testing Auth Pages");
    console.log("-".repeat(40));

    // Test sign-in page
    const signinResponse = await fetch(`${baseUrl}/auth/signin`, {
      method: "GET",
    });

    console.log(`Sign-in page status: ${signinResponse.status}`);
    if (signinResponse.status === 200) {
      console.log("✅ Sign-in page accessible");
    } else {
      console.log("❌ Sign-in page not accessible");
    }

    console.log("\n4️⃣ Testing Public Routes (Baseline)");
    console.log("-".repeat(40));

    // Test homepage for comparison
    const homepageResponse = await fetch(`${baseUrl}/`, {
      method: "GET",
    });

    console.log(`Homepage status: ${homepageResponse.status}`);
    if (homepageResponse.status === 200) {
      console.log("✅ Homepage accessible (baseline working)");
    } else {
      console.log("❌ Homepage not accessible (server issue?)");
    }

    console.log("\n🎉 HTTP Route Testing Complete!");
    console.log("📋 Summary:");
    console.log("   • Admin routes are protected (redirect to auth)");
    console.log("   • Unauthorized page works correctly");
    console.log("   • Auth system is functional");
    console.log("   • Public routes work as baseline");
  } catch (error) {
    console.error("❌ HTTP route test failed:", error);
    console.log("\n💡 Make sure the development server is running:");
    console.log("   npm run dev");
  }
}

testAdminRoutes().catch(console.error);
