#!/usr/bin/env tsx

import { prisma } from "../src/lib/db";

async function testSession() {
  const email = "aideagogo@gmail.com";
  
  console.log("Checking all sessions and accounts for:", email);
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        sessions: true,
        accounts: true
      }
    });

    console.log("User with sessions:", JSON.stringify(user, null, 2));
    
    // Check if there are any active sessions
    if (user?.sessions && user.sessions.length > 0) {
      console.log("\n🔍 Active sessions found. You may need to sign out and sign back in for admin role to take effect.");
      
      // Optionally clear sessions to force re-authentication
      console.log("Clearing old sessions...");
      await prisma.session.deleteMany({
        where: { userId: user.id }
      });
      console.log("✅ Sessions cleared. Please sign in again.");
    }
    
  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSession();