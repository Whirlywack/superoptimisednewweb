import { Resend } from "resend";
import { WelcomeEmail } from "./templates/WelcomeEmail";
import { XpClaimEmail } from "./templates/XpClaimEmail";
import { createElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
    to,
    subject: "Welcome!",
    react: createElement(WelcomeEmail, { name }),
  });
}

export async function sendXpClaimEmail(to: string, totalXp: number, claimToken: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const claimUrl = `${baseUrl}/claim-xp?token=${claimToken}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
    to,
    subject: `🏆 Claim your ${totalXp.toLocaleString()} XP - Superoptimised`,
    react: createElement(XpClaimEmail, { totalXp, claimUrl }),
  });
}
