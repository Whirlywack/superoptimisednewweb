import { prisma } from "@/lib/db";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  completionPercentage: number;
  isCompleted: boolean;
  completedAt?: Date;
  category: "development" | "community" | "content" | "features";
}

export interface ProjectProgress {
  overallPercentage: number;
  totalTasks: number;
  completedTasks: number;
  currentPhase: string;
  nextMilestone: Milestone | null;
  milestones: Milestone[];
  lastUpdated: Date;
}

// Define the project phases and their tasks
const PROJECT_PHASES = {
  "Phase 1": { tasks: 4, title: "Core tRPC API Foundation" },
  "Phase 2": { tasks: 4, title: "Real-time Updates & WebSocket Integration" },
  "Phase 3": { tasks: 4, title: "Frontend Integration & localStorage Migration" },
  "Phase 4": { tasks: 3, title: "XP System & Engagement Tracking" },
  "Phase 5": { tasks: 4, title: "Content Management System" },
  "Phase 6": { tasks: 3, title: "Advanced Question Types" },
  "Phase 7": { tasks: 2, title: "Newsletter System Integration" },
  "Phase 8": { tasks: 4, title: "Admin Dashboard" },
  "Phase 9": { tasks: 2, title: "Mobile & Touch Optimization" },
  "Phase 10": { tasks: 2, title: "Social Media Integration" },
  "Phase 11": { tasks: 3, title: "Performance & Security" },
  "Phase 12": { tasks: 4, title: "Testing & Quality Assurance" },
  "Phase 13": { tasks: 3, title: "Documentation & Deployment" },
} as const;

export async function calculateProjectProgress(): Promise<ProjectProgress> {
  // Get current stats from database
  const [communityStats] = await Promise.all([
    // Community engagement stats
    Promise.all([
      prisma.questionResponse.count(),
      prisma.voterToken.count(),
      prisma.xpLedger.aggregate({ _sum: { xpAmount: true } }),
      prisma.newsletterSubscriber.count({ where: { status: "confirmed" } }),
      prisma.question.count({ where: { isActive: true } }),
    ]),
    // Project stats (for future use)
    prisma.projectStat.findMany(),
  ]);

  const [totalVotes, _uniqueVoters, totalXp, newsletterSubs, _activeQuestions] = communityStats;

  // Calculate phase completion (hardcoded for now based on tasks.md)
  const completedPhases = 4; // Phases 1-4 are complete
  const totalTasks = Object.values(PROJECT_PHASES).reduce((sum, phase) => sum + phase.tasks, 0);
  const completedTasks =
    Object.values(PROJECT_PHASES)
      .slice(0, completedPhases)
      .reduce((sum, phase) => sum + phase.tasks, 0) + 3; // + 3 tasks from Phase 5

  const overallPercentage = Math.round((completedTasks / totalTasks) * 100);

  // Define milestones with current values
  const milestones: Milestone[] = [
    {
      id: "phase-5-completion",
      title: "Content Management System",
      description: "Complete dynamic content blocks and project stats tracking",
      targetValue: 4,
      currentValue: 3, // 3/4 tasks completed
      completionPercentage: 75,
      isCompleted: false,
      category: "development",
    },
    {
      id: "community-100-votes",
      title: "100 Community Votes",
      description: "Reach 100 total community votes on decisions",
      targetValue: 100,
      currentValue: totalVotes,
      completionPercentage: Math.min((totalVotes / 100) * 100, 100),
      isCompleted: totalVotes >= 100,
      completedAt: totalVotes >= 100 ? new Date() : undefined,
      category: "community",
    },
    {
      id: "xp-system-1000",
      title: "1000 XP Distributed",
      description: "Distribute 1000 XP points to community members",
      targetValue: 1000,
      currentValue: totalXp._sum.xpAmount || 0,
      completionPercentage: Math.min(((totalXp._sum.xpAmount || 0) / 1000) * 100, 100),
      isCompleted: (totalXp._sum.xpAmount || 0) >= 1000,
      completedAt: (totalXp._sum.xpAmount || 0) >= 1000 ? new Date() : undefined,
      category: "community",
    },
    {
      id: "newsletter-50-subscribers",
      title: "50 Newsletter Subscribers",
      description: "Build an engaged community of 50 newsletter subscribers",
      targetValue: 50,
      currentValue: newsletterSubs,
      completionPercentage: Math.min((newsletterSubs / 50) * 100, 100),
      isCompleted: newsletterSubs >= 50,
      completedAt: newsletterSubs >= 50 ? new Date() : undefined,
      category: "community",
    },
    {
      id: "phase-6-advanced-questions",
      title: "Advanced Question Types",
      description: "Implement multi-choice, rating, and ranking question support",
      targetValue: 3,
      currentValue: 0,
      completionPercentage: 0,
      isCompleted: false,
      category: "features",
    },
    {
      id: "admin-dashboard",
      title: "Admin Dashboard",
      description: "Complete admin interface for question and content management",
      targetValue: 4,
      currentValue: 0,
      completionPercentage: 0,
      isCompleted: false,
      category: "development",
    },
  ];

  // Find next milestone
  const nextMilestone = milestones.find((m) => !m.isCompleted) || null;

  // Determine current phase
  const currentPhase = completedPhases < 5 ? "Phase 5" : `Phase ${completedPhases + 1}`;

  return {
    overallPercentage,
    totalTasks,
    completedTasks,
    currentPhase,
    nextMilestone,
    milestones,
    lastUpdated: new Date(),
  };
}

export async function updateProjectStats(
  statKey: string,
  value: string | number,
  description?: string
): Promise<void> {
  await prisma.projectStat.upsert({
    where: { statKey },
    update: {
      statValue: String(value),
      description: description || undefined,
      lastUpdated: new Date(),
    },
    create: {
      statKey,
      statValue: String(value),
      description: description || undefined,
    },
  });
}

export async function recordMilestoneCompletion(
  milestoneId: string,
  completedAt: Date = new Date()
): Promise<void> {
  await updateProjectStats(
    `milestone_${milestoneId}`,
    completedAt.toISOString(),
    `Milestone completed: ${milestoneId}`
  );
}

// Auto-update progress stats
export async function refreshProjectProgress(): Promise<ProjectProgress> {
  const progress = await calculateProjectProgress();

  // Update project stats in database
  await Promise.all([
    updateProjectStats(
      "overall_progress",
      progress.overallPercentage,
      "Overall project completion percentage"
    ),
    updateProjectStats(
      "completed_tasks",
      progress.completedTasks,
      "Number of completed development tasks"
    ),
    updateProjectStats("current_phase", progress.currentPhase, "Current development phase"),
    updateProjectStats(
      "last_progress_update",
      new Date().toISOString(),
      "Last time progress was calculated"
    ),
  ]);

  return progress;
}
