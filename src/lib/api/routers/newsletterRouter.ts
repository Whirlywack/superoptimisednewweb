import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../db";
import { sendEmail } from "../../email/sendEmail";
import crypto from "crypto";

/**
 * Newsletter Router
 * 
 * Handles newsletter subscription management including:
 * - Email subscription with validation
 * - Double opt-in confirmation flow
 * - Subscription preferences
 * - Analytics tracking
 */

export const newsletterRouter = createTRPCRouter({
  /**
   * Subscribe to newsletter
   * Creates a pending subscription and sends confirmation email
   */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        name: z.string().optional(),
        sourcePage: z.string().optional(),
        preferences: z.record(z.boolean()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, name, sourcePage, preferences = {} } = input;

      try {
        // Check if email already exists
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
          where: { email },
        });

        if (existingSubscriber) {
          if (existingSubscriber.status === "confirmed") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email is already subscribed to newsletter",
            });
          } else if (existingSubscriber.status === "pending") {
            // Resend confirmation email
            const verificationToken = crypto.randomBytes(32).toString("hex");
            
            await prisma.newsletterSubscriber.update({
              where: { id: existingSubscriber.id },
              data: {
                verificationToken,
                name: name || existingSubscriber.name,
                sourcePage: sourcePage || existingSubscriber.sourcePage,
                preferences: preferences as Record<string, boolean>,
                updatedAt: new Date(),
              },
            });

            await sendConfirmationEmail(email, name || "", verificationToken);

            return {
              success: true,
              message: "Confirmation email resent",
              subscriberId: existingSubscriber.id,
            };
          }
        }

        // Create new pending subscription
        const verificationToken = crypto.randomBytes(32).toString("hex");
        
        const subscriber = await prisma.newsletterSubscriber.create({
          data: {
            email,
            name,
            sourcePage,
            preferences: preferences as Record<string, boolean>,
            status: "pending",
            verificationToken,
          },
        });

        // Send confirmation email
        await sendConfirmationEmail(email, name || "", verificationToken);

        // Update daily analytics
        await updateDailyAnalytics();

        return {
          success: true,
          message: "Confirmation email sent",
          subscriberId: subscriber.id,
        };
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe to newsletter",
        });
      }
    }),

  /**
   * Confirm subscription via email token
   */
  confirm: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, "Verification token is required"),
      })
    )
    .mutation(async ({ input }) => {
      const { token } = input;

      try {
        const subscriber = await prisma.newsletterSubscriber.findFirst({
          where: {
            verificationToken: token,
            status: "pending",
          },
        });

        if (!subscriber) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid or expired verification token",
          });
        }

        // Confirm subscription
        await prisma.newsletterSubscriber.update({
          where: { id: subscriber.id },
          data: {
            status: "confirmed",
            confirmedAt: new Date(),
            verificationToken: null,
          },
        });

        // Update live stats
        await updateNewsletterStats();

        return {
          success: true,
          message: "Newsletter subscription confirmed",
          email: subscriber.email,
        };
      } catch (error) {
        console.error("Newsletter confirmation error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to confirm subscription",
        });
      }
    }),

  /**
   * Unsubscribe from newsletter
   */
  unsubscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        token: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;

      try {
        const subscriber = await prisma.newsletterSubscriber.findUnique({
          where: { email },
        });

        if (!subscriber) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Email not found in newsletter list",
          });
        }

        if (subscriber.status === "unsubscribed") {
          return {
            success: true,
            message: "Email already unsubscribed",
          };
        }

        // Unsubscribe
        await prisma.newsletterSubscriber.update({
          where: { id: subscriber.id },
          data: {
            status: "unsubscribed",
            unsubscribedAt: new Date(),
          },
        });

        // Update live stats
        await updateNewsletterStats();

        return {
          success: true,
          message: "Successfully unsubscribed from newsletter",
        };
      } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unsubscribe from newsletter",
        });
      }
    }),

  /**
   * Get newsletter subscription stats
   */
  getStats: publicProcedure.query(async () => {
    try {
      const [totalSubscribers, confirmedSubscribers, pendingSubscribers] = await Promise.all([
        prisma.newsletterSubscriber.count(),
        prisma.newsletterSubscriber.count({
          where: { status: "confirmed" },
        }),
        prisma.newsletterSubscriber.count({
          where: { status: "pending" },
        }),
      ]);

      // Get signup sources
      const signupSources = await prisma.newsletterSubscriber.groupBy({
        by: ["sourcePage"],
        _count: { id: true },
        where: { status: "confirmed" },
      });

      return {
        totalSubscribers,
        confirmedSubscribers,
        pendingSubscribers,
        signupSources: signupSources.map(source => ({
          source: source.sourcePage || "unknown",
          count: source._count.id,
        })),
      };
    } catch (error) {
      console.error("Newsletter stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get newsletter stats",
      });
    }
  }),

  /**
   * Update subscription preferences
   */
  updatePreferences: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        preferences: z.record(z.boolean()),
      })
    )
    .mutation(async ({ input }) => {
      const { email, preferences } = input;

      try {
        const subscriber = await prisma.newsletterSubscriber.findUnique({
          where: { email },
        });

        if (!subscriber) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Email not found in newsletter list",
          });
        }

        await prisma.newsletterSubscriber.update({
          where: { id: subscriber.id },
          data: {
            preferences: preferences as Record<string, boolean>,
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          message: "Preferences updated successfully",
        };
      } catch (error) {
        console.error("Newsletter preferences error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update preferences",
        });
      }
    }),
});

/**
 * Send confirmation email for newsletter subscription
 */
async function sendConfirmationEmail(email: string, name: string, token: string) {
  const confirmationUrl = `${process.env.SITE_URL || "http://localhost:3000"}/newsletter/confirm?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: "Confirm your newsletter subscription",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirm Your Newsletter Subscription</h2>
        <p>Hi ${name || "there"}!</p>
        <p>Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirm Subscription
          </a>
        </div>
        
        <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${confirmationUrl}">${confirmationUrl}</a></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          This email was sent to ${email}. If you have any questions, please contact us.
        </p>
      </div>
    `,
  });
}

/**
 * Update daily analytics with newsletter signup
 */
async function updateDailyAnalytics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await prisma.analyticsDaily.upsert({
      where: { date: today },
      update: {
        newsletterSignups: {
          increment: 1,
        },
      },
      create: {
        date: today,
        newsletterSignups: 1,
      },
    });
  } catch (error) {
    console.error("Failed to update daily analytics:", error);
  }
}

/**
 * Update live newsletter stats
 */
async function updateNewsletterStats() {
  try {
    const confirmedCount = await prisma.newsletterSubscriber.count({
      where: { status: "confirmed" },
    });

    await prisma.liveStat.upsert({
      where: { statKey: "newsletter_subscribers" },
      update: {
        statValue: confirmedCount,
        lastUpdated: new Date(),
      },
      create: {
        statKey: "newsletter_subscribers",
        statValue: confirmedCount,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to update newsletter stats:", error);
  }
}