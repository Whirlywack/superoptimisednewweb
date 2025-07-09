import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const claimXpSchema = z.object({
  token: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Validate token
    const result = claimXpSchema.safeParse({ token });
    if (!result.success) {
      return NextResponse.redirect(new URL("/claim-xp/invalid", request.url));
    }

    const validatedToken = result.data.token;

    // Find the XP claim record
    const xpClaim = await prisma.xpClaim.findFirst({
      where: {
        claimToken: validatedToken,
        status: "pending",
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        voterToken: {
          include: {
            xpLedger: true,
          },
        },
      },
    });

    if (!xpClaim) {
      return NextResponse.redirect(new URL("/claim-xp/invalid", request.url));
    }

    // Update the claim status to claimed
    await prisma.xpClaim.update({
      where: { id: xpClaim.id },
      data: {
        status: "claimed",
        claimedAt: new Date(),
      },
    });

    // Redirect to success page with XP information
    const successUrl = new URL("/claim-xp/success", request.url);
    successUrl.searchParams.set("totalXp", xpClaim.totalXp.toString());
    successUrl.searchParams.set("email", xpClaim.email);
    
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error("XP claim error:", error);
    return NextResponse.redirect(new URL("/claim-xp/error", request.url));
  }
}