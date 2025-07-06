import { trackProgressEvent } from "./progress-automation";
import { updateProjectStats } from "./milestone-tracker";

// Manual functions for updating progress when phases/tasks are completed

export async function markPhaseCompleted(phaseNumber: number, totalTasks: number): Promise<void> {
  await trackProgressEvent({
    type: "phase_completed",
    data: { phaseNumber, totalTasks },
    timestamp: new Date(),
  });
}

export async function markTaskCompleted(
  phaseNumber: number,
  taskNumber: number,
  taskName: string
): Promise<void> {
  const taskKey = `phase_${phaseNumber}_task_${taskNumber}`;

  await updateProjectStats(
    `${taskKey}_completed_at`,
    new Date().toISOString(),
    `Task completed: ${taskName}`
  );

  // Check if this phase is now complete
  await checkPhaseCompletion(phaseNumber);
}

async function checkPhaseCompletion(phaseNumber: number): Promise<void> {
  // Define expected tasks per phase based on tasks.md
  const PHASE_TASK_COUNTS = {
    1: 4,
    2: 4,
    3: 4,
    4: 3,
    5: 4,
    6: 3,
    7: 2,
    8: 4,
    9: 2,
    10: 2,
    11: 3,
    12: 4,
    13: 3,
  };

  const expectedTasks = PHASE_TASK_COUNTS[phaseNumber as keyof typeof PHASE_TASK_COUNTS];
  if (!expectedTasks) return;

  // Count completed tasks for this phase (simplified check)
  // In a real implementation, you'd query the database for actual task completion
  // For now, we'll manually track major phase completions

  if (phaseNumber === 5) {
    // Check if Phase 5 tasks are complete
    // We've completed tasks 5.1.1, 5.1.2, 5.1.3, 5.2.1, 5.2.2, 5.2.3
    // Still need 5.1.4 and 5.2.4 to complete Phase 5
    console.log(`Phase ${phaseNumber} progress check - not yet complete`);
  }
}

// Helper to manually trigger milestone updates (for development/testing)
export async function triggerMilestoneCheck(): Promise<void> {
  await trackProgressEvent({
    type: "vote_submitted",
    data: { manual: true },
    timestamp: new Date(),
  });
}

// Update current development focus
export async function updateDevelopmentFocus(
  currentPhase: string,
  currentFeature: string,
  nextMilestone: string
): Promise<void> {
  await Promise.all([
    updateProjectStats("current_development_phase", currentPhase, "Current development phase"),
    updateProjectStats("current_feature", currentFeature, "Feature currently being developed"),
    updateProjectStats("next_milestone", nextMilestone, "Next major milestone target"),
    updateProjectStats(
      "development_focus_updated_at",
      new Date().toISOString(),
      "Last development focus update"
    ),
  ]);
}
