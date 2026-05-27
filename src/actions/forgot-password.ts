"use server";

import { headers } from "next/headers";
import { ForgotPasswordSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendEmail } from "@/lib/resend";
import { getPasswordResetEmailHtml } from "@/lib/templates";
import { checkRateLimit } from "@/lib/rate-limit";

export async function forgotPassword(values: unknown) {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Please enter a valid email address." };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  const result = checkRateLimit(ip, 5, 10 * 60 * 1000);

  if (!result.allowed) {
    return { error: "Too many requests. Please try again later." };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return { success: "If an account with that email exists, a reset link has been sent." };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    const emailResult = await sendEmail({
      to: email,
      subject: "SecureGate - Reset Your Password",
      html: getPasswordResetEmailHtml(passwordResetToken.token),
    });

    if (!emailResult.success) {
      return { error: "The reset email could not be sent. Please try again later." };
    }

    return { success: "If an account with that email exists, a reset link has been sent.", email };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
