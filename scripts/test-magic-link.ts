#!/usr/bin/env tsx

/**
 * Test script to verify magic link email functionality with Resend
 * This script tests the complete email flow for NextAuth magic links
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testMagicLinkSetup() {
  console.log("🔍 Testing Magic Link Email Setup...\n");

  // 1. Check environment variables
  console.log("📋 Environment Variables Check:");
  const requiredEnvVars = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };

  let missingVars = 0;
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    const status = value ? "✅" : "❌";
    const displayValue = value
      ? key.includes("KEY") || key.includes("SECRET") || key.includes("PASSWORD")
        ? "[REDACTED]"
        : value
      : "NOT SET";
    console.log(`  ${status} ${key}: ${displayValue}`);
    if (!value) missingVars++;
  }

  if (missingVars > 0) {
    console.log(`\n❌ ${missingVars} required environment variables are missing!`);
    process.exit(1);
  }

  // 2. Check database connection and admin user
  console.log("\n🗄️  Database Check:");
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL },
      select: { id: true, email: true, role: true, isAdmin: true },
    });

    if (adminUser) {
      console.log(`  ✅ Admin user exists: ${adminUser.email}`);
      console.log(`  ✅ Role: ${adminUser.role}, isAdmin: ${adminUser.isAdmin}`);
    } else {
      console.log(`  ❌ Admin user not found: ${process.env.ADMIN_EMAIL}`);
      return;
    }
  } catch (error) {
    console.log(`  ❌ Database connection failed: ${error}`);
    return;
  }

  // 3. Test Resend API connection
  console.log("\n📧 Resend API Test:");
  try {
    const resendResponse = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (resendResponse.ok) {
      const domains = await resendResponse.json();
      console.log(`  ✅ Resend API connection successful`);
      console.log(`  ✅ Available domains: ${domains.data?.length || 0}`);

      // Show domains if any
      if (domains.data?.length > 0) {
        domains.data.forEach((domain: any, index: number) => {
          console.log(`    ${index + 1}. ${domain.name} (${domain.status})`);
        });
      }
    } else {
      console.log(`  ❌ Resend API error: ${resendResponse.status} ${resendResponse.statusText}`);
      const errorText = await resendResponse.text();
      console.log(`  ❌ Error details: ${errorText}`);
    }
  } catch (error) {
    console.log(`  ❌ Resend API connection failed: ${error}`);
  }

  // 4. Test email configuration
  console.log("\n⚙️  NextAuth Email Configuration:");
  console.log(`  📤 SMTP Server: smtp.resend.com:465`);
  console.log(`  📧 From Address: ${process.env.EMAIL_FROM || "onboarding@resend.dev"}`);
  console.log(`  🔐 Auth Method: resend + API key`);

  // 5. Test magic link generation (simulation)
  console.log("\n🔗 Magic Link URL Test:");
  const testToken = "test-token-12345";
  const callbackUrl = `${process.env.NEXTAUTH_URL}/admin/questions`;
  const magicLinkUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?callbackUrl=${encodeURIComponent(callbackUrl)}&token=${testToken}&email=${encodeURIComponent(process.env.ADMIN_EMAIL!)}`;

  console.log(`  🔗 Sample magic link URL structure:`);
  console.log(`     ${magicLinkUrl.substring(0, 80)}...`);

  // 6. Recommendations
  console.log("\n💡 Recommendations:");

  if (!process.env.EMAIL_FROM || process.env.EMAIL_FROM === "noreply@example.com") {
    console.log(`  ⚠️  Set EMAIL_FROM to a verified domain in Resend`);
    console.log(`     Example: EMAIL_FROM="noreply@yourdomain.com"`);
  }

  if (process.env.EMAIL_SERVER_PASSWORD === "your-email-password") {
    console.log(`  ⚠️  Update EMAIL_SERVER_PASSWORD to your Resend API key`);
    console.log(`     EMAIL_SERVER_PASSWORD should match RESEND_API_KEY`);
  }

  console.log("\n🧪 To test magic link manually:");
  console.log(`  1. Start dev server: npm run dev`);
  console.log(`  2. Visit: ${process.env.NEXTAUTH_URL}/api/auth/signin`);
  console.log(`  3. Enter: ${process.env.ADMIN_EMAIL}`);
  console.log(`  4. Check email for magic link`);
  console.log(`  5. Click link to access: ${process.env.NEXTAUTH_URL}/admin/questions`);

  console.log("\n✅ Magic Link Setup Test Complete!");
}

// Run the test
testMagicLinkSetup()
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
