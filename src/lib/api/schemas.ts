import { z } from "zod";

// Question schemas
export const getQuestionByIdSchema = z.object({
  id: z.string().cuid(),
});

export const getActiveQuestionsSchema = z.object({
  category: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const getQuestionResultsSchema = z.object({
  questionId: z.string().cuid(),
});

// Vote schemas
export const submitVoteSchema = z.object({
  questionId: z.string().cuid(),
  response: z.union([
    z.string(), // For binary choices, text responses
    z.number(), // For rating scales
    z.array(z.string()), // For multiple choice or ranking
    z.record(z.unknown()), // For complex JSON responses
  ]),
});

export const getVoteStatsSchema = z.object({
  questionId: z.string().cuid(),
});

// Content schemas
export const getContentBlocksSchema = z.object({
  pageKey: z.string(),
  blockKey: z.string().optional(),
});

export const updateContentBlockSchema = z.object({
  id: z.string().cuid(),
  content: z.string(),
});

export const getProjectStatsSchema = z.object({
  statKey: z.string().optional(),
});

export const getCommunityStatsSchema = z.object({
  includeDaily: z.boolean().optional(),
});

// XP schemas
export const recordXpSchema = z.object({
  action: z.enum(["vote", "streak", "milestone", "newsletter"]),
  amount: z.number().min(1).max(100),
  metadata: z.record(z.unknown()).optional(),
});

export const claimXpSchema = z.object({
  email: z.string().email(),
  voterTokenHash: z.string(),
});

export const getEngagementStatsSchema = z.object({
  voterTokenId: z.string().cuid().optional(),
  includeMilestones: z.boolean().optional(),
});

// Newsletter schemas
export const subscribeNewsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export const unsubscribeNewsletterSchema = z.object({
  token: z.string(),
});

// Admin schemas
export const createQuestionSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  questionType: z.enum(["binary", "multiple_choice", "rating", "ranking", "text", "image"]),
  questionData: z.record(z.unknown()),
  category: z.string(),
  displayOrder: z.number().default(0),
  scheduledStart: z.date().optional(),
  scheduledEnd: z.date().optional(),
});

export const updateQuestionSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  questionData: z.record(z.unknown()).optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
  scheduledStart: z.date().optional(),
  scheduledEnd: z.date().optional(),
});

export const deleteQuestionSchema = z.object({
  id: z.string().cuid(),
});

// Blog post schemas
export const getBlogPostsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
  postType: z.enum(["blog", "journey", "announcement"]).optional(),
  status: z.enum(["draft", "published", "archived"]).optional().default("published"),
  featured: z.boolean().optional(),
  search: z.string().optional(),
});

export const getBlogPostBySlugSchema = z.object({
  slug: z.string().min(1),
});

export const createBlogPostSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  excerpt: z.string().optional(),
  content: z.string(),
  postType: z.enum(["blog", "journey", "announcement"]).default("blog"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

export const updateBlogPostSchema = z.object({
  id: z.string().cuid(),
  slug: z.string().min(1).max(200).optional(),
  title: z.string().min(1).max(500).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  postType: z.enum(["blog", "journey", "announcement"]).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
  publishedAt: z.date().optional(),
});

export const deleteBlogPostSchema = z.object({
  id: z.string().cuid(),
});

// Response type helpers
export type GetActiveQuestionsInput = z.infer<typeof getActiveQuestionsSchema>;
export type SubmitVoteInput = z.infer<typeof submitVoteSchema>;
export type GetContentBlocksInput = z.infer<typeof getContentBlocksSchema>;
export type RecordXpInput = z.infer<typeof recordXpSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type GetBlogPostsInput = z.infer<typeof getBlogPostsSchema>;
export type GetBlogPostBySlugInput = z.infer<typeof getBlogPostBySlugSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
