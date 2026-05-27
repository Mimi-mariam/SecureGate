"use server";

import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/resend";
import { getVerificationEmailHtml } from "@/lib/templates";

/**
 * Validates a 6-digit verification token against the database,
 * updates the user's emailVerified status, and deletes the token.
 */
export async function verifyEmail(email: string, token: string) {
  try {
    // 1. Fetch token record
    const existingToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Invalid verification code." };
    }

    if (existingToken.identifier !== email) {
      return { error: "This code is not valid for this email address." };
    }

    // 2. Check expiry
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Verification code has expired." };
    }

    // 3. Mark user verified in PostgreSQL
    await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // 4. Delete the used token
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    return { success: "Account successfully verified!" };
  } catch (error) {
    console.error("Verification server error:", error);
    return { error: "A server database error occurred. Please try again." };
  }
}

/**
 * Regenerates a verification token for a user and dispatches
 * a secure email with the token via Resend.
 */
export async function resendVerificationCode(email: string, name: string) {
  try {
    // Verify user exists and is not already verified
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "This email address is not registered." };
    }

    if (user.emailVerified) {
      return { error: "This account has already been verified." };
    }

    // Generate and send token
    const token = await generateVerificationToken(email);
    
    const emailResult = await sendEmail({
      to: email,
      subject: "Verify your SecureGate Account",
      html: getVerificationEmailHtml(token.token, name || user.name || "Operator"),
    });

    if (!emailResult.success) {
      return { error: "Failed to dispatch email. Please check your config." };
    }

    return { success: "A fresh verification link has been sent to your email." };
  } catch (error) {
    console.error("Resend token server error:", error);
    return { error: "An error occurred while generating a fresh token." };
  }
}
