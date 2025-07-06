import { prisma } from "@/lib/db";

export interface ContentBlock {
  id: string;
  pageKey: string;
  blockKey: string;
  contentType: "text" | "json" | "markdown";
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cache for content blocks to avoid repeated database calls
const contentCache = new Map<string, ContentBlock>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getContentBlock(
  pageKey: string,
  blockKey: string
): Promise<ContentBlock | null> {
  const cacheKey = `${pageKey}.${blockKey}`;
  const cachedBlock = contentCache.get(cacheKey);

  // Return cached version if it exists and is still fresh
  if (cachedBlock && Date.now() - cachedBlock.updatedAt.getTime() < CACHE_DURATION) {
    return cachedBlock;
  }

  try {
    const block = await prisma.contentBlock.findUnique({
      where: {
        pageKey_blockKey: {
          pageKey,
          blockKey,
        },
      },
    });

    if (block) {
      contentCache.set(cacheKey, block);
      return block;
    }

    return null;
  } catch (error) {
    console.error("Error fetching content block:", error);
    return null;
  }
}

export async function getContentBlocks(pageKey: string): Promise<ContentBlock[]> {
  try {
    const blocks = await prisma.contentBlock.findMany({
      where: {
        pageKey,
        isActive: true,
      },
      orderBy: {
        blockKey: "asc",
      },
    });

    // Cache each block
    blocks.forEach((block) => {
      const cacheKey = `${block.pageKey}.${block.blockKey}`;
      contentCache.set(cacheKey, block);
    });

    return blocks;
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    return [];
  }
}

export function parseJsonContent(content: string): Record<string, unknown> {
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("Error parsing JSON content:", error);
    return null;
  }
}

// Helper function to get content with fallback
export async function getContentWithFallback(
  pageKey: string,
  blockKey: string,
  fallback: string
): Promise<string> {
  const block = await getContentBlock(pageKey, blockKey);
  return block?.content || fallback;
}
