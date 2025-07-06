import { prisma } from "@/lib/db";
import { updateProjectStats, recordMilestoneCompletion } from "@/lib/milestone-tracker";

export interface ProgressEvent {
  type:
    | "vote_submitted"
    | "xp_claimed"
    | "newsletter_signup"
    | "milestone_reached"
    | "phase_completed";
  data: Record<string, unknown>;
  timestamp: Date;
}

export async function trackProgressEvent(event: ProgressEvent): Promise<void> {
  try {
    switch (event.type) {
      case "vote_submitted":
        await handleVoteSubmitted(event);
        break;
      case "xp_claimed":
        await handleXpClaimed(event);
        break;
      case "newsletter_signup":
        await handleNewsletterSignup(event);
        break;
      case "milestone_reached":
        await handleMilestoneReached(event);
        break;
      case "phase_completed":
        await handlePhaseCompleted(event);
        break;
      default:
        console.warn(`Unknown progress event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Error tracking progress event:", error);
  }
}

async function handleVoteSubmitted(event: ProgressEvent): Promise<void> {
  // Update vote-related stats
  const totalVotes = await prisma.questionResponse.count();
  const uniqueVoters = await prisma.voterToken.count();

  await Promise.all([
    updateProjectStats("total_votes", totalVotes, "Total community votes cast"),
    updateProjectStats("unique_voters", uniqueVoters, "Number of unique community voters"),
    updateProjectStats(
      "last_vote_at",
      event.timestamp.toISOString(),
      "Timestamp of most recent vote"
    ),
  ]);

  // Check if we've hit vote milestones
  await checkVoteMilestones(totalVotes);
}

async function handleXpClaimed(event: ProgressEvent): Promise<void> {
  // Update XP-related stats
  const totalXp = await prisma.xpLedger.aggregate({
    _sum: { xpAmount: true },
    _count: { id: true },
  });

  await Promise.all([
    updateProjectStats(
      "total_xp_distributed",
      totalXp._sum.xpAmount || 0,
      "Total XP points distributed to community"
    ),
    updateProjectStats("xp_transactions", totalXp._count.id, "Number of XP transactions"),
    updateProjectStats(
      "last_xp_claim_at",
      event.timestamp.toISOString(),
      "Timestamp of most recent XP claim"
    ),
  ]);

  // Check if we've hit XP milestones
  await checkXpMilestones(totalXp._sum.xpAmount || 0);
}

async function handleNewsletterSignup(event: ProgressEvent): Promise<void> {
  // Update newsletter stats
  const totalSubscribers = await prisma.newsletterSubscriber.count({
    where: { status: "confirmed" },
  });

  await Promise.all([
    updateProjectStats(
      "newsletter_subscribers",
      totalSubscribers,
      "Confirmed newsletter subscribers"
    ),
    updateProjectStats(
      "last_newsletter_signup_at",
      event.timestamp.toISOString(),
      "Timestamp of most recent newsletter signup"
    ),
  ]);

  // Check if we've hit newsletter milestones
  await checkNewsletterMilestones(totalSubscribers);
}

async function handleMilestoneReached(event: ProgressEvent): Promise<void> {
  const { milestoneId } = event.data as { milestoneId: string };

  await recordMilestoneCompletion(milestoneId, event.timestamp);

  // Update milestone achievement count
  const milestoneCount = await prisma.projectStat.count({
    where: {
      statKey: { startsWith: "milestone_" },
    },
  });

  await updateProjectStats("milestones_achieved", milestoneCount, "Number of milestones completed");
}

async function handlePhaseCompleted(event: ProgressEvent): Promise<void> {
  const { phaseNumber } = event.data as { phaseNumber: number; totalTasks: number };

  await Promise.all([
    updateProjectStats(
      `phase_${phaseNumber}_completed_at`,
      event.timestamp.toISOString(),
      `Phase ${phaseNumber} completion timestamp`
    ),
    updateProjectStats("current_phase", phaseNumber + 1, "Current development phase number"),
    recordMilestoneCompletion(`phase_${phaseNumber}_completion`, event.timestamp),
  ]);

  // Recalculate overall progress
  await updateOverallProgress();
}

async function checkVoteMilestones(totalVotes: number): Promise<void> {
  const milestones = [25, 50, 100, 250, 500, 1000];

  for (const milestone of milestones) {
    if (totalVotes >= milestone) {
      // Check if this milestone was already recorded
      const existingMilestone = await prisma.projectStat.findUnique({
        where: { statKey: `milestone_votes_${milestone}` },
      });

      if (!existingMilestone) {
        await trackProgressEvent({
          type: "milestone_reached",
          data: { milestoneId: `votes_${milestone}` },
          timestamp: new Date(),
        });
      }
    }
  }
}

async function checkXpMilestones(totalXp: number): Promise<void> {
  const milestones = [100, 500, 1000, 2500, 5000];

  for (const milestone of milestones) {
    if (totalXp >= milestone) {
      // Check if this milestone was already recorded
      const existingMilestone = await prisma.projectStat.findUnique({
        where: { statKey: `milestone_xp_${milestone}` },
      });

      if (!existingMilestone) {
        await trackProgressEvent({
          type: "milestone_reached",
          data: { milestoneId: `xp_${milestone}` },
          timestamp: new Date(),
        });
      }
    }
  }
}

async function checkNewsletterMilestones(totalSubscribers: number): Promise<void> {
  const milestones = [10, 25, 50, 100, 250];

  for (const milestone of milestones) {
    if (totalSubscribers >= milestone) {
      // Check if this milestone was already recorded
      const existingMilestone = await prisma.projectStat.findUnique({
        where: { statKey: `milestone_newsletter_${milestone}` },
      });

      if (!existingMilestone) {
        await trackProgressEvent({
          type: "milestone_reached",
          data: { milestoneId: `newsletter_${milestone}` },
          timestamp: new Date(),
        });
      }
    }
  }
}

async function updateOverallProgress(): Promise<void> {
  // This would calculate overall progress based on completed phases
  // For now, we'll use the hardcoded values from milestone-tracker
  const completedPhases = 4; // Will be dynamic in the future
  const totalPhases = 13;
  const overallPercentage = Math.round((completedPhases / totalPhases) * 100);

  await updateProjectStats(
    "overall_progress_percentage",
    overallPercentage,
    "Overall project completion percentage"
  );
}

// Helper function to integrate with existing vote submission
export async function onVoteSubmitted(voterTokenId: string, questionId: string): Promise<void> {
  await trackProgressEvent({
    type: "vote_submitted",
    data: { voterTokenId, questionId },
    timestamp: new Date(),
  });
}

// Helper function to integrate with XP claiming
export async function onXpClaimed(email: string, totalXp: number): Promise<void> {
  await trackProgressEvent({
    type: "xp_claimed",
    data: { email, totalXp },
    timestamp: new Date(),
  });
}

// Helper function to integrate with newsletter signup
export async function onNewsletterSignup(email: string): Promise<void> {
  await trackProgressEvent({
    type: "newsletter_signup",
    data: { email },
    timestamp: new Date(),
  });
}
