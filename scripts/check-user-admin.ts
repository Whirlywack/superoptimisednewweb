#!/usr/bin/env tsx

import { prisma } from "../src/lib/db";

async function checkUserAdmin() {
  const email = "aideagogo@gmail.com";
  
  console.log(`Checking admin status for: ${email}`);
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAdmin: true,
        createdAt: true
      }
    });

    if (!user) {
      console.log("❌ User not found in database");
      console.log("Creating admin user...");
      
      const newUser = await prisma.user.create({
        data: {
          email,
          name: "Admin User",
          role: "admin",
          isAdmin: true
        }
      });
      
      console.log("✅ Admin user created:", newUser);
    } else {
      console.log("👤 User found:", user);
      
      if (user.role !== "admin" || !user.isAdmin) {
        console.log("🔧 Updating user to admin...");
        
        const updatedUser = await prisma.user.update({
          where: { email },
          data: {
            role: "admin",
            isAdmin: true
          }
        });
        
        console.log("✅ User updated to admin:", updatedUser);
      } else {
        console.log("✅ User is already admin");
      }
    }
    
  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserAdmin();