"use server";
import { Prisma } from "@prisma/client";
import { RegisterSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/bcrypt";
import { generateVerificationToken } from "@/lib/tokens";
import { getVerificationEmailHtml } from "@/lib/templates";
import { sendEmail } from "@/lib/resend";

/**
 * Server Action to register a new user in PostgreSQL.
 */
export async function registerUser(values: unknown) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid form fields. Please check your inputs." };
  }

  const { employeeId, name, email, password } = validatedFields.data;

  try {
    // Check for existing email or employee ID
    const [existingUser, existingId] = await Promise.all([
      db.user.findUnique({ where: { email } }),
      db.user.findUnique({ where: { employeeId } }),
    ]);

    if (existingUser) {
      return { error: "A user with this email already exists. Please use a different email." };
    }
    if (existingId) {
      return { error: "An account with this employee ID already exists." };
    }

    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: { employeeId, name, email, password: hashedPassword },
    });

    const token = await generateVerificationToken(email);
    const emailResult = await sendEmail({
      to: email,
      subject: "Verify your SecureGate Account",
      html: getVerificationEmailHtml(token.token, name || user.name || "Operator"),
    });

    if (!emailResult.success) {
      return { error: "Account created but verification email could not be sent. Please request a new verification link." };
    }

    return { success: "Account successfully created! A verification link has been sent to your email." };
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A user with this email or employee ID already exists. Please use a different one." };
    }
    return { error: "A database error occurred. Please try again later." };
  }
}
