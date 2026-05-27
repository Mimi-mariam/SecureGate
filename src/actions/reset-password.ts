"use server";

import { ResetPasswordSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/bcrypt";
import { sendEmail } from "@/lib/resend";
import { getPasswordChangedEmailHtml } from "@/lib/templates";

export async function resetPassword(values: unknown) {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields. Please check your inputs." };
  }

  const { token, password } = validatedFields.data;

  try {
    const existingToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Invalid or expired reset link." };
    }

    if (new Date() > existingToken.expires) {
      await db.passwordResetToken.delete({
        where: { id: existingToken.id },
      });
      return { error: "Reset link has expired. Please request a new one." };
    }

    const hashedPassword = await hashPassword(password);

    await db.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    // Send a confirmation email
    await sendEmail({
      to: existingToken.email,
      subject: "SecureGate - Password Changed Successfully",
      html: getPasswordChangedEmailHtml(),
    });

    return { success: "Password has been reset successfully. You can now sign in." };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
