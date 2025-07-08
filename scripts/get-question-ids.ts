#!/usr/bin/env npx tsx

import { prisma } from "../src/lib/db";

async function getQuestionIds() {
  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        isActive: true,
      },
      take: 5,
    });

    console.log("Questions in database:");
    questions.forEach((q, i) => {
      console.log(`${i + 1}. ID: ${q.id} | Title: ${q.title} | Active: ${q.isActive}`);
    });

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

getQuestionIds();
