#!/usr/bin/env tsx

/**
 * Simple test to verify magic link configuration
 * Does NOT send actual emails or expose sensitive data
 */

import { readFileSync } from "fs";
import { join } from "path";

function loadEnvVars() {
  try {
    const envPath = join(process.cwd(), ".env");
    const envContent = readFileSync(envPath, "utf8");
    const vars: Record<string, string> = {};

    envContent.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        vars[key.trim()] = value.trim().replace(/"/g, "");
      }
    });

    return vars;
  } catch {
    console.log("❌ Could not read .env file");
    return {};
  }
}

async function testMagicLinkConfig() {
  console.log("🔍 Testing Magic Link Configuration (Safe Mode)...\n");

  const envVars = loadEnvVars();

  // Check required variables without exposing values
  const checks = [
    { name: "RESEND_API_KEY", value: envVars.RESEND_API_KEY, required: true },
    { name: "EMAIL_FROM", value: envVars.EMAIL_FROM, required: true },
    { name: "ADMIN_EMAIL", value: envVars.ADMIN_EMAIL, required: true },
    { name: "NEXTAUTH_URL", value: envVars.NEXTAUTH_URL, required: true },
    { name: "NEXTAUTH_SECRET", value: envVars.NEXTAUTH_SECRET, required: true },
  ];

  console.log("📋 Configuration Check:");
  let allGood = true;

  checks.forEach((check) => {
    const status = check.value ? "✅" : "❌";
    const display = check.value
      ? check.name.includes("KEY") || check.name.includes("SECRET")
        ? "[SET]"
        : check.value
      : "[NOT SET]";
    console.log(`  ${status} ${check.name}: ${display}`);

    if (check.required && !check.value) {
      allGood = false;
    }
  });

  if (!allGood) {
    console.log("\n❌ Some required configuration is missing!");
    return;
  }

  // Test Resend API connectivity (without exposing the key)
  console.log("\n📧 Testing Resend API Connection...");
  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${envVars.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("  ✅ Resend API is accessible");
      const data = await response.json();
      console.log(`  ✅ Account has ${data.data?.length || 0} domains configured`);
    } else {
      console.log(`  ❌ Resend API error: ${response.status}`);
      if (response.status === 401) {
        console.log("  💡 Check your RESEND_API_KEY is correct");
      }
    }
  } catch {
    console.log("  ❌ Network error connecting to Resend");
  }

  // Validate email addresses
  console.log("\n📬 Email Configuration:");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (envVars.EMAIL_FROM) {
    const validFrom = emailRegex.test(envVars.EMAIL_FROM);
    console.log(`  ${validFrom ? "✅" : "❌"} FROM address: ${envVars.EMAIL_FROM}`);
  }

  if (envVars.ADMIN_EMAIL) {
    const validAdmin = emailRegex.test(envVars.ADMIN_EMAIL);
    console.log(`  ${validAdmin ? "✅" : "❌"} ADMIN address: ${envVars.ADMIN_EMAIL}`);
  }

  // Show NextAuth URLs
  console.log("\n🔗 NextAuth Configuration:");
  console.log(`  📍 Base URL: ${envVars.NEXTAUTH_URL}`);
  console.log(`  🔐 Sign-in URL: ${envVars.NEXTAUTH_URL}/api/auth/signin`);
  console.log(`  📧 Email callback: ${envVars.NEXTAUTH_URL}/api/auth/callback/email`);

  console.log("\n🧪 Manual Testing Steps:");
  console.log("  1. Start your dev server: npm run dev");
  console.log(`  2. Visit: ${envVars.NEXTAUTH_URL}/api/auth/signin`);
  console.log(`  3. Enter: ${envVars.ADMIN_EMAIL}`);
  console.log("  4. Check your email for the magic link");
  console.log(`  5. Magic link should redirect to: ${envVars.NEXTAUTH_URL}/admin/questions`);

  console.log("\n✅ Configuration test complete!");
  console.log("📧 If all checks pass, magic links should work when you test manually.");
}

testMagicLinkConfig().catch(console.error);
