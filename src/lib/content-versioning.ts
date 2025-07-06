import { prisma } from "@/lib/db";

export interface ContentVersion {
  id: string;
  contentBlockId: string;
  version: number;
  content: string;
  contentType: string;
  changeReason?: string;
  createdAt: Date;
  createdBy?: string;
}

export interface ContentVersionInfo {
  currentVersion: number;
  versions: ContentVersion[];
  totalVersions: number;
}

/**
 * Create a new version of a content block
 */
export async function createContentVersion(
  contentBlockId: string,
  newContent: string,
  changeReason?: string,
  createdBy?: string
): Promise<ContentVersion> {
  return await prisma.$transaction(async (tx) => {
    // Get the current content block
    const currentBlock = await tx.contentBlock.findUnique({
      where: { id: contentBlockId },
    });

    if (!currentBlock) {
      throw new Error(`Content block ${contentBlockId} not found`);
    }

    // Get the latest version number
    const latestVersion = await tx.contentVersion.findFirst({
      where: { contentBlockId },
      orderBy: { version: "desc" },
    });

    const newVersionNumber = (latestVersion?.version || 0) + 1;

    // Create version record for the current content (before updating)
    if (!latestVersion) {
      // Create version 1 for the original content
      await tx.contentVersion.create({
        data: {
          contentBlockId,
          version: 1,
          content: currentBlock.content,
          contentType: currentBlock.contentType,
          changeReason: "Initial version",
        },
      });
    }

    // Create new version record
    const newVersion = await tx.contentVersion.create({
      data: {
        contentBlockId,
        version: newVersionNumber,
        content: newContent,
        contentType: currentBlock.contentType,
        changeReason,
        createdBy,
      },
    });

    // Update the content block with new content
    await tx.contentBlock.update({
      where: { id: contentBlockId },
      data: {
        content: newContent,
        version: newVersionNumber,
        updatedAt: new Date(),
      },
    });

    return newVersion;
  });
}

/**
 * Get all versions of a content block
 */
export async function getContentVersions(contentBlockId: string): Promise<ContentVersionInfo> {
  const versions = await prisma.contentVersion.findMany({
    where: { contentBlockId },
    orderBy: { version: "desc" },
  });

  const currentBlock = await prisma.contentBlock.findUnique({
    where: { id: contentBlockId },
    select: { version: true },
  });

  return {
    currentVersion: currentBlock?.version || 1,
    versions,
    totalVersions: versions.length,
  };
}

/**
 * Get a specific version of a content block
 */
export async function getContentVersion(
  contentBlockId: string,
  version: number
): Promise<ContentVersion | null> {
  return await prisma.contentVersion.findFirst({
    where: {
      contentBlockId,
      version,
    },
  });
}

/**
 * Rollback content block to a previous version
 */
export async function rollbackContentToVersion(
  contentBlockId: string,
  targetVersion: number,
  rollbackReason?: string,
  rollbackBy?: string
): Promise<ContentVersion> {
  return await prisma.$transaction(async (tx) => {
    // Get the target version content
    const targetVersionContent = await tx.contentVersion.findFirst({
      where: {
        contentBlockId,
        version: targetVersion,
      },
    });

    if (!targetVersionContent) {
      throw new Error(`Version ${targetVersion} not found for content block ${contentBlockId}`);
    }

    // Get current content block info
    const currentBlock = await tx.contentBlock.findUnique({
      where: { id: contentBlockId },
    });

    if (!currentBlock) {
      throw new Error(`Content block ${contentBlockId} not found`);
    }

    // Create a new version for the rollback
    const latestVersion = await tx.contentVersion.findFirst({
      where: { contentBlockId },
      orderBy: { version: "desc" },
    });

    const newVersionNumber = (latestVersion?.version || 0) + 1;
    const rollbackReasonText = rollbackReason || `Rolled back to version ${targetVersion}`;

    // Create new version record with the rolled back content
    const rollbackVersion = await tx.contentVersion.create({
      data: {
        contentBlockId,
        version: newVersionNumber,
        content: targetVersionContent.content,
        contentType: targetVersionContent.contentType,
        changeReason: rollbackReasonText,
        createdBy: rollbackBy,
      },
    });

    // Update the content block with the rolled back content
    await tx.contentBlock.update({
      where: { id: contentBlockId },
      data: {
        content: targetVersionContent.content,
        version: newVersionNumber,
        updatedAt: new Date(),
      },
    });

    return rollbackVersion;
  });
}

/**
 * Compare two versions of content
 */
export async function compareContentVersions(
  contentBlockId: string,
  version1: number,
  version2: number
): Promise<{
  version1Content: ContentVersion | null;
  version2Content: ContentVersion | null;
  differences: {
    hasChanges: boolean;
    charactersAdded: number;
    charactersRemoved: number;
    linesAdded: number;
    linesRemoved: number;
  };
}> {
  const [v1, v2] = await Promise.all([
    getContentVersion(contentBlockId, version1),
    getContentVersion(contentBlockId, version2),
  ]);

  if (!v1 || !v2) {
    return {
      version1Content: v1,
      version2Content: v2,
      differences: {
        hasChanges: false,
        charactersAdded: 0,
        charactersRemoved: 0,
        linesAdded: 0,
        linesRemoved: 0,
      },
    };
  }

  // Simple diff calculation
  const content1 = v1.content;
  const content2 = v2.content;

  const lines1 = content1.split("\n");
  const lines2 = content2.split("\n");

  const charactersAdded = content2.length > content1.length ? content2.length - content1.length : 0;
  const charactersRemoved =
    content1.length > content2.length ? content1.length - content2.length : 0;
  const linesAdded = lines2.length > lines1.length ? lines2.length - lines1.length : 0;
  const linesRemoved = lines1.length > lines2.length ? lines1.length - lines2.length : 0;

  return {
    version1Content: v1,
    version2Content: v2,
    differences: {
      hasChanges: content1 !== content2,
      charactersAdded,
      charactersRemoved,
      linesAdded,
      linesRemoved,
    },
  };
}

/**
 * Cleanup old versions (keep only the latest N versions)
 */
export async function cleanupOldVersions(
  contentBlockId: string,
  keepLatest: number = 10
): Promise<number> {
  const versions = await prisma.contentVersion.findMany({
    where: { contentBlockId },
    orderBy: { version: "desc" },
    skip: keepLatest,
  });

  if (versions.length === 0) {
    return 0;
  }

  const versionsToDelete = versions.map((v) => v.id);

  const result = await prisma.contentVersion.deleteMany({
    where: {
      id: { in: versionsToDelete },
    },
  });

  return result.count;
}

/**
 * Get content versioning statistics
 */
export async function getVersioningStats(): Promise<{
  totalContentBlocks: number;
  totalVersions: number;
  averageVersionsPerBlock: number;
  mostVersionedBlock: {
    id: string;
    pageKey: string;
    blockKey: string;
    versionCount: number;
  } | null;
  recentChanges: Array<{
    contentBlockId: string;
    version: number;
    changeReason: string | null;
    createdAt: Date;
    createdBy: string | null;
  }>;
}> {
  const [totalContentBlocks, totalVersions, mostVersionedResult, recentChanges] = await Promise.all(
    [
      prisma.contentBlock.count(),
      prisma.contentVersion.count(),
      prisma.contentVersion.groupBy({
        by: ["contentBlockId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }),
      prisma.contentVersion.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          contentBlockId: true,
          version: true,
          changeReason: true,
          createdAt: true,
          createdBy: true,
        },
      }),
    ]
  );

  let mostVersionedBlock = null;
  if (mostVersionedResult.length > 0) {
    const blockInfo = await prisma.contentBlock.findUnique({
      where: { id: mostVersionedResult[0].contentBlockId },
      select: { id: true, pageKey: true, blockKey: true },
    });

    if (blockInfo) {
      mostVersionedBlock = {
        ...blockInfo,
        versionCount: mostVersionedResult[0]._count.id,
      };
    }
  }

  return {
    totalContentBlocks,
    totalVersions,
    averageVersionsPerBlock: totalContentBlocks > 0 ? totalVersions / totalContentBlocks : 0,
    mostVersionedBlock,
    recentChanges,
  };
}
